const express = require("express");
const router = express.Router();
const Deposit = require("./Deposit");
const User = require("./User");


// CREATE DEPOSIT REQUEST

router.post("/", async function(req,res){

try{

const deposit = new Deposit({

userId: req.body.userId,

username: req.body.username,

amount: req.body.amount,

method: req.body.method,

mobileMoneyTransactionId: req.body.mobileMoneyTransactionId,

status: "Pending",

date: new Date()

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




// GET ALL PENDING DEPOSITS FOR ADMIN

router.get("/", async function(req,res){

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





// APPROVE DEPOSIT

router.post("/approve/:id", async function(req,res){

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



// TOTAL DEPOSIT

user.totalDeposits =
Number(user.totalDeposits || 0)
+
Number(deposit.amount);



deposit.status="Credited";



await user.save();

await deposit.save();



res.json({

message:"Deposit approved",

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