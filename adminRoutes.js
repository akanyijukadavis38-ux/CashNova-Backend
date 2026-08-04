const express = require("express");
const router = express.Router();

const User = require("./User");


// =====================================
// GET ACTIVE USERS
// =====================================

router.get("/active-users", async function(req,res){

try{

const users = await User.find({

$or:[
{
accountActivated:true
},
{
firstDepositCompleted:true
}

]

});


res.json(users);


}catch(error){

res.status(500).json({

message:error.message

});

}

});




// =====================================
// GET FINANCIAL RECORDS
// =====================================

router.get("/financial-records", async function(req,res){

try{


const users = await User.find();


let records=[];



users.forEach(function(user){



// DEPOSITS

if(user.depositRecords){

user.depositRecords.forEach(function(record){

records.push({

username:user.username,

type:"Deposit",

amount:record.amount,

status:record.status,

date:record.date

});


});

}



// WITHDRAWALS

if(user.withdrawalRecords){

user.withdrawalRecords.forEach(function(record){

records.push({

username:user.username,

type:"Withdrawal",

amount:record.amount,

status:record.status,

date:record.date

});


});

}



// INCOME

if(user.incomeRecords){

user.incomeRecords.forEach(function(record){

records.push({

username:user.username,

type:record.type,

amount:record.amount,

status:record.status,

date:record.date

});


});

}



});




res.json(records);



}catch(error){


res.status(500).json({

message:error.message

});


}


});







// =====================================
// GET INCOME RECORDS
// =====================================

router.get("/income-records", async function(req,res){

try{


const users = await User.find();


let records=[];



users.forEach(function(user){


if(user.incomeRecords){


user.incomeRecords.forEach(function(record){


records.push({

username:user.username,

type:record.type,

amount:record.amount,

status:record.status,

date:record.date


});


});


}


});



res.json(records);



}catch(error){


res.status(500).json({

message:error.message

});


}


});






// =====================================
// GET REFERRAL RECORDS
// =====================================

router.get("/referral-records", async function(req,res){

try{


const users = await User.find();


let records=[];



users.forEach(function(user){


if(user.transactionHistory){


user.transactionHistory.forEach(function(record){



if(
record.type &&
record.type.toLowerCase().includes("referral")
){


records.push({

username:user.username,

type:record.type,

amount:record.amount,

status:record.status,

date:record.date


});


}



});


}



});



res.json(records);



}catch(error){


res.status(500).json({

message:error.message

});


}


});





module.exports = router;
