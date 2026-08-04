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


// =====================================
// GET ALL USERS
// =====================================

router.get("/users", async function(req,res){

try{

const users = await User.find();

res.json(users);


}catch(error){

res.status(500).json({
message:error.message
});

}

});
// =====================================
// GET DEPOSIT RECORDS
// =====================================

router.get("/deposit-records", async function(req,res){

try{

const users = await User.find();

let records=[];


users.forEach(function(user){

if(user.depositRecords){

user.depositRecords.forEach(function(record){

records.push({

username:user.username,

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
// GET WITHDRAWAL RECORDS
// =====================================

router.get("/withdrawal-records", async function(req,res){

try{

const users = await User.find();

let records=[];


users.forEach(function(user){

if(user.withdrawalRecords){

user.withdrawalRecords.forEach(function(record){

records.push({

username:user.username,

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
// ANNOUNCEMENTS
// =====================================

const Announcement = require("./Announcement");


// GET ANNOUNCEMENTS

router.get("/announcements", async function(req,res){

try{

const announcements =
await Announcement.find()
.sort({date:-1});


res.json(announcements);


}catch(error){

res.status(500).json({
message:error.message
});

}

});



// CREATE ANNOUNCEMENT

router.post("/announcements", async function(req,res){

try{


const announcement =
new Announcement({

title:req.body.title,

message:req.body.message,

date:new Date()

});


await announcement.save();


res.json({

message:"Announcement created successfully",

announcement:announcement

});


}catch(error){

res.status(500).json({
message:error.message
});

}

});




// DELETE ANNOUNCEMENT

router.delete("/announcements/:id", async function(req,res){

try{


await Announcement.findByIdAndDelete(
req.params.id
);


res.json({

message:"Announcement deleted"

});


}catch(error){

res.status(500).json({
message:error.message
});

}

});
// =====================================
// ADMIN SETTINGS
// =====================================

const Settings = require("./Settings");


// GET SETTINGS

router.get("/settings", async function(req,res){

try{


let settings =
await Settings.findOne();


res.json(settings || {});


}catch(error){

res.status(500).json({
message:error.message
});

}

});




// UPDATE SETTINGS

router.put("/settings", async function(req,res){

try{


let settings =
await Settings.findOne();



if(!settings){

settings =
new Settings(req.body);

}else{


settings.platformName =
req.body.platformName;


settings.supportContact =
req.body.supportContact;


settings.minimumDeposit =
req.body.minimumDeposit;


settings.minimumWithdrawal =
req.body.minimumWithdrawal;


settings.withdrawalFee =
req.body.withdrawalFee;


settings.dailyWithdrawalLimit =
req.body.dailyWithdrawalLimit;


}



await settings.save();



res.json({

message:"Settings updated",

settings:settings

});


}catch(error){

res.status(500).json({
message:error.message
});

}

});
// =====================================
// MAINTENANCE STATUS
// =====================================

router.get("/maintenance", async function(req,res){

try{


const settings =
await Settings.findOne();


res.json({

status:
settings ?
settings.maintenanceStatus
:
"active"


});


}catch(error){

res.status(500).json({
message:error.message
});

}

});





router.put("/maintenance", async function(req,res){

try{


let settings =
await Settings.findOne();



if(!settings){

settings =
new Settings();

}



settings.maintenanceStatus =
req.body.status;



await settings.save();



res.json({

message:"Maintenance updated",

status:settings.maintenanceStatus

});


}catch(error){

res.status(500).json({
message:error.message
});

}

});

module.exports = router;
