const express = require("express");
const router = express.Router();

const User = require("./User");
const Deposit = require("./Deposit");
const Withdrawal = require("./Withdrawal");



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


// =================================
// SAVE USER
// =================================

await newUser.save();


// =================================
// BUILD REFERRAL NETWORK
// =================================

if (referredBy) {

    const referrer = await User.findOne({
        myReferralCode: referredBy
    });

    if (referrer) {

        // =================================
        // LEVEL 1
        // =================================

        if (!referrer.teamMembers) {
            referrer.teamMembers = [];
        }

        referrer.teamMembers.push({

            userId: newUser._id,

            username: newUser.username,

            level: 1,

            firstDepositAmount: 0,

            depositStatus: "Not yet deposited",

            joinedDate: new Date()

        });

        await referrer.save();


        // =================================
        // LEVEL 2
        // =================================

        if (referrer.referredBy) {

            const level2Referrer =
                await User.findOne({
                    myReferralCode: referrer.referredBy
                });

            if (level2Referrer) {

                if (!level2Referrer.teamMembers) {
                    level2Referrer.teamMembers = [];
                }

                level2Referrer.teamMembers.push({

                    userId: newUser._id,

                    username: newUser.username,

                    level: 2,

                    firstDepositAmount: 0,

                    depositStatus: "Not yet deposited",

                    joinedDate: new Date()

                });

                await level2Referrer.save();


                // =================================
                // LEVEL 3
                // =================================

                if (level2Referrer.referredBy) {

                    const level3Referrer =
                        await User.findOne({
                            myReferralCode:
                                level2Referrer.referredBy
                        });

                    if (level3Referrer) {

                        if (!level3Referrer.teamMembers) {
                            level3Referrer.teamMembers = [];
                        }

                        level3Referrer.teamMembers.push({

                            userId: newUser._id,

                            username: newUser.username,

                            level: 3,

                            firstDepositAmount: 0,

                            depositStatus: "Not yet deposited",

                            joinedDate: new Date()

                        });

                        await level3Referrer.save();

                    }

                }

            }

        }

    }

}


// =================================
// REGISTRATION RESPONSE
// =================================

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

router.put("/admin/deposit/approve/:id", async function(req, res){

try {

    // =================================
    // FIND DEPOSIT
    // =================================

    const deposit =
        await Deposit.findById(req.params.id);

    if(!deposit){

        return res.status(404).json({
            message:"Deposit not found"
        });

    }


    // =================================
    // PREVENT DOUBLE APPROVAL
    // =================================

    if(deposit.status === "Credited"){

        return res.status(400).json({
            message:"This deposit has already been approved"
        });

    }


    // =================================
    // FIND USER
    // =================================

    const user =
        await User.findById(deposit.userId);

    if(!user){

        return res.status(404).json({
            message:"User not found"
        });

    }


    // =================================
    // MAKE SURE ARRAYS EXIST
    // =================================

    if(!Array.isArray(user.incomeRecords)){
        user.incomeRecords = [];
    }

    if(!Array.isArray(user.transactionHistory)){
        user.transactionHistory = [];
    }

    if(!Array.isArray(user.depositRecords)){
        user.depositRecords = [];
    }


    // =================================
    // IMPORTANT:
    // CHECK FIRST APPROVED DEPOSIT
    // =================================

    const isFirstDeposit =
        user.firstDepositCompleted !== true;


    const depositAmount =
        Number(deposit.amount || 0);


    // =================================
    // CREDIT USER WALLET
    // =================================

    user.walletBalance =
        Number(user.walletBalance || 0)
        +
        depositAmount;


    // =================================
    // UPDATE USER TOTAL DEPOSITS
    // =================================

    user.totalDeposits =
        Number(user.totalDeposits || 0)
        +
        depositAmount;


    // =================================
    // FIRST DEPOSIT ONLY
    // =================================

    if(isFirstDeposit){

        user.firstDepositCompleted = true;

        user.accountActivated = true;


        // =================================
        // UNLOCK REGISTRATION BONUS
        // =================================

        if(user.registrationBonusUnlocked !== true){

            user.registrationBonusUnlocked = true;

            user.registrationBonusStatus =
                "Unlocked";


            const bonus =
                Number(user.registrationBonus || 5000);


            user.cumulativeIncome =
                Number(user.cumulativeIncome || 0)
                +
                bonus;


            user.incomeRecords.push({

                type:"Registration Bonus",

                amount:bonus,

                status:"Completed",

                date:new Date().toLocaleString()

            });


            user.transactionHistory.push({

                type:"Registration Bonus",

                amount:bonus,

                status:"Completed",

                date:new Date().toLocaleString()

            });

        }


        // =================================
        // FIND ALL REFERRERS
        // =================================

        const referrers =
            await User.find({

                "teamMembers.userId":
                    user._id

            });


        // =================================
        // UPDATE REFERRAL NETWORK
        // =================================

        for(const referrer of referrers){

            if(!Array.isArray(referrer.teamMembers)){
                continue;
            }


            let referrerChanged = false;


            for(const member of referrer.teamMembers){

                if(
                    String(member.userId) !==
                    String(user._id)
                ){
                    continue;
                }


                const level =
                    Number(member.level || 0);


                // =================================
                // FIRST DEPOSIT AMOUNT
                // =================================

                member.firstDepositAmount =
                    depositAmount;

                member.depositStatus =
                    "Active";

                referrerChanged = true;


                // =================================
                // COMMISSION RATE
                // =================================

                let percentage = 0;


                if(level === 1){

                    percentage = 0.20;

                }
                else if(level === 2){

                    percentage = 0.03;

                }
                else if(level === 3){

                    percentage = 0.01;

                }


                if(percentage <= 0){
                    continue;
                }


                // =================================
                // CALCULATE FIRST-DEPOSIT
                // COMMISSION
                // =================================

                const commission =
                    depositAmount * percentage;


                // =================================
                // REFERRER WALLET
                // =================================

                referrer.walletBalance =
                    Number(referrer.walletBalance || 0)
                    +
                    commission;


                // =================================
                // REFERRAL INCOME
                // =================================

                referrer.referralIncome =
                    Number(referrer.referralIncome || 0)
                    +
                    commission;


                // =================================
                // CUMULATIVE INCOME
                // =================================

                referrer.cumulativeIncome =
                    Number(referrer.cumulativeIncome || 0)
                    +
                    commission;


                // =================================
                // INCOME RECORD
                // =================================

                if(!Array.isArray(referrer.incomeRecords)){
                    referrer.incomeRecords = [];
                }


                referrer.incomeRecords.push({

                    type:"Referral Commission",

                    amount:commission,

                    level:level,

                    referredUsername:
                        user.username,

                    firstDepositAmount:
                        depositAmount,

                    status:"Completed",

                    date:new Date().toLocaleString()

                });


                // =================================
                // TRANSACTION HISTORY
                // =================================

                if(!Array.isArray(referrer.transactionHistory)){
                    referrer.transactionHistory = [];
                }


                referrer.transactionHistory.push({

                    type:"Referral Commission",

                    amount:commission,

                    level:level,

                    referredUsername:
                        user.username,

                    firstDepositAmount:
                        depositAmount,

                    status:"Completed",

                    date:new Date().toLocaleString()

                });

            }


            // =================================
            // SAVE REFERRER
            // =================================

            if(referrerChanged){

                referrer.markModified(
                    "teamMembers"
                );

                await referrer.save();

            }

        }

    }


    // =================================
    // USER DEPOSIT RECORD
    // =================================

    user.depositRecords.push({

        type:"Deposit",

        amount:depositAmount,

        status:"Credited",

        date:new Date().toLocaleString()

    });


    // =================================
    // USER TRANSACTION HISTORY
    // =================================

    user.transactionHistory.push({

        type:"Deposit",

        amount:depositAmount,

        status:"Credited",

        date:new Date().toLocaleString(),

        mobileMoneyTransactionId:
            deposit.mobileMoneyTransactionId || ""

    });


    // =================================
    // MARK DEPOSIT AS CREDITED
    // =================================

    deposit.status =
        "Credited";

    deposit.approvedDate =
        new Date();


    // =================================
    // SAVE USER
    // =================================

    await user.save();


    // =================================
    // SAVE DEPOSIT
    // =================================

    await deposit.save();


    // =================================
    // RESPONSE
    // =================================

    res.json({

        message:
            "Deposit approved successfully",

        firstDeposit:
            isFirstDeposit,

        firstDepositAmount:
            isFirstDeposit
                ? depositAmount
                : 0,

        user:user,

        deposit:deposit

    });


}
catch(error){

    console.log(
        "Approve deposit error:",
        error
    );

    res.status(500).json({

        message:error.message

    });

}

});


// =================================
// CREATE WITHDRAWAL REQUEST
// =================================

router.post("/withdrawals", async function(req,res){

try{


const {

userId,
amount,
phone

} = req.body;



const user =
await User.findById(userId);



if(!user){

return res.status(404).json({

message:"User not found"

});

}



// CHECK BALANCE

if(
Number(user.walletBalance || 0)
<
Number(amount)
){

return res.status(400).json({

message:"Insufficient balance"

});

}



// CALCULATE FEE

const fee =
Number(amount) * 14 / 100;


const receiveAmount =
Number(amount) - fee;




// CREATE WITHDRAWAL RECORD

const withdrawal = {


amount:Number(amount),

fee:Number(fee),

receiveAmount:Number(receiveAmount),

phone:user.phone,

network:user.network,

status:"Pending",

date:new Date().toLocaleString()

};




// SAVE RECORD

if(!user.withdrawalRecords){

user.withdrawalRecords=[];

}


user.withdrawalRecords.push(withdrawal);




// DEDUCT BALANCE AFTER REQUEST

user.walletBalance =
Number(user.walletBalance || 0)
-
Number(amount);





user.transactionHistory.push({

type:"Withdrawal",

amount:Number(amount),

status:"Pending",

date:new Date().toLocaleString()

});




await user.save();





res.json({

message:"Withdrawal request submitted",

walletBalance:user.walletBalance,

withdrawal:withdrawal

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
// =================================
// USER TRANSACTION HISTORY
// =================================

router.get("/history/:id", async function(req, res){

try{

const userId = req.params.id;


// FIND USER

const user =
await User.findById(userId).lean();

if(!user){

return res.status(404).json({

message:"User not found"

});

}


// =================================
// GET REAL DEPOSITS
// =================================

const deposits =
await Deposit.find({
userId:userId
})
.sort({date:-1})
.lean();


// =================================
// GET REAL WITHDRAWALS
// =================================

const withdrawals =
await Withdrawal.find({
userId:userId
})
.sort({date:-1})
.lean();


// =================================
// OTHER TRANSACTIONS
// =================================

let otherTransactions =
Array.isArray(user.transactionHistory)
?
user.transactionHistory.filter(function(record){

const type =
String(record.type || "").toLowerCase();


// Deposits and withdrawals are already
// coming from their real collections.

if(type.includes("deposit")){

return false;

}

if(type.includes("withdraw")){

return false;

}

return true;

})
:
[];


// =================================
// REMOVE EXACT DUPLICATES FROM
// OTHER TRANSACTIONS
// =================================

const uniqueTransactions = [];

const transactionKeys = new Set();


otherTransactions.forEach(function(record){

const key = [

String(record.type || ""),

String(record.product || ""),

String(record.amount || 0),

String(record.date || ""),

String(record.status || "")

].join("|");


if(!transactionKeys.has(key)){

transactionKeys.add(key);

uniqueTransactions.push(record);

}

});


// =================================
// FORMAT DEPOSITS
// =================================

const depositHistory =
deposits.map(function(deposit){

return {

type:"Deposit",

amount:Number(deposit.amount || 0),

status:deposit.status || "Pending",

date:deposit.date,

mobileMoneyTransactionId:
deposit.mobileMoneyTransactionId || "",

depositId:deposit._id,

method:deposit.method || ""

};

});


// =================================
// FORMAT WITHDRAWALS
// =================================

const withdrawalHistory =
withdrawals.map(function(withdrawal){

return {

type:"Withdrawal",

amount:Number(withdrawal.amount || 0),

fee:Number(withdrawal.fee || 0),

receiveAmount:
Number(withdrawal.receiveAmount || 0),

status:withdrawal.status || "Pending",

date:withdrawal.date,

withdrawalId:withdrawal._id,

phone:withdrawal.phone || "",

approvedDate:withdrawal.approvedDate || null

};

});


// =================================
// COMBINE EVERYTHING
// =================================

const history = [

...depositHistory,

...withdrawalHistory,

...uniqueTransactions

];


// =================================
// SORT NEWEST FIRST
// =================================

history.sort(function(a,b){

return new Date(b.date || 0) -
new Date(a.date || 0);

});


// =================================
// SEND HISTORY
// =================================

res.json({

history:history

});


}catch(error){

console.log(
"History error:",
error
);

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
// CASHNOVA REAL TEAM DATA
// COMMISSION SUMMARY + REAL DEPOSITS
// =================================

router.get("/team/:id", async function(req, res){

try {

    const owner =
        await User.findById(req.params.id).lean();

    if (!owner) {

        return res.status(404).json({
            message: "User not found"
        });

    }


    // =================================
    // GET ALL USERS
    // =================================

    const allUsers =
        await User.find({}).lean();


    // =================================
    // TEAM MEMBERS
    // =================================

    const teamMembers = [];


    // =================================
    // FIND FIRST APPROVED DEPOSIT
    // =================================

    async function getFirstDeposit(userId) {

        const deposit =
            await Deposit.findOne({

                userId: userId,

                status: "Credited"

            })
            .sort({
                approvedDate: 1,
                date: 1
            })
            .lean();


        if (!deposit) {

            return {

                amount: 0,

                status: "Not yet deposited"

            };

        }


        return {

            amount:
                Number(deposit.amount || 0),

            status:
                "Active"

        };

    }


    // =================================
    // ADD TEAM MEMBER
    // =================================

    async function addMember(user, level) {

        const deposit =
            await getFirstDeposit(user._id);


        let commissionRate = 0;


        if(level === 1){

            commissionRate = 0.20;

        }
        else if(level === 2){

            commissionRate = 0.03;

        }
        else if(level === 3){

            commissionRate = 0.01;

        }


        const commissionAmount =
            Number(deposit.amount || 0)
            *
            commissionRate;


        teamMembers.push({

            userId:
                user._id,

            username:
                user.username || "",

            fullName:
                user.fullName || "",

            level:
                level,

            firstDepositAmount:
                Number(deposit.amount || 0),

            commissionRate:
                commissionRate,

            commissionAmount:
                commissionAmount,

            depositStatus:
                deposit.status,

            joinedDate:
                user.createdAt || null

        });

    }


    // =================================
    // LEVEL 1
    // =================================

    const level1Users =
        allUsers.filter(function(user){

            return String(user.referredBy || "") ===
                String(owner.myReferralCode || "");

        });


    for(const user of level1Users){

        await addMember(user, 1);

    }


    // =================================
    // LEVEL 2
    // =================================

    for(const level1User of level1Users){

        const level2Users =
            allUsers.filter(function(user){

                return String(user.referredBy || "") ===
                    String(level1User.myReferralCode || "");

            });


        for(const user of level2Users){

            await addMember(user, 2);

        }

    }


    // =================================
    // LEVEL 3
    // =================================

    for(const level1User of level1Users){

        const level2Users =
            allUsers.filter(function(user){

                return String(user.referredBy || "") ===
                    String(level1User.myReferralCode || "");

            });


        for(const level2User of level2Users){

            const level3Users =
                allUsers.filter(function(user){

                    return String(user.referredBy || "") ===
                        String(level2User.myReferralCode || "");

                });


            for(const user of level3Users){

                await addMember(user, 3);

            }

        }

    }


    // =================================
    // SEPARATE LEVELS
    // =================================

    const level1 =
        teamMembers.filter(function(member){

            return Number(member.level) === 1;

        });


    const level2 =
        teamMembers.filter(function(member){

            return Number(member.level) === 2;

        });


    const level3 =
        teamMembers.filter(function(member){

            return Number(member.level) === 3;

        });


    // =================================
    // CALCULATE COMMISSION
    // =================================

    function calculateCommission(members){

        return members.reduce(
            function(total, member){

                return total +
                    Number(
                        member.commissionAmount || 0
                    );

            },
            0
        );

    }


    const level1Commission =
        calculateCommission(level1);


    const level2Commission =
        calculateCommission(level2);


    const level3Commission =
        calculateCommission(level3);


    // =================================
    // TOTAL COMMISSION
    // =================================

    const totalCommission =
        level1Commission +
        level2Commission +
        level3Commission;


    // =================================
    // ACTIVE MEMBERS
    // =================================

    const activeMembers =
        teamMembers.filter(function(member){

            return member.depositStatus === "Active";

        }).length;


    // =================================
    // SEND TEAM DATA
    // =================================

    res.json({

        owner: {

            username:
                owner.username || "",

            fullName:
                owner.fullName || "",

            myReferralCode:
                owner.myReferralCode || "",

            referredBy:
                owner.referredBy || "",

            referralIncome:
                Number(
                    owner.referralIncome || 0
                )

        },


        myReferralCode:
            owner.myReferralCode || "",


        referredBy:
            owner.referredBy || "",


        referralIncome:
            Number(
                owner.referralIncome || 0
            ),


        totalTeam:
            teamMembers.length,


        activeMembers:
            activeMembers,


        totalCommission:
            totalCommission,


        levels: {

            level1: {

                members:
                    level1.length,

                amount:
                    level1Commission,

                depositAmount:
                    level1.reduce(
                        function(total, member){

                            return total +
                                Number(
                                    member.firstDepositAmount || 0
                                );

                        },
                        0
                    )

            },


            level2: {

                members:
                    level2.length,

                amount:
                    level2Commission,

                depositAmount:
                    level2.reduce(
                        function(total, member){

                            return total +
                                Number(
                                    member.firstDepositAmount || 0
                                );

                        },
                        0
                    )

            },


            level3: {

                members:
                    level3.length,

                amount:
                    level3Commission,

                depositAmount:
                    level3.reduce(
                        function(total, member){

                            return total +
                                Number(
                                    member.firstDepositAmount || 0
                                );

                        },
                        0
                    )

            }

        },


        teamMembers:
            teamMembers

    });


}
catch(error) {

    console.log(
        "CashNova Team API Error:",
        error
    );


    res.status(500).json({

        message:
            "Unable to load team data",

        error:
            error.message

    });

}

});   
// =================================
// CASHNOVA DAILY CHECK-IN
// =================================

router.post("/check-in/:id", async function(req, res){

try{

    // =================================
    // FIND USER
    // =================================

    const user =
        await User.findById(req.params.id);

    if(!user){

        return res.status(404).json({
            message:"User not found"
        });

    }


    // =================================
    // CURRENT TIME
    // =================================

    const now = new Date();


    // =================================
    // CHECK LAST CHECK-IN
    // =================================

    if(user.lastCheckInDate){

        const lastCheckIn =
            new Date(user.lastCheckInDate);

        const hoursPassed =
            (now - lastCheckIn) /
            (1000 * 60 * 60);


        if(hoursPassed < 24){

            const remainingHours =
                24 - hoursPassed;

            return res.status(400).json({

                message:
                    "You have already checked in. Please try again after 24 hours.",

                alreadyCheckedIn:true,

                remainingHours:
                    Number(
                        remainingHours.toFixed(2)
                    ),

                user:user

            });

        }

    }


    // =================================
    // CHECK-IN BONUS
    // =================================

    const bonus = 100;


    // =================================
    // ADD BONUS TO WALLET
    // =================================

    user.walletBalance =
        Number(user.walletBalance || 0)
        +
        bonus;


    // =================================
    // ADD TO CUMULATIVE INCOME
    // =================================

    user.cumulativeIncome =
        Number(user.cumulativeIncome || 0)
        +
        bonus;


    // =================================
    // UPDATE TOTAL CHECK-IN BONUS
    // =================================

    user.totalCheckInBonus =
        Number(user.totalCheckInBonus || 0)
        +
        bonus;


    // =================================
    // SAVE LAST CHECK-IN DATE
    // =================================

    user.lastCheckInDate = now;


    // =================================
    // MAKE SURE ARRAYS EXIST
    // =================================

    if(!Array.isArray(user.incomeRecords)){

        user.incomeRecords = [];

    }


    if(!Array.isArray(user.transactionHistory)){

        user.transactionHistory = [];

    }


    // =================================
    // INCOME RECORD
    // =================================

    user.incomeRecords.push({

        type:"Check-in Bonus",

        amount:bonus,

        status:"Completed",

        date:now.toLocaleString()

    });


    // =================================
    // TRANSACTION HISTORY
    // =================================

    user.transactionHistory.push({

        type:"Check-in Bonus",

        amount:bonus,

        status:"Completed",

        date:now.toLocaleString()

    });


    // =================================
    // SAVE USER
    // =================================

    await user.save();


    // =================================
    // RESPONSE
    // =================================

    res.json({

        message:
            "Check-in successful! You received UGX 100.",

        bonus:bonus,

        walletBalance:
            Number(user.walletBalance || 0),

        cumulativeIncome:
            Number(user.cumulativeIncome || 0),

        totalCheckInBonus:
            Number(user.totalCheckInBonus || 0),

        lastCheckInDate:
            user.lastCheckInDate,

        user:user

    });


}
catch(error){

    console.log(
        "Check-in error:",
        error
    );


    res.status(500).json({

        message:
            "Unable to complete check-in",

        error:
            error.message

    });

}

});


module.exports = router;
