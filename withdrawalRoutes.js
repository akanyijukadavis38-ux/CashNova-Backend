const express = require("express");
const router = express.Router();

const Withdrawal = require("./Withdrawal");
const User = require("./User");


// CREATE WITHDRAWAL REQUEST

router.post("/", async function(req,res){

try{

const withdrawal = new Withdrawal({

userId: req.body.userId,

username: req.body.username,

phone: req.body.phone,

amount: req.body.amount,

fee: req.body.fee || 0,

receiveAmount: req.body.receiveAmount,

status:"Pending",

date:new Date()

});


await withdrawal.save();


res.json({

message:"Withdrawal submitted successfully",

withdrawal:withdrawal

});


}catch(error){

res.status(500).json({

message:error.message

});

}

});




// GET ALL WITHDRAWALS FOR ADMIN

router.get("/", async function(req,res){

try{


const withdrawals =
await Withdrawal.find()
.sort({date:-1});


res.json(withdrawals);


}catch(error){

res.status(500).json({

message:error.message

});

}

});





// APPROVE WITHDRAWAL

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
await User.findOne({

username:withdrawal.username

});



if(user){


if(!user.withdrawalRecords){

user.withdrawalRecords=[];

}


user.withdrawalRecords.push({

amount:withdrawal.amount,

status:"Approved",

date:new Date()

});



if(!user.transactionHistory){

user.transactionHistory=[];

}



user.transactionHistory.push({

type:"Withdrawal",

amount:withdrawal.amount,

status:"Approved",

date:new Date()

});



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






// REJECT WITHDRAWAL

router.post("/reject/:id", async function(req,res){

try{


const withdrawal =
await Withdrawal.findById(req.params.id);



if(!withdrawal){

return res.status(404).json({

message:"Withdrawal not found"

});

}



withdrawal.status="Rejected";


await withdrawal.save();



res.json({

message:"Withdrawal rejected",

withdrawal:withdrawal

});



}catch(error){

res.status(500).json({

message:error.message

});

}

});





module.exports = router;