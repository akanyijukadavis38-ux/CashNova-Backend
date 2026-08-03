/* =================================
   CASHNOVA ADMIN PART 1
   DISPLAY SYSTEM ONLY
================================= */


document.addEventListener("DOMContentLoaded", function(){



// =================================
// LOAD DATA
// =================================


let deposits =
JSON.parse(
localStorage.getItem("cashnovaDeposits")
) || [];



let withdrawals =
JSON.parse(
localStorage.getItem("cashnovaWithdrawals")
) || [];




// =================================
// UPDATE COUNTS
// =================================


function updateCounts(){


let pendingDeposits =
deposits.filter(function(item){

return item.status === "Pending";

});



let pendingWithdrawals =
withdrawals.filter(function(item){

return item.status === "Pending";

});



let depositCount =
document.getElementById("depositCount");


let withdrawCount =
document.getElementById("withdrawCount");



if(depositCount){

depositCount.innerHTML =
pendingDeposits.length;

}



if(withdrawCount){

withdrawCount.innerHTML =
pendingWithdrawals.length;

}


}




// =================================
// DISPLAY PENDING DEPOSITS
// =================================


function loadDeposits(){


let container =
document.getElementById("depositContainer");


if(!container){

return;

}



container.innerHTML = "";



let pendingDeposits =
deposits.filter(function(deposit){

return deposit.status === "Pending";

});



if(pendingDeposits.length === 0){


container.innerHTML = `

<div class="empty-history">

No pending deposits

</div>

`;

return;

}




pendingDeposits.forEach(function(deposit){



let index =
deposits.findIndex(function(item){

return item.id === deposit.id;

});



let card =
document.createElement("div");



card.className =
"deposit-card";



card.innerHTML = `

<div class="deposit-info">


<h3>
Deposit Request
</h3>


<p>
User:
${deposit.username || "Unknown"}
</p>


<p>
Amount:
<b>
UGX ${Number(deposit.amount).toLocaleString()}
</b>
</p>


<p>
Network:
${deposit.method || ""}
</p>


<p>
Transaction ID:
${deposit.mobileMoneyTransactionId || ""}
</p>


<p>
Date:
${deposit.date || ""}
</p>



<span class="pending">
Pending
</span>



</div>



<div class="admin-actions">


<button class="approve-btn">

Approve

</button>



<button class="reject-btn">

Reject

</button>



</div>


`;




// BUTTON CONNECTION ONLY


card.querySelector(".approve-btn").onclick =
function(){

approveDeposit(index);

};



card.querySelector(".reject-btn").onclick =
function(){

rejectDeposit(index);

};



container.appendChild(card);



});


}




// =================================
// DISPLAY PENDING WITHDRAWALS
// =================================


function loadWithdrawals(){



let container =
document.getElementById("withdrawalContainer");



if(!container){

return;

}



container.innerHTML = "";



let pendingWithdrawals =
withdrawals.filter(function(withdrawal){

return withdrawal.status === "Pending";

});



if(pendingWithdrawals.length === 0){


container.innerHTML = `

<div class="empty-history">

No pending withdrawals

</div>

`;

return;

}




pendingWithdrawals.forEach(function(withdrawal){



let card =
document.createElement("div");



card.className =
"withdraw-card";



card.innerHTML = `

<div class="withdraw-info">


<h3>
Withdrawal Request
</h3>


<p>
User:
${withdrawal.username || "Unknown"}
</p>


<p>
Amount:
<b>
UGX ${Number(withdrawal.amount).toLocaleString()}
</b>
</p>


<p>
Phone:
${withdrawal.phone || ""}
</p>


<p>
Date:
${withdrawal.date || ""}
</p>



<span class="pending">
Pending
</span>



</div>



<div class="admin-actions">


<button class="approve-btn">

Approve

</button>



<button class="reject-btn">

Reject

</button>



</div>

`;



card.querySelector(".approve-btn").onclick =
function(){


alert("Approve withdrawal button connected");


};



card.querySelector(".approve-btn").onclick =
function(){

approveWithdrawal(withdrawal.id);

};



card.querySelector(".reject-btn").onclick =
function(){

rejectWithdrawal(withdrawal.id);

};



container.appendChild(card);



});


}





// =================================
// TABS
// =================================


let depositTab =
document.getElementById("depositTab");


let withdrawTab =
document.getElementById("withdrawTab");



let depositSection =
document.getElementById("depositSection");


let withdrawalSection =
document.getElementById("withdrawalSection");




if(depositTab){


depositTab.onclick =
function(){


depositSection.style.display="block";

withdrawalSection.style.display="none";


};

}




if(withdrawTab){


withdrawTab.onclick =
function(){


depositSection.style.display="none";

withdrawalSection.style.display="block";


};

}





// START


updateCounts();

loadDeposits();

loadWithdrawals();

// =================================
// APPROVE DEPOSIT
// =================================

function approveDeposit(index){


let deposits =
JSON.parse(
localStorage.getItem("cashnovaDeposits")
) || [];


let deposit =
deposits[index];
let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];

let user =
users.find(function(item){

return item.username === deposit.username;

});



if(!deposit){

alert("Deposit not found");

return;

}
  if(!user){

alert("User not found");

return;

}


// =================================
// ACTIVATE ACCOUNT AFTER FIRST DEPOSIT
// =================================

if(!user.accountActivated){

    user.accountActivated = true;

    user.registrationBonusUnlocked = true;
user.registrationBonusStatus = "Credited";
   // Do not add bonus directly to wallet here
// Bonus will only be recorded

user.registrationBonus = 5000;

user.registrationBonusStatus = "Credited"; 

    user.cumulativeIncome =
(user.cumulativeIncome || 0) + 5000;

user.accumulatedIncome =
(user.accumulatedIncome || 0) + 5000;


    if(!user.incomeRecords){

        user.incomeRecords = [];

    }


    user.incomeRecords.push({

        type:"Registration Bonus",

        amount:5000,

        status:"Credited",

        date:new Date().toLocaleString()

    });

}


// Credit user's wallet
user.walletBalance =
(user.walletBalance || 0) +
Number(deposit.amount);

user.totalDeposits =
(user.totalDeposits || 0) +
Number(deposit.amount);

deposit.status = "Credited";


localStorage.setItem(
"cashnovaDeposits",
JSON.stringify(deposits)
);
  // =================================
// FIRST DEPOSIT REFERRAL CHECK
// =================================

if(!user.firstDepositCompleted){

    user.firstDepositCompleted = true;

    user.firstDepositAmount = Number(deposit.amount);

    calculateReferralBonus(
        user,
        Number(deposit.amount),
        users
    );

    updateTeamMemberDeposit(
        user,
        users
    );

}
// =================================
// UPDATE USER DEPOSIT HISTORY
// =================================
if(user && user.incomeRecords){

    user.incomeRecords.forEach(function(record){

        if(
            record.type === "Deposit" &&
            record.mobileMoneyTransactionId === deposit.mobileMoneyTransactionId
        ){

            record.status = "Credited";

            record.approvedDate =
            new Date().toLocaleString();

        }

    });

}


localStorage.setItem(
    "cashnovaUsers",
    JSON.stringify(users)
);
alert("Deposit approved successfully");


location.reload();


}




// =================================
// REJECT DEPOSIT
// =================================

function rejectDeposit(index){


let deposits =
JSON.parse(
localStorage.getItem("cashnovaDeposits")
) || [];


let deposit =
deposits[index];

if(!deposit){

alert("Deposit not found");

return;

}
if(deposit.status === "Credited"){

alert("Deposit already approved");

return;

}
// Prevent approving the same deposit twice
if(deposit.status === "Credited"){

alert("Deposit already approved");

return;

}


deposit.status = "Rejected";


localStorage.setItem(
"cashnovaDeposits",
JSON.stringify(deposits)
);


alert("Deposit rejected successfully");


location.reload();


}
// =================================
// APPROVE WITHDRAWAL
// =================================

function approveWithdrawal(id){


let withdrawals =
JSON.parse(
localStorage.getItem("cashnovaWithdrawals")
) || [];



let withdrawal =
withdrawals.find(function(item){

return item.id === id;

});



if(!withdrawal){

alert("Withdrawal not found");

return;

}



withdrawal.status = "Approved";

withdrawal.approvedDate =
new Date().toLocaleString();

// =================================
// UPDATE USER WITHDRAWAL HISTORY
// =================================

let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];


let user =
users.find(function(item){

return item.username === withdrawal.username;

});


if(user && user.transactionHistory){


user.transactionHistory.forEach(function(record){


if(
record.amount == withdrawal.amount
){


record.status = "Approved";


record.approvedDate =
new Date().toLocaleString();


}


});


}



localStorage.setItem(
"cashnovaUsers",
JSON.stringify(users)
);

localStorage.setItem(
"cashnovaWithdrawals",
JSON.stringify(withdrawals)
);



alert("Withdrawal approved successfully");


location.reload();

}





