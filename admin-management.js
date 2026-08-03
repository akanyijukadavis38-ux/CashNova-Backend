/* =================================
   CASHNOVA ADMIN MANAGEMENT
   COMPLETE SYSTEM
   PART 1 - DEPOSITS
================================= */


document.addEventListener("DOMContentLoaded", function(){



// ===============================
// LOAD DATABASE
// ===============================

let deposits = [];

async function loadDeposits() {

    container.innerHTML = `
    <div class="empty-state">
    Loading deposits...
    </div>
    `;

    try {
let response = await fetch(
"https://cashnova-backend-89lg.onrender.com/api/deposits"
);
        

        deposits = await response.json();

        displayDeposits();

    } catch (error) {

        console.log(error);

        container.innerHTML = `
        <div class="empty-state">
        Failed to load deposits
        </div>
        `;

    }

}




let withdrawals =
JSON.parse(
localStorage.getItem("cashnovaWithdrawals")
) || [];




// ===============================
// ELEMENTS
// ===============================


let title =
document.getElementById("managementTitle");


let container =
document.getElementById("managementContainer");




// ===============================
// CHECK SECTION
// ===============================


let params =
new URLSearchParams(window.location.search);


let section =
params.get("section");





// ===============================
// OPEN DEPOSIT MANAGEMENT
// ===============================


if(section === "deposit" || !section){


title.innerHTML =
"Pending Deposits";









// ===============================
// LOAD PENDING DEPOSITS
// ===============================

function displayDeposits(){


container.innerHTML = "";

let pendingDeposits =
deposits.filter(function(item){

return item.status === "Pending";

});




if(pendingDeposits.length === 0){


container.innerHTML = `

<div class="empty-state">

No pending deposits

</div>

`;

return;

}





pendingDeposits.forEach(function(deposit){



let card =
document.createElement("div");



card.className =
"deposit-card";





card.innerHTML = `

<h3>
Deposit Request
</h3>



Deposit ID:
<b>
${deposit._id || ""}
</b>



<p>
Username:
${deposit.username || "Unknown"}
</p>



<p>
Amount:
<b>
UGX ${Number(deposit.amount || 0).toLocaleString()}
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

approveDeposit(deposit._id);

};




card.querySelector(".reject-btn").onclick =
function(){
rejectDeposit(deposit._id);


};





container.appendChild(card);



});



}
loadDeposits();

// ===============================
// APPROVE DEPOSIT
// ===============================

async function approveDeposit(id){

    try{

        let response = await fetch(
        "https://cashnova-backend-89lg.onrender.com/api/deposits/approve/" + id,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        });

        let result = await response.json();

        alert(result.message);

        loadDeposits();

    }catch(error){

        console.log(error);

        alert("Server connection failed");

    }

}










// ===============================
// REJECT DEPOSIT
// ===============================


function rejectDeposit(id){


let deposits =
JSON.parse(
localStorage.getItem("cashnovaDeposits")
) || [];



let deposit =
deposits.find(function(item){

return item._id === id;

});



if(!deposit){

alert("Deposit not found");

return;

}



deposit.status =
"Rejected";



localStorage.setItem(
"cashnovaDeposits",
JSON.stringify(deposits)
);



alert("Deposit rejected");


location.reload();


}
  
// ===============================
// OPEN WITHDRAWAL MANAGEMENT
// ===============================


if(section === "withdrawal"){


title.innerHTML =
"Pending Withdrawals";


loadWithdrawals();


}







// ===============================
// LOAD PENDING WITHDRAWALS
// ===============================


function loadWithdrawals(){


container.innerHTML = "";



let pendingWithdrawals =
withdrawals.filter(function(item){

return item.status === "Pending";

});





if(pendingWithdrawals.length === 0){


container.innerHTML = `

<div class="empty-state">

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


<h3>
Withdrawal Request
</h3>



<p>
Withdrawal ID:
<b>
${withdrawal.id || ""}
</b>
</p>



<p>
Username:
${withdrawal.username || "Unknown"}
</p>



<p>
Phone:
${withdrawal.phone || ""}
</p>



<p>
Amount:
<b>
UGX ${Number(withdrawal.amount || 0).toLocaleString()}
</b>
</p>



<p>
Fee:
UGX ${Number(withdrawal.fee || 0).toLocaleString()}
</p>



<p>
Receive Amount:
<b>
UGX ${Number(withdrawal.receiveAmount || 0).toLocaleString()}
</b>
</p>



<p>
Date:
${withdrawal.date || ""}
</p>



<span class="pending">

Pending

</span>



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

approveWithdrawal(withdrawal.id);

};




card.querySelector(".reject-btn").onclick =
function(){

rejectWithdrawal(withdrawal.id);

};





container.appendChild(card);



});



}








// ===============================
// APPROVE WITHDRAWAL
// ===============================


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



withdrawal.status =
"Approved";



withdrawal.approvedDate =
new Date().toLocaleString();
// =================================
// UPDATE WITHDRAWAL HISTORY
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

record.id === withdrawal.id ||

(
record.type === "Withdrawal" &&
Number(record.amount) === Number(withdrawal.amount)
)

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



alert("Withdrawal approved");


location.reload();


}








// ===============================
// REJECT WITHDRAWAL
// ===============================


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



withdrawal.status =
"Rejected";



withdrawal.rejectedDate =
new Date().toLocaleString();



localStorage.setItem(
"cashnovaWithdrawals",
JSON.stringify(withdrawals)
);



alert("Withdrawal rejected");


location.reload();


}

