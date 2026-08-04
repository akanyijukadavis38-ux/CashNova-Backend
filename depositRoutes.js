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
if(!user.incomeRecords){
    user.incomeRecords = [];
}

if(!user.transactionHistory){
    user.transactionHistory = [];
}

if(!user.depositRecords){
    user.depositRecords = [];
}


// CREDIT WALLET
user.walletBalance =
Number(user.walletBalance || 0) +
Number(deposit.amount);

// UPDATE TOTAL DEPOSITS
user.totalDeposits =
Number(user.totalDeposits || 0) +
Number(deposit.amount);

// FIRST DEPOSIT
if(user.firstDepositCompleted !== true){

    user.firstDepositCompleted = true;
    user.accountActivated = true;

    // UNLOCK REGISTRATION BONUS
    if(user.registrationBonusUnlocked !== true){

        user.registrationBonusUnlocked = true;
        user.registrationBonusStatus = "Unlocked";

        user.cumulativeIncome =
        Number(user.cumulativeIncome || 0) +
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

// =====================================
// GET DEPOSIT RECORDS
// =====================================

router.get("/deposit-records", async function(req,res){

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

// SAVE TRANSACTION
user.transactionHistory.push({
    type:"Deposit",
    amount:Number(deposit.amount),
    status:"Credited",
    date:new Date().toLocaleString()
});

// UPDATE DEPOSIT STATUS
deposit.status = "Credited";
deposit.approvedDate = new Date();




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