// =================================
// REJECT WITHDRAWAL
// =================================

function rejectWithdrawal(id){


let withdrawals =
JSON.parse(
localStorage.getItem("cashnovaWithdrawals")
) || [];



let withdrawal =
withdrawals.find(function(item){

return item.id === id;

});



if(!withdrawal){

alert("Withdrawal not found");

return;

}



withdrawal.status = "Rejected";

withdrawal.rejectedDate =
new Date().toLocaleString();



localStorage.setItem(
"cashnovaWithdrawals",
JSON.stringify(withdrawals)
);



alert("Withdrawal rejected successfully");


location.reload();


}
  // =================================
// UPDATE TEAM MEMBER
// =================================
function updateTeamMemberDeposit(user, users){

    users.forEach(function(owner){

        if(!owner.teamMembers){
            return;
        }

        owner.teamMembers.forEach(function(member){

            if(member.username === user.username){

                member.depositStatus = "Active";

                member.firstDepositAmount =
                Number(user.firstDepositAmount || 0);

                member.totalDeposits =
                Number(user.totalDeposits || 0);

                let rate = 0;

                if(Number(member.level) === 1){
                    rate = 20;
                }else if(Number(member.level) === 2){
                    rate = 3;
                }else if(Number(member.level) === 3){
                    rate = 1;
                }

                member.commissionRate = rate + "%";

         member.commissionEarned =
Number(member.firstDepositAmount || 0) * rate / 100;     

            }

        });

    });

}

