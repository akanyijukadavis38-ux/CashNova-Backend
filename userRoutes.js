const express = require("express");
const router = express.Router();
const User = require("./User");



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





module.exports = router;