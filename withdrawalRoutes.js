const express = require("express");
const router = express.Router();

const Withdrawal = require("./Withdrawal");
const User = require("./User");


// =====================================
// CREATE WITHDRAWAL REQUEST
// =====================================

router.post("/", async function(req,res){

try{


const user =
await User.findById(req.body.userId);



if(!user){

return res.status(404).json({

message:"User not found"

});

}




const amount =
Number(req.body.amount);



if(amount < 5000){

return res.status(400).json({

message:"Minimum withdrawal is UGX 5,000"

});

}





if(Number(user.walletBalance || 0) < amount){

return res.status(400).json({

message:"Insufficient wallet balance"

});

}





// CHECK FIRST DEPOSIT

if(user.firstDepositCompleted !== true){

return res.status(400).json({

message:"Complete first deposit before withdrawal"

});

}




// CHECK PRODUCT PURCHASE

if(
!user.purchasedProducts ||
user.purchasedProducts.length === 0
){

return res.status(400).json({

message:"Purchase a product before withdrawal"

});

}




// CALCULATE FEE

const fee =
amount * 14 / 100;


const receiveAmount =
amount - fee;





// DEDUCT WALLET IMMEDIATELY

user.walletBalance =
Number(user.walletBalance || 0)
-
amount;





// CREATE WITHDRAWAL

const withdrawal =
new Withdrawal({

userId:user._id,

username:user.username,

phone:req.body.phone || user.phone,

amount:amount,

fee:fee,

receiveAmount:receiveAmount,

status:"Pending",

date:new Date()

});





await withdrawal.save();





// SAVE WITHDRAWAL HISTORY

if(!user.withdrawalRecords){

user.withdrawalRecords=[];

}



user.withdrawalRecords.push({

withdrawalId:withdrawal._id,

amount:amount,

fee:fee,

receiveAmount:receiveAmount,

status:"Pending",

date:new Date()

});





// SAVE TRANSACTION HISTORY

if(!user.transactionHistory){

user.transactionHistory=[];

}



user.transactionHistory.push({

withdrawalId:withdrawal._id,

type:"Withdrawal",

amount:amount,

fee:fee,

receiveAmount:receiveAmount,

status:"Pending",

date:new Date()

});





await user.save();





res.json({

message:"Withdrawal submitted successfully",

withdrawal:withdrawal,

walletBalance:user.walletBalance

});



}catch(error){


res.status(500).json({

message:error.message

});


}


});




// GET ALL WITHDRAWALS FOR ADMIN
// OLDEST FIRST

router.get("/", async function(req,res){

try{

const withdrawals =
await Withdrawal.find()
.sort({date:1});

res.json(withdrawals);

}catch(error){

res.status(500).json({

message:error.message

});

}

});








// =====================================
// APPROVE WITHDRAWAL
// =====================================

router.post("/approve/:id", async function(req,res){

try{


const withdrawal =
await Withdrawal.findById(req.params.id);



if(!withdrawal){

return res.status(404).json({

message:"Withdrawal not found"

});

}





withdrawal.status="Approved";

withdrawal.approvedDate=new Date();


await withdrawal.save();





const user =
await User.findById(withdrawal.userId);





if(user){



// UPDATE SAME WITHDRAWAL RECORD

if(user.withdrawalRecords){


user.withdrawalRecords.forEach(function(record){


if(
String(record.withdrawalId)
===
String(withdrawal._id)
){

record.status="Approved";

record.approvedDate=new Date();

}


});


}





// UPDATE SAME TRANSACTION RECORD

if(user.transactionHistory){


user.transactionHistory.forEach(function(record){


if(
String(record.withdrawalId)
===
String(withdrawal._id)
){

record.status="Approved";

record.approvedDate=new Date();

}


});


}





await user.save();


}





res.json({

message:"Withdrawal approved",

withdrawal:withdrawal

});




}catch(error){


res.status(500).json({

message:error.message

});


}

});








// =====================================
// REJECT WITHDRAWAL
// =====================================

router.post("/reject/:id", async function(req,res){

try{


const withdrawal =
await Withdrawal.findById(req.params.id);



if(!withdrawal){

return res.status(404).json({

message:"Withdrawal not found"

});

}





const user =
await User.findById(withdrawal.userId);





if(user){



// RETURN MONEY

user.walletBalance =
Number(user.walletBalance || 0)
+
Number(withdrawal.amount || 0);





// UPDATE WITHDRAWAL RECORD

if(user.withdrawalRecords){


user.withdrawalRecords.forEach(function(record){


if(
String(record.withdrawalId)
===
String(withdrawal._id)
){

record.status="Rejected";

record.rejectedDate=new Date();

}


});


}






// UPDATE TRANSACTION HISTORY

if(user.transactionHistory){


user.transactionHistory.forEach(function(record){


if(
String(record.withdrawalId)
===
String(withdrawal._id)
){

record.status="Rejected";

record.rejectedDate=new Date();

}


});


}





await user.save();


}





withdrawal.status="Rejected";

withdrawal.rejectedDate=new Date();


await withdrawal.save();





res.json({

message:"Withdrawal rejected and money returned",

withdrawal:withdrawal

});




}catch(error){


res.status(500).json({

message:error.message

});


}

});






module.exports = router;