// =================================
// REFERRAL BONUS
// =================================
function calculateReferralBonus(user, amount, users){

    let percentages = [20, 3, 1];
    let currentUser = user;

    for(let i = 0; i < 3; i++){

        if(!currentUser.referredBy){
            break;
        }

        let referrer = users.find(function(item){
            return item.myReferralCode === currentUser.referredBy;
        });

        if(!referrer){
            break;
        }

        let bonus = amount * percentages[i] / 100;

        // Wallet
        referrer.walletBalance =
        Number(referrer.walletBalance || 0) + bonus;

        // Total referral earnings
        referrer.referralIncome =
        Number(referrer.referralIncome || 0) + bonus;

        // Statistics
        if(i === 0){
            referrer.levelOneAmount =
            Number(referrer.levelOneAmount || 0) + bonus;
        }

        if(i === 1){
            referrer.levelTwoAmount =
            Number(referrer.levelTwoAmount || 0) + bonus;
        }

        if(i === 2){
            referrer.levelThreeAmount =
            Number(referrer.levelThreeAmount || 0) + bonus;
        }

        if(!referrer.transactionHistory){
            referrer.transactionHistory = [];
        }

        referrer.transactionHistory.push({
            type: "Level " + (i + 1) + " Referral Bonus",
            amount: bonus,
            status: "Credited",
            date: new Date().toLocaleString()
        });

        currentUser = referrer;
    }

}



});