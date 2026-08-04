/* =================================
   CASHNOVA ADMIN MANAGEMENT
   COMPLETE SYSTEM
   PART 1 - DEPOSITS
================================= */


document.addEventListener("DOMContentLoaded", function(){


// ===============================
// BACKEND URL
// ===============================

const API =
"https://cashnova-backend-89lg.onrender.com";



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
        API + "/api/deposits"
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




let withdrawals = [];






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

API +
"/api/deposits/approve/" +
id,

{

method:"POST",

headers:{

"Content-Type":"application/json"

}

}

);



let result =
await response.json();



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


async function rejectDeposit(id){


try{


let response =
await fetch(

API +
"/api/deposits/reject/" +
id,

{

method:"POST",

headers:{

"Content-Type":"application/json"

}

}

);



let result =
await response.json();



alert(result.message);



loadDeposits();



}catch(error){


console.log(error);


alert("Server connection failed");


}


}


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


async function loadWithdrawals(){


container.innerHTML = "";


try{


let response =
await fetch(
API + "/api/withdrawals"
);


withdrawals =
await response.json();




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
${withdrawal._id || ""}
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


approveWithdrawal(withdrawal._id);


};




card.querySelector(".reject-btn").onclick =
function(){


rejectWithdrawal(withdrawal._id);


};





container.appendChild(card);



});



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load withdrawals

</div>

`;

}


}








// ===============================
// APPROVE WITHDRAWAL
// ===============================


async function approveWithdrawal(id){


try{


let response =
await fetch(

API +
"/api/withdrawals/approve/" +
id,

{

method:"POST",

headers:{

"Content-Type":"application/json"

}

}

);



let result =
await response.json();



alert(result.message);



loadWithdrawals();



}catch(error){


console.log(error);


alert("Server connection failed");


}


}








// ===============================
// REJECT WITHDRAWAL
// ===============================


async function rejectWithdrawal(id){


try{


let response =
await fetch(

API +
"/api/withdrawals/reject/" +
id,

{

method:"POST",

headers:{

"Content-Type":"application/json"

}

}

);



let result =
await response.json();



alert(result.message);



loadWithdrawals();



}catch(error){


console.log(error);


alert("Server connection failed");


}


}
   // =================================
// ALL USERS MANAGEMENT
// =================================


async function loadAllUsers(){


let usersContainer =
document.getElementById("usersContainer");



if(!usersContainer){

return;

}



usersContainer.innerHTML = `

<div class="empty-state">

Loading users...

</div>

`;



try{


let response =
await fetch(

API +
"/api/users"

);



let users =
await response.json();




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
${user.createdAt || ""}
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



}catch(error){


console.log(error);



usersContainer.innerHTML = `

<div class="empty-state">

Failed to load users

</div>

`;

}


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


async function loadActiveUsers(){



let activeContainer =
document.getElementById("activeUsersContainer");



if(!activeContainer){

return;

}



activeContainer.innerHTML = `

<div class="empty-state">

Loading active users...

</div>

`;




try{


let response =
await fetch(

API +
"/api/admin/active-users"

);



let activeUsers =
await response.json();




activeContainer.innerHTML = "";




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



}catch(error){


console.log(error);



activeContainer.innerHTML = `

<div class="empty-state">

Failed to load active users

</div>

`;

}


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


async function loadFinancialRecords(){


let financialContainer =
document.getElementById("financialContainer");


if(!financialContainer){

return;

}




financialContainer.innerHTML = `

<div class="empty-state">

Loading financial records...

</div>

`;



try{


let response =
await fetch(

API +
"/api/admin/financial-records"

);



let records =
await response.json();




financialContainer.innerHTML = "";





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
${record.username || ""}
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



`;



financialContainer.appendChild(card);



});



}catch(error){


console.log(error);



financialContainer.innerHTML = `

<div class="empty-state">

Failed to load financial records

</div>

`;

}


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


async function loadDepositRecords(){


let box =
document.getElementById("financialContainer");



if(!box){

return;

}




let response =
await fetch(

API +
"/api/admin/deposit-records"

);



let deposits =
await response.json();




box.innerHTML = "";




deposits.forEach(function(item){



let card =
document.createElement("div");



card.className =
"record-card";



card.innerHTML = `


<h3>
Deposit Record
</h3>


<p>
User:
${item.username}
</p>


<p>
Amount:

UGX ${Number(item.amount || 0).toLocaleString()}

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
// WITHDRAWAL RECORDS
// =================================


async function loadWithdrawalRecords(){


let box =
document.getElementById("financialContainer");



if(!box){

return;

}





let response =
await fetch(

API +
"/api/admin/withdrawal-records"

);



let withdrawals =
await response.json();




box.innerHTML = "";




withdrawals.forEach(function(item){



let card =
document.createElement("div");



card.className =
"record-card";



card.innerHTML = `


<h3>
Withdrawal Record
</h3>


<p>
User:
${item.username}
</p>


<p>
Amount:

UGX ${Number(item.amount || 0).toLocaleString()}

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


async function loadIncomeRecords(){


let box =
document.getElementById("financialContainer");


if(!box){

return;

}



box.innerHTML = `

<div class="empty-state">

Loading income records...

</div>

`;



try{


let response =
await fetch(

API +
"/api/admin/income-records"

);



let records =
await response.json();



box.innerHTML = "";




if(records.length === 0){


box.innerHTML = `

<div class="empty-state">

No income records found

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
${record.type || "Income"}
</h3>



<p>
User:
<b>
${record.username || ""}
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



`;



box.appendChild(card);



});



}catch(error){


console.log(error);



box.innerHTML = `

<div class="empty-state">

Failed to load income records

</div>

`;

}


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


async function loadReferralRecords(){



let box =
document.getElementById("financialContainer");



if(!box){

return;

}




box.innerHTML = `

<div class="empty-state">

Loading referral records...

</div>

`;




try{


let response =
await fetch(

API +
"/api/admin/referral-records"

);



let records =
await response.json();




box.innerHTML = "";





if(records.length===0){


box.innerHTML = `

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



card.className =
"record-card";



card.innerHTML = `


<h3>
${record.type || "Referral Bonus"}
</h3>


<p>
User:
<b>
${record.username || ""}
</b>
</p>



<p>
Commission:

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



`;



box.appendChild(card);



});



}catch(error){


console.log(error);



box.innerHTML = `

<div class="empty-state">

Failed to load referral records

</div>

`;

}


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


async function loadAnnouncements(){


let box =
document.getElementById("announcementContainer");



if(!box){

return;

}




box.innerHTML = `

<div class="empty-state">

Loading announcements...

</div>

`;




try{


let response =
await fetch(

API +
"/api/admin/announcements"

);



let announcements =
await response.json();




box.innerHTML = "";





if(announcements.length===0){


box.innerHTML = `

<div class="empty-state">

No announcements available

</div>

`;

return;

}





announcements.forEach(function(item){



let card =
document.createElement("div");



card.className =
"record-card";



card.innerHTML = `


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
async function(){



await fetch(

API +
"/api/admin/announcements/" +
item._id,

{

method:"DELETE"

}

);



alert("Announcement removed successfully");



loadAnnouncements();



};



});



}catch(error){


console.log(error);



box.innerHTML = `

<div class="empty-state">

Failed to load announcements

</div>

`;

}


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

async function loadAdminSettings(){


let box =
document.getElementById("managementContainer");


if(!box){

return;

}



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

<h4>
Deposit Rules
</h4>


<input 
type="number"
id="minimumDeposit"
placeholder="Minimum Deposit"
>


<input 
type="number"
id="registrationBonus"
placeholder="Registration Bonus"
>


<input 
type="number"
id="dailyLoginBonus"
placeholder="Daily Login Bonus"
>


<button id="saveDepositRulesBtn">
Save Deposit Rules
</button>


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
>


<input 
type="number"
id="withdrawalFee"
placeholder="Withdrawal Fee"
>


<input 
type="number"
id="dailyWithdrawalLimit"
placeholder="Daily Withdrawal Limit"
>


<button id="saveWithdrawalRulesBtn">
Save Withdrawal Rules
</button>


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


</div>



</div>


`;



// ===============================
// LOAD CURRENT SETTINGS
// ===============================


try{


let response =
await fetch(
API + "/api/admin/settings"
);


let settings =
await response.json();



if(settings){


document.getElementById("platformName").value =
settings.platformName || "";


document.getElementById("supportContact").value =
settings.supportContact || "";


document.getElementById("minimumDeposit").value =
settings.minimumDeposit || "";


document.getElementById("minimumWithdrawal").value =
settings.minimumWithdrawal || "";


document.getElementById("withdrawalFee").value =
settings.withdrawalFee || "";


document.getElementById("dailyWithdrawalLimit").value =
settings.dailyWithdrawalLimit || "";


}



}catch(error){

console.log(error);

}



// ===============================
// CHANGE PASSWORD
// ===============================

let changeBtn =
document.getElementById("changePasswordBtn");


if(changeBtn){


changeBtn.onclick=function(){


let newPassword =
document.getElementById("newAdminPassword").value;



if(newPassword === ""){

alert("Enter new password");

return;

}



localStorage.setItem(
"cashnovaAdminPassword",
newPassword
);



alert("Admin password changed successfully");


};


}






// ===============================
// SAVE PLATFORM SETTINGS
// ===============================


let savePlatformBtn =
document.getElementById("savePlatformBtn");



if(savePlatformBtn){


savePlatformBtn.onclick=async function(){


let data = {


platformName:
document.getElementById("platformName").value,


supportContact:
document.getElementById("supportContact").value


};



await fetch(

API + "/api/admin/settings",

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

}

);



alert("Platform settings saved");


};


}






// ===============================
// SAVE DEPOSIT RULES
// ===============================


let saveDepositRulesBtn =
document.getElementById("saveDepositRulesBtn");



if(saveDepositRulesBtn){


saveDepositRulesBtn.onclick=async function(){



let data = {


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
)


};



await fetch(

API + "/api/admin/settings",

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

}

);



alert("Deposit rules saved successfully");


};


}






// ===============================
// SAVE WITHDRAWAL RULES
// ===============================


let saveWithdrawalRulesBtn =
document.getElementById("saveWithdrawalRulesBtn");



if(saveWithdrawalRulesBtn){


saveWithdrawalRulesBtn.onclick=async function(){



let data = {


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
)


};



await fetch(

API + "/api/admin/settings",

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

}

);



alert("Withdrawal rules saved successfully");


};


}







// ===============================
// SAVE MAINTENANCE
// ===============================


let saveMaintenanceBtn =
document.getElementById("saveMaintenanceBtn");



if(saveMaintenanceBtn){


saveMaintenanceBtn.onclick=async function(){



let status =
document.getElementById("maintenanceStatus").value;



await fetch(

API + "/api/admin/maintenance",

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

status:status

})

}

);



alert("Maintenance status updated");


};


}


} 
   