// =================================
// ALL USERS MANAGEMENT
// =================================


function loadAllUsers(){


let usersContainer =
document.getElementById("usersContainer");


let usersSection =
document.getElementById("usersSection");



if(!usersContainer){

return;

}



let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];



usersContainer.innerHTML = "";



if(users.length === 0){


usersContainer.innerHTML = `

<div class="empty-state">

No users found

</div>

`;

return;

}





users.forEach(function(user){



let card =
document.createElement("div");


card.className =
"user-card";



card.innerHTML = `


<h3>

${user.fullName || "Unknown User"}

</h3>



<p>
Username:
<b>${user.username || ""}</b>
</p>



<p>
Phone:
${user.phone || ""}
</p>



<p>
Account Number:
${user.accountNumber || ""}
</p>



<p>
Total Deposits:
<b>
UGX ${Number(user.totalDeposits || 0).toLocaleString()}
</b>
</p>



<p>
Registered:
${user.registrationDate || ""}
</p>



<span class="user-status">

${
user.accountActivated
?
"Active"
:
"Inactive"
}

</span>


`;



usersContainer.appendChild(card);



});


}





// =================================
// OPEN USERS MANAGEMENT
// =================================


if(section === "users"){


title.innerHTML =
"All Users";


container.innerHTML = "";



document.getElementById("usersSection").style.display="block";


loadAllUsers();


}

 // =================================
// ACTIVE USERS MANAGEMENT
// =================================


function loadActiveUsers(){


let activeContainer =
document.getElementById("activeUsersContainer");



if(!activeContainer){

return;

}



let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];



activeContainer.innerHTML = "";



let activeUsers =
users.filter(function(user){


return user.accountActivated === true ||
user.firstDepositCompleted === true;


});




if(activeUsers.length === 0){


activeContainer.innerHTML = `

<div class="empty-state">

No active users found

</div>

`;

return;

}






activeUsers.forEach(function(user){



let card =
document.createElement("div");



card.className =
"user-card";



card.innerHTML = `


<h3>

${user.fullName || "Unknown User"}

</h3>



<p>
Username:
<b>
${user.username || ""}
</b>
</p>



<p>
Phone:
${user.phone || ""}
</p>



<p>
Account Number:
${user.accountNumber || ""}
</p>



<p>
Total Deposits:
<b>
UGX ${Number(user.totalDeposits || 0).toLocaleString()}
</b>
</p>



<p>
Status:
<span class="user-status">
Active
</span>
</p>


`;



activeContainer.appendChild(card);



});


}





// =================================
// OPEN ACTIVE USERS
// =================================


if(section === "active-users"){


title.innerHTML =
"Active Users";


container.innerHTML = "";


document.getElementById("activeUsersSection").style.display="block";


loadActiveUsers();


}
// =================================
// FINANCIAL RECORDS MANAGEMENT
// =================================


function loadFinancialRecords(){


let financialContainer =
document.getElementById("financialContainer");


if(!financialContainer){

return;

}



let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];



financialContainer.innerHTML = "";



let records = [];



// COLLECT ALL USER RECORDS

users.forEach(function(user){



if(user.incomeRecords){


user.incomeRecords.forEach(function(record){


records.push({

username:user.username,

type:record.type,

amount:record.amount,

status:record.status,

date:record.date,

transactionId:
record.mobileMoneyTransactionId || ""


});


});


}



if(user.transactionHistory){


user.transactionHistory.forEach(function(record){


records.push({

username:user.username,

type:record.type,

amount:record.amount,

status:record.status,

date:record.date,

transactionId:
record.mobileMoneyTransactionId || ""


});


});


}



});





if(records.length === 0){


financialContainer.innerHTML = `

<div class="empty-state">

No financial records found

</div>

`;

return;

}





