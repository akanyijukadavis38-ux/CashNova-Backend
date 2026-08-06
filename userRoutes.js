const express = require("express");
const router = express.Router();

const User = require("./User");
const Deposit = require("./Deposit");



// CREATE ACCOUNT NUMBER

function createAccountNumber(){

return "CN" + Math.floor(
100000 + Math.random() * 900000
);

}



// CREATE REFERRAL CODE

function createReferralCode(){

return "CN" + Math.floor(
100000 + Math.random() * 900000
);

}



// =================================
// REGISTER USER
// =================================

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
// DETECT MOBILE NETWORK

let network = "Unknown";

let cleanPhone = phone.replace(/\D/g,"");


if(
cleanPhone.startsWith("25670") ||
cleanPhone.startsWith("25676") ||
cleanPhone.startsWith("25677") ||
cleanPhone.startsWith("25678") ||
cleanPhone.startsWith("25679")
){

network = "MTN";

}


if(
cleanPhone.startsWith("25674") ||
cleanPhone.startsWith("25675")
){

network = "Airtel";

}


// CHECK EXISTING USER

const existingUser =
await User.findOne({

$or:[

{username:username},

{email:email},

{phone:phone}

]

});



if(existingUser){

return res.status(400).json({

message:"Account already exists"

});

}




// REGISTRATION BONUS RECORD

const registrationRecord = {

type:"Registration Bonus",

amount:5000,

status:"Locked",

date:new Date().toLocaleString()

};





// CREATE USER

const newUser = new User({



accountNumber:
createAccountNumber(),



fullName:fullName,


username:username,


email:email,


phone:phone,

network:network,


password:password,



myReferralCode:
createReferralCode(),



referredBy:
referredBy || "",




// BONUS APPEARS IN WALLET BUT LOCKED

walletBalance:5000,


registrationBonus:5000,


registrationBonusStatus:"Locked",


registrationBonusUnlocked:false,



firstDepositCompleted:false,




incomeRecords:[],


transactionHistory:[

registrationRecord

]



});





await newUser.save();





res.json({

message:"Registration successful",

user:newUser

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});








// =================================
// LOGIN USER
// =================================

router.post("/login", async function(req,res){

try{


const user =
await User.findOne({

username:req.body.username,

password:req.body.password

});



if(!user){

return res.status(400).json({

message:"Invalid login details"

});

}



res.json({

message:"Login successful",

user:user

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});








// =================================
// GET USER BY ID
// =================================

router.get("/:id", async function(req,res){

try{


const user =
await User.findById(req.params.id);



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
// =================================
// PURCHASE PRODUCT
// =================================

router.post("/purchase/:id", async function(req,res){

try{


const user =
await User.findById(req.params.id);



if(!user){

return res.status(404).json({

message:"User not found"

});

}



const {

name,

price,

dailyIncome,

startDate,

endDate

} = req.body;




// CHECK WALLET

if(
Number(user.walletBalance || 0)
<
Number(price)
){

return res.status(400).json({

message:"Insufficient wallet balance"

});

}




// CREATE PRODUCT RECORD

const purchasedProduct = {


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
Number(user.walletBalance || 0)
-
Number(price);





// SAVE PRODUCT
if(!user.purchasedProducts){
    user.purchasedProducts = [];
}

if(!user.transactionHistory){
    user.transactionHistory = [];
}
user.purchasedProducts.push(
purchasedProduct
);





// TRANSACTION RECORD

user.transactionHistory.push({

type:"Product Purchase",

product:name,

amount:Number(price),

status:"Completed",

date:new Date().toLocaleString()

});





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









// =================================
// DAILY INVESTMENT INCOME
// =================================

router.post("/daily-income/:id", async function(req,res){

try{


const user =
await User.findById(req.params.id);



if(!user){

return res.status(404).json({

message:"User not found"

});

}



let updated=false;


let now=new Date();





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
(now - lastIncome)
/
(1000 * 60 * 60);





if(hoursPassed >= 24){



// ADD TO WALLET

user.walletBalance =
Number(user.walletBalance || 0)
+
Number(product.dailyIncome);




// ADD TO CUMULATIVE INCOME

user.cumulativeIncome =
Number(user.cumulativeIncome || 0)
+
Number(product.dailyIncome);





// UPDATE PRODUCT

product.totalEarned =
Number(product.totalEarned || 0)
+
Number(product.dailyIncome);



product.lastIncomeDate = now;











// TRANSACTION RECORD

user.transactionHistory.push({

type:"Daily Income",

amount:Number(product.dailyIncome),

product:product.name,

status:"Completed",

date:now.toLocaleString()

});





updated=true;



}



});



if(updated){

user.markModified("purchasedProducts");

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
// =================================
// CREATE DEPOSIT REQUEST
// =================================

router.post("/deposit", async function(req,res){

try{


const {

userId,

username,

amount,

method,

mobileMoneyTransactionId


}=req.body;




const deposit = new Deposit({


userId:userId,


username:username,


amount:Number(amount),


method:method,


mobileMoneyTransactionId:mobileMoneyTransactionId,


status:"Pending",


date:new Date()


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








// =================================
// ADMIN GET DEPOSITS
// =================================

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









// =================================
// ADMIN APPROVE DEPOSIT
// =================================

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





// ADD DEPOSIT TO WALLET

user.walletBalance =
Number(user.walletBalance || 0)
+
Number(deposit.amount);







// UPDATE TOTAL DEPOSIT

user.totalDeposits =
Number(user.totalDeposits || 0)
+
Number(deposit.amount);








// FIRST DEPOSIT APPROVAL

if(user.firstDepositCompleted !== true){



user.firstDepositCompleted = true;




// UNLOCK BONUS

if(user.registrationBonusUnlocked !== true){



user.registrationBonusUnlocked = true;



user.registrationBonusStatus =
"Unlocked";





// ADD BONUS TO CUMULATIVE INCOME

user.cumulativeIncome =
Number(user.cumulativeIncome || 0)
+
Number(user.registrationBonus || 5000);






user.incomeRecords.push({

type:"Registration Bonus",

amount:Number(user.registrationBonus || 5000),

status:"Completed",

date:new Date().toLocaleString()

});





user.transactionHistory.push({

type:"Registration Bonus",

amount:Number(user.registrationBonus || 5000),

status:"Completed",

date:new Date().toLocaleString()

});



}



}






// DEPOSIT RECORD

user.depositRecords.push({

type:"Deposit",

amount:Number(deposit.amount),

status:"Credited",

date:new Date().toLocaleString()

});







// UPDATE DEPOSIT STATUS

deposit.status="Credited";


deposit.approvedDate=new Date();







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
// =================================
// ADMIN GET ALL USERS
// =================================

router.get("/", async function(req,res){

try{

const users = await User.find();

res.json(users);

}
catch(error){

res.status(500).json({
message:error.message
});

}

});

module.exports = router;
