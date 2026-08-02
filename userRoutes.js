const express = require("express");
const router = express.Router();
const User = require("./User");
const Deposit = require("./Deposit");


// CREATE UNIQUE ACCOUNT NUMBER

function createAccountNumber(){

    return "CN" + Math.floor(
        100000 + Math.random() * 900000
    );

}


// CREATE UNIQUE REFERRAL CODE

function createReferralCode(){

    return "CN" + Math.floor(
        100000 + Math.random() * 900000
    );

}



// ===============================
// REGISTER USER
// ===============================

router.post("/register", async function(req,res){

try{


const {

fullName,
username,
email,
phone,
password,
referredBy

} = req.body;



// CHECK EXISTING USER

let existingUser =
await User.findOne({

$or:[

{username:username},

{email:email},

{phone:phone}

]

});



if(existingUser){

return res.status(400).json({

message:
"Account already exists"

});

}



// CREATE REGISTRATION RECORD

let registrationRecord = {


type:"Registration Bonus",

amount:5000,

status:"Locked",

date:new Date().toLocaleString()

};




// CREATE USER

let newUser = new User({


accountNumber:
createAccountNumber(),


fullName:fullName,


username:username,


email:email,


phone:phone,


password:password,



myReferralCode:
createReferralCode(),



referredBy:
referredBy || "",



walletBalance:5000,


registrationBonus:5000,


registrationBonusStatus:"Locked",


registrationBonusUnlocked:false,


firstDepositCompleted:false,



incomeRecords:[

registrationRecord

],



transactionHistory:[

registrationRecord

]



});





await newUser.save();




res.json({

message:
"Registration successful",

user:newUser

});



}catch(error){


res.status(500).json({

message:error.message

});


}



});






// ===============================
// LOGIN USER
// ===============================


router.post("/login", async function(req,res){


try{


let user =
await User.findOne({

username:req.body.username,

password:req.body.password

});



if(!user){

return res.status(400).json({

message:
"Invalid login details"

});

}



res.json({

message:
"Login successful",

user:user

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});

// ===============================
// GET USER DATA BY ID
// ===============================

router.get("/:id", async function(req,res){

try{


const user = await User.findById(req.params.id);


if(!user){

return res.status(404).json({

message:"User not found"

});

}



res.json(user);



}catch(error){


res.status(500).json({

message:error.message

});


}


});

// ===============================
// PURCHASE PRODUCT
// ===============================

router.post("/purchase/:id", async function(req,res){

try{


const user = await User.findById(req.params.id);



if(!user){

return res.status(404).json({

message:"User not found"

});

}



// Get product details from frontend

const {

name,

price,

dailyIncome,

startDate,

endDate

} = req.body;




// CHECK WALLET BALANCE

if(Number(user.walletBalance) < Number(price)){


return res.status(400).json({

message:"Insufficient wallet balance"

});


}



// CREATE PURCHASE RECORD

let purchasedProduct = {


id:Date.now(),

name:name,

price:Number(price),

dailyIncome:Number(dailyIncome),

startDate:startDate,

endDate:endDate,

totalEarned:0,

status:"Active",

purchaseDate:new Date()

};




// DEDUCT WALLET

user.walletBalance =
Number(user.walletBalance)
-
Number(price);



// SAVE PRODUCT

user.purchasedProducts.push(
purchasedProduct
);




// ADD TRANSACTION RECORD

user.transactionHistory.push({

type:"Product Purchase",

product:name,

amount:Number(price),

status:"Completed",

date:new Date().toLocaleString()

});




// SAVE TO MONGODB

await user.save();




res.json({

message:"Purchase successful",

user:user

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});
// ===============================
// UPDATE DAILY INVESTMENT INCOME
// ===============================

router.post("/daily-income/:id", async function(req,res){

try{


const user =
await User.findById(req.params.id);



if(!user){

return res.status(404).json({

message:"User not found"

});

}



let updated = false;



let now = new Date();



user.purchasedProducts.forEach(function(product){



if(product.status !== "Active"){

return;

}



let lastIncome =
product.lastIncomeDate
?
new Date(product.lastIncomeDate)
:
new Date(product.purchaseDate);



let hoursPassed =
(now - lastIncome) /
(1000 * 60 * 60);



if(hoursPassed >= 24){



user.walletBalance =
Number(user.walletBalance || 0)
+
Number(product.dailyIncome);



product.totalEarned =
Number(product.totalEarned || 0)
+
Number(product.dailyIncome);



product.lastIncomeDate =
now;



user.incomeRecords.push({

type: product.name + " Daily Income",

amount: product.dailyIncome,

status:"Completed",

date:now.toLocaleString()

});



updated = true;


}



});



if(updated){

await user.save();

}



res.json({

message:"Income checked successfully",

user:user

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});
// ===============================
// CREATE DEPOSIT REQUEST
// ===============================

router.post("/deposit", async function(req,res){

try{


const {
userId,
username,
amount,
method,
mobileMoneyTransactionId

} = req.body;



const deposit = new Deposit({

userId:userId,

username:username,

amount:Number(amount),

method:method,

mobileMoneyTransactionId:mobileMoneyTransactionId,

status:"Pending"

});



await deposit.save();



res.json({

message:"Deposit submitted successfully",

deposit:deposit

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});





// ===============================
// ADMIN GET PENDING DEPOSITS
// ===============================

router.get("/admin/deposits", async function(req,res){

try{


const deposits =
await Deposit.find()
.sort({date:-1});



res.json(deposits);



}catch(error){


res.status(500).json({

message:error.message

});


}

});






// ===============================
// ADMIN APPROVE DEPOSIT
// ===============================

router.put("/admin/deposit/approve/:id", async function(req,res){

try{


const deposit =
await Deposit.findById(req.params.id);



if(!deposit){

return res.status(404).json({

message:"Deposit not found"

});

}



const user =
await User.findById(deposit.userId);



if(!user){

return res.status(404).json({

message:"User not found"

});

}




// CREDIT WALLET

user.walletBalance =
Number(user.walletBalance || 0)
+
Number(deposit.amount);



// UPDATE TOTAL DEPOSIT

user.totalDeposits =
Number(user.totalDeposits || 0)
+
Number(deposit.amount);




// UPDATE DEPOSIT STATUS

deposit.status = "Credited";

deposit.approvedDate = new Date();



await user.save();

await deposit.save();




res.json({

message:"Deposit approved successfully",

user:user,

deposit:deposit

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});
module.exports = router;