records.reverse();





records.forEach(function(record){



let card =
document.createElement("div");



card.className =
"record-card";



card.innerHTML = `


<h3>
${record.type || "Transaction"}
</h3>



<p>
User:
<b>
${record.username}
</b>
</p>



<p>
Amount:
<b>
UGX ${Number(record.amount || 0).toLocaleString()}
</b>
</p>



<p>
Status:
${record.status || ""}
</p>



<p>
Date:
${record.date || ""}
</p>



${
record.transactionId
?
`
<p>
Transaction ID:
${record.transactionId}
</p>
`
:
""
}



`;



financialContainer.appendChild(card);



});


}







// =================================
// OPEN FINANCIAL SECTION
// =================================


if(section === "financial"){


title.innerHTML =
"Financial Records";


container.innerHTML = "";



let financialSection =
document.getElementById("financialSection");


if(financialSection){

financialSection.style.display =
"block";

}



loadFinancialRecords();


}
  // =================================
// DEPOSIT RECORDS
// =================================

function loadDepositRecords(){

let box = document.getElementById("financialContainer");

if(!box) return;


let deposits =
JSON.parse(
localStorage.getItem("cashnovaDeposits")
) || [];


box.innerHTML="";


deposits.forEach(function(item){


let card=document.createElement("div");

card.className="record-card";


card.innerHTML=`

<h3>
Deposit Record
</h3>

<p>
User: ${item.username}
</p>

<p>
Amount:
UGX ${Number(item.amount).toLocaleString()}
</p>

<p>
Status:
${item.status}
</p>

<p>
Transaction ID:
${item.mobileMoneyTransactionId || ""}
</p>

<p>
Date:
${item.date}
</p>

`;


box.appendChild(card);


});

}




// =================================
// WITHDRAWAL RECORDS
// =================================

function loadWithdrawalRecords(){


let box =
document.getElementById("financialContainer");


if(!box)return;



let withdrawals =
JSON.parse(
localStorage.getItem("cashnovaWithdrawals")
)||[];


box.innerHTML="";



withdrawals.forEach(function(item){


let card=document.createElement("div");

card.className="record-card";


card.innerHTML=`

<h3>
Withdrawal Record
</h3>


<p>
User:
${item.username}
</p>


<p>
Amount:
UGX ${Number(item.amount).toLocaleString()}
</p>


<p>
Status:
${item.status}
</p>


<p>
Date:
${item.date}
</p>

`;


box.appendChild(card);


});


}




// =================================
// OPEN RECORD SECTIONS
// =================================


if(section==="deposit-records"){


title.innerHTML="Deposit Records";

container.innerHTML="";

document.getElementById("financialSection").style.display="block";


loadDepositRecords();


}



if(section==="withdrawal-records"){


title.innerHTML="Withdrawal Records";

container.innerHTML="";

document.getElementById("financialSection").style.display="block";


loadWithdrawalRecords();


}
  // =================================
// INCOME RECORDS
// =================================

function loadIncomeRecords(){

let box =
document.getElementById("financialContainer");


if(!box)return;


let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
)||[];


box.innerHTML="";


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



if(records.length===0){


box.innerHTML=`

<div class="empty-state">

No income records found

</div>

`;

return;

}



records.reverse();



records.forEach(function(record){


let card=document.createElement("div");


card.className="record-card";


card.innerHTML=`

<h3>
${record.type}
</h3>


<p>
User:
<b>${record.username}</b>
</p>


<p>
Amount:
<b>
UGX ${Number(record.amount).toLocaleString()}
</b>
</p>


<p>
Status:
${record.status}
</p>


<p>
Date:
${record.date}
</p>


`;


box.appendChild(card);


});


}




if(section==="income-records"){


title.innerHTML="Income Records";


container.innerHTML="";


document.getElementById("financialSection").style.display="block";


loadIncomeRecords();


}
  // =================================
// REFERRAL RECORDS
// =================================

function loadReferralRecords(){


let box =
document.getElementById("financialContainer");


if(!box)return;



let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
)||[];


box.innerHTML="";


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




if(records.length===0){


box.innerHTML=`

<div class="empty-state">

No referral records found

</div>

`;


return;


}





records.reverse();





records.forEach(function(record){



let card =
document.createElement("div");



card.className="record-card";



card.innerHTML=`

<h3>
${record.type}
</h3>


<p>
User:
<b>
${record.username}
</b>
</p>


<p>
Commission:
<b>
UGX ${Number(record.amount).toLocaleString()}
</b>
</p>


<p>
Status:
${record.status}
</p>


<p>
Date:
${record.date}
</p>


`;



box.appendChild(card);



});



}




if(section==="referral-records"){


title.innerHTML="Referral Records";


container.innerHTML="";


document.getElementById("financialSection").style.display="block";


loadReferralRecords();


}
  // =================================
// ANNOUNCEMENTS
// =================================

function loadAnnouncements(){


let box =
document.getElementById("announcementContainer");


if(!box)return;



let announcements =
JSON.parse(
localStorage.getItem("cashnovaAnnouncements")
)||[];


box.innerHTML="";



if(announcements.length===0){


box.innerHTML=`

<div class="empty-state">

No announcements available

</div>

`;

return;

}





announcements.reverse();



announcements.forEach(function(item){



let card =
document.createElement("div");


card.className="record-card";


card.innerHTML=`

<h3>
${item.title || "Announcement"}
</h3>


<p>
${item.message || ""}
</p>


<p>
Date:
${item.date || ""}
</p>


<button class="delete-announcement-btn">
Delete Announcement
</button>

`;



box.appendChild(card);

card.querySelector(".delete-announcement-btn").onclick =
function(){

let announcements =
JSON.parse(
localStorage.getItem("cashnovaAnnouncements")
) || [];


announcements =
announcements.filter(function(a){

return a.date !== item.date;

});


localStorage.setItem(
"cashnovaAnnouncements",
JSON.stringify(announcements)
);


alert("Announcement removed successfully");


loadAnnouncements();

};

});


}




if(section==="announcements"){


title.innerHTML="Announcements";


container.innerHTML="";


document.getElementById("announcementSection").style.display="block";


loadAnnouncements();


}
  


// =================================
// ADMIN SETTINGS PANEL
// =================================

function loadAdminSettings(){


let box =
document.getElementById("managementContainer");


if(!box)return;



box.innerHTML = `


<div class="record-card">


<h3>
Admin Settings
</h3>



<div class="settings-item">

<h4>
Change Admin Password
</h4>


<input 
type="password"
id="oldAdminPassword"
placeholder="Current password"
>


<input 
type="password"
id="newAdminPassword"
placeholder="New password"
>


<button id="changePasswordBtn">
Change Password
</button>


</div>




<hr>




<div class="settings-item">

<h4>
Platform Settings
</h4>

<input 
type="text"
id="platformName"
placeholder="Platform Name"
>


<input 
type="text"
id="supportContact"
placeholder="Support Contact"
>


<button id="savePlatformBtn">
Save Platform Settings
</button>



</div>





<hr>




<div class="settings-item">

<input 
type="number"
id="minimumDeposit"
placeholder="Minimum Deposit"
value="15000"
>


<input 
type="number"
id="registrationBonus"
placeholder="Registration Bonus"
value="5000"
>


<input 
type="number"
id="dailyLoginBonus"
placeholder="Daily Login Bonus"
value="100"
>


<button id="saveDepositRulesBtn">
Save Deposit Rules
</button>


<p>
Minimum Deposit: UGX 15,000
</p>


</div>





<hr>




<div class="settings-item">

<h4>
Withdrawal Rules
</h4>


<input 
type="number"
id="minimumWithdrawal"
placeholder="Minimum Withdrawal"
value="5000"
>


<input 
type="number"
id="withdrawalFee"
placeholder="Withdrawal Fee Percentage"
value="14"
>


<input 
type="number"
id="dailyWithdrawalLimit"
placeholder="Daily Withdrawal Limit"
value="2"
>


<button id="saveWithdrawalRulesBtn">
Save Withdrawal Rules
</button>


<p>
Minimum Withdrawal: UGX 5,000
</p>


</div>





<hr>




<div class="settings-item">

<h4>
Maintenance Mode
</h4>


<select id="maintenanceStatus">

<option value="active">
Platform Active
</option>


<option value="maintenance">
Maintenance Mode
</option>


</select>



<button id="saveMaintenanceBtn">
Save Maintenance Status
</button>


<p>
System Status:
<span class="user-status">
Active
</span>
</p>


</div>



</div>


`;




// CHANGE PASSWORD

let changeBtn =
document.getElementById("changePasswordBtn");


if(changeBtn){


changeBtn.onclick=function(){


let oldPassword =
document.getElementById("oldAdminPassword").value;


let newPassword =
document.getElementById("newAdminPassword").value;



let adminPassword =
localStorage.getItem("cashnovaAdminPassword")
|| "admin123";



if(oldPassword !== adminPassword){


alert("Wrong current password");


return;

}



localStorage.setItem(
"cashnovaAdminPassword",
newPassword
);



alert("Admin password changed successfully");


};


}


}







if(section==="settings"){


title.innerHTML =
"Admin Settings";


document.getElementById("financialSection").style.display="none";

document.getElementById("announcementSection").style.display="none";

document.getElementById("usersSection").style.display="none";

document.getElementById("activeUsersSection").style.display="none";


loadAdminSettings();
// SAVE PLATFORM SETTINGS

let savePlatformBtn =
document.getElementById("savePlatformBtn");


if(savePlatformBtn){


savePlatformBtn.onclick=function(){


let platformName =
document.getElementById("platformName").value;


let supportContact =
document.getElementById("supportContact").value;



let settings = {


platformName:platformName,

supportContact:supportContact,

updatedDate:
new Date().toLocaleString()


};



localStorage.setItem(

"cashnovaPlatformSettings",

JSON.stringify(settings)

);



alert("Platform settings saved");


};



}
// SAVE DEPOSIT RULES

let saveDepositRulesBtn =
document.getElementById("saveDepositRulesBtn");


if(saveDepositRulesBtn){


saveDepositRulesBtn.onclick=function(){


let rules = {


minimumDeposit:
Number(
document.getElementById("minimumDeposit").value
),


registrationBonus:
Number(
document.getElementById("registrationBonus").value
),


dailyLoginBonus:
Number(
document.getElementById("dailyLoginBonus").value
),


updatedDate:
new Date().toLocaleString()


};



localStorage.setItem(

"cashnovaDepositRules",

JSON.stringify(rules)

);



alert("Deposit rules saved successfully");


};


}
 // SAVE WITHDRAWAL RULES

let saveWithdrawalRulesBtn =
document.getElementById("saveWithdrawalRulesBtn");


if(saveWithdrawalRulesBtn){


saveWithdrawalRulesBtn.onclick=function(){


let rules = {


minimumWithdrawal:
Number(
document.getElementById("minimumWithdrawal").value
),


withdrawalFee:
Number(
document.getElementById("withdrawalFee").value
),


dailyWithdrawalLimit:
Number(
document.getElementById("dailyWithdrawalLimit").value
),


updatedDate:
new Date().toLocaleString()


};



localStorage.setItem(

"cashnovaWithdrawalRules",

JSON.stringify(rules)

);



alert("Withdrawal rules saved successfully");


};


} 
  // SAVE MAINTENANCE MODE


let saveMaintenanceBtn =
document.getElementById("saveMaintenanceBtn");


if(saveMaintenanceBtn){


saveMaintenanceBtn.onclick=function(){


let status =
document.getElementById("maintenanceStatus").value;



let maintenance = {


status:status,


updatedDate:
new Date().toLocaleString()


};



localStorage.setItem(

"cashnovaMaintenance",

JSON.stringify(maintenance)

);



alert("Maintenance status updated");


};



}
}
  // =================================
// CREATE ANNOUNCEMENT
// =================================

function createAnnouncement(){


let text =
document.getElementById("announcementText");


if(!text){

return;

}



let message =
text.value.trim();



if(message === ""){


alert("Please write an announcement");


return;

}



let announcements =
JSON.parse(
localStorage.getItem("cashnovaAnnouncements")
) || [];



announcements.push({

title:"CashNova Announcement",

message:message,

date:new Date().toLocaleString()

});



localStorage.setItem(
"cashnovaAnnouncements",
JSON.stringify(announcements)
);



alert("Announcement posted successfully");


text.value="";


loadAnnouncements();


}



// CONNECT BUTTON

let addAnnouncementBtn =
document.getElementById("addAnnouncementBtn");



if(addAnnouncementBtn){


addAnnouncementBtn.onclick =
function(){

createAnnouncement();

};


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

}
else if(Number(member.level) === 2){

rate = 3;

}
else if(Number(member.level) === 3){

rate = 1;

}



member.commissionRate =
rate + "%";



member.commissionEarned =
Number(member.firstDepositAmount || 0)
*
rate / 100;


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



        let bonus =
        Number(amount) * percentages[i] / 100;



        // ADD BONUS TO WALLET

        referrer.walletBalance =
        Number(referrer.walletBalance || 0)
        +
        bonus;



        // ADD REFERRAL INCOME

        referrer.referralIncome =
        Number(referrer.referralIncome || 0)
        +
        bonus;



        // CREATE TRANSACTION HISTORY

        if(!referrer.transactionHistory){

            referrer.transactionHistory = [];

        }



        referrer.transactionHistory.push({

            type:
            "Level " + (i + 1) + " Referral Bonus",

            amount: bonus,

            status: "Credited",

            date: new Date().toLocaleString()

        });



        currentUser = referrer;


    }


}
});