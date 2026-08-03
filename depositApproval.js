/* =================================
   CASHNOVA DEPOSIT APPROVAL SYSTEM
================================= */


function approveDeposit(depositIndex){


    let users =
    JSON.parse(
        localStorage.getItem("cashnovaUsers")
    ) || [];



    let deposits =
    JSON.parse(
        localStorage.getItem("cashnovaDeposits")
    ) || [];



    let deposit = deposits[depositIndex];



    if(!deposit){

        alert("Deposit not found");

        return;

    }



    if(deposit.status === "Credited"){

        alert("Deposit already approved");

        return;

    }



    // FIND USER WHO MADE DEPOSIT

    let user =
    users.find(function(item){

        return item.username === deposit.username;

    });



    if(!user){

        alert("User not found");

        return;

    }





    // CREDIT DEPOSIT AMOUNT

    user.walletBalance =
    (user.walletBalance || 0) + Number(deposit.amount);


// UPDATE USER DEPOSIT INFORMATION
let previousDeposits = deposits.filter(function(item){

    return item.username === user.username
    && item.status === "Credited"
    && item.id !== deposit.id;

});

// =================================
// CHECK IF THIS IS FIRST DEPOSIT
// =================================

let userApprovedDeposits = deposits.filter(function(item){

    return item.username === user.username
    && item.status === "Credited";

});


// FIRST DEPOSIT ONLY

if(userApprovedDeposits.length === 0){


    user.firstDepositCompleted = true;


    


}

// ADD THIS DEPOSIT TO TOTAL

user.totalDeposits =
(user.totalDeposits || 0) + Number(deposit.amount);


user.depositStatus = "Active";


// =================================
// FIRST DEPOSIT DETECTION
// =================================

if(previousDeposits.length === 0){


    // THIS IS THE FIRST APPROVED DEPOSIT

    user.firstDepositCompleted = true;


    user.firstDepositAmount =
    Number(deposit.amount);




}else{


    // SECOND OR MORE DEPOSIT

    user.firstDepositCompleted = true;


}
    

    if(!user.transactionHistory){

        user.transactionHistory = [];

    }



    user.transactionHistory.push({

        type:"Deposit",

        amount:deposit.amount,

        status:"Credited",

        date:new Date().toLocaleString()

    });
    // UPDATE DEPOSIT STATUS FIRST

deposit.status = "Credited";

deposit.approvedDate =
new Date().toLocaleString();


// SAVE THE APPROVED DEPOSIT COUNT AFTER STATUS CHANGE

let approvedDeposits = deposits.filter(function(item){

    return item.username === user.username
    && item.status === "Credited";

});
  
// =================================
// FIRST DEPOSIT REGISTRATION BONUS
// =================================

if(
approvedDeposits.length === 1 
&& user.registrationBonusUnlocked !== true
){

    user.registrationBonusUnlocked = true;

    user.registrationBonusStatus = "Credited";


    // ADD 5000 ONLY ONCE

    user.accumulatedIncome =
    (user.accumulatedIncome || 0) + 5000;

// =================================
// REGISTRATION BONUS NOTIFICATION
// =================================

let notifications =
JSON.parse(
localStorage.getItem("cashnovaNotifications")
) || [];


notifications.push({

    username:user.username,

    title:"Registration Bonus Credited",

    message:
    "Your UGX 5,000 registration bonus has been unlocked.",

    status:"unread",

    date:new Date().toLocaleString()

});


localStorage.setItem(

"cashnovaNotifications",

JSON.stringify(notifications)

);

    if(!user.incomeRecords){

        user.incomeRecords = [];

    }


    user.incomeRecords.push({

        type:"Registration Bonus",

        amount:5000,

        status:"Credited",

        date:new Date().toLocaleString()

    });



    if(!user.transactionHistory){

        user.transactionHistory = [];

    }


    user.transactionHistory.push({

        type:"Registration Bonus",

        amount:5000,

        status:"Credited",

        date:new Date().toLocaleString()

    });


}
  



    // =================================
    // REFERRAL COMMISSION
    // =================================


    calculateReferralBonus(
        user,
        deposit.amount,
        users
    );





    // =================================
    // UPDATE MY TEAM MEMBERS
    // =================================

    updateTeamMemberDeposit(
        user,
        users
    );





    localStorage.setItem(

        "cashnovaUsers",

        JSON.stringify(users)

    );



    localStorage.setItem(

        "cashnovaDeposits",

        JSON.stringify(deposits)

    );

// =================================
// CREATE DEPOSIT APPROVAL NOTIFICATION
// =================================

let notifications =
JSON.parse(
localStorage.getItem("cashnovaNotifications")
) || [];


notifications.push({

    username: user.username,

    title: "Deposit Approved",

    message:
    "Your UGX " +
    Number(deposit.amount).toLocaleString() +
    " deposit has been credited successfully.",

    status:"unread",

    date:new Date().toLocaleString()

});


localStorage.setItem(

"cashnovaNotifications",

JSON.stringify(notifications)

);

    alert("Deposit approved successfully");


}





// =================================
// UPDATE TEAM MEMBER DEPOSIT STATUS
// =================================


function updateTeamMemberDeposit(
    depositedUser,
    users
){


    users.forEach(function(owner){



        if(owner.teamMembers){



            owner.teamMembers.forEach(function(member){



                if(member.username === depositedUser.username){


member.depositStatus =
"UGX " + Number(depositedUser.totalDeposits || 0).toLocaleString();
                  



                    member.totalDeposits =
                    depositedUser.totalDeposits || 0;



                    member.firstDepositAmount =
                    depositedUser.firstDepositAmount || 0;



                }


            });


        }


    });


}

// =================================
// REFERRAL CALCULATION
// =================================


function calculateReferralBonus(
    user,
    amount,
    users
){



    let levels = [

        20,
        3,
        1

    ];



    let currentUser = user;



    for(
        let i = 0;
        i < 3;
        i++
    ){



        if(!currentUser.referredBy){

            break;

        }





        let referrer =
        users.find(function(item){


            return item.myReferralCode === currentUser.referredBy;


        });





        if(!referrer){

            break;

        }





        let bonus =
        Number(amount) * levels[i] / 100;





       referrer.walletBalance =
(referrer.walletBalance || 0)
+ bonus;


referrer.referralIncome =
(referrer.referralIncome || 0)
+ bonus;


referrer.accumulatedIncome =
(referrer.accumulatedIncome || 0)
+ bonus;

// UPDATE LEVEL AMOUNT

if(i === 0){

    referrer.levelOneAmount =
    (referrer.levelOneAmount || 0)
    + bonus;

}


if(i === 1){

    referrer.levelTwoAmount =
    (referrer.levelTwoAmount || 0)
    + bonus;

}


if(i === 2){

    referrer.levelThreeAmount =
    (referrer.levelThreeAmount || 0)
    + bonus;

}



        if(!referrer.referralEarnings){

            referrer.referralEarnings = [];

        }



        referrer.referralEarnings.push({

            fromUser:user.username,

            level:i + 1,

            amount:bonus,

            date:new Date().toLocaleString()

        });





        if(!referrer.transactionHistory){

            referrer.transactionHistory = [];

        }





        referrer.transactionHistory.push({

            type:
            "Level " + (i + 1) + " Referral Bonus",

            amount:bonus,

            status:"Credited",

            date:new Date().toLocaleString()

        });


// =================================
// REFERRAL BONUS NOTIFICATION
// =================================

let notifications =
JSON.parse(
localStorage.getItem("cashnovaNotifications")
) || [];


notifications.push({

    username: referrer.username,

    title:
    "Referral Bonus Received",

    message:
    "You received UGX " +
    Number(bonus).toLocaleString() +
    " from Level " +
    (i + 1) +
    " referral commission.",

    status:"unread",

    date:new Date().toLocaleString()

});


localStorage.setItem(

"cashnovaNotifications",

JSON.stringify(notifications)

);


        // MOVE TO NEXT UPLINE

        currentUser = referrer;



    }



}