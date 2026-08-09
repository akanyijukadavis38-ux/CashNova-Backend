document.addEventListener("DOMContentLoaded", function(){

const adminToken =
localStorage.getItem("cashnovaAdminToken");

if(!adminToken){

    window.location.href = "admin-login.html";

    return;
}

async function adminFetch(url, options = {}){

    options.headers = {
        ...(options.headers || {}),
        "Authorization": "Bearer " + adminToken,
        "Content-Type": "application/json"
    };

    const response =
        await fetch(url, options);

    if(
        response.status === 401 ||
        response.status === 403
    ){

        localStorage.removeItem("cashnovaAdminToken");
        localStorage.removeItem("cashnovaAdminSession");

        window.location.href = "admin-login.html";

        return null;
    }

    return response;
}
const API =
"https://cashnova-backend-89lg.onrender.com";

function formatDate(date){

if(!date){
return "";
}

return new Date(date).toLocaleString("en-UG",{

timeZone:"Africa/Kampala",

year:"numeric",

month:"short",

day:"numeric",

hour:"2-digit",

minute:"2-digit",

second:"2-digit"

});

}

const title =
document.getElementById("managementTitle");


const container =
document.getElementById("managementContainer");



const params =
new URLSearchParams(window.location.search);


const section =
params.get("section");




// ===============================
// PART 1: DEPOSIT MANAGEMENT
// ===============================


if(section === "deposit" || !section){


title.innerHTML =
"Pending Deposits";


loadDeposits();


}

// ===============================
// OPEN WITHDRAWAL MANAGEMENT
// ===============================

if(section === "withdrawal"){


title.innerHTML =
"Pending Withdrawals";


loadWithdrawals();


}




async function loadDeposits(){


container.innerHTML = `

<div class="empty-state">

Loading deposits...

</div>

`;



try{


const response =
await fetch(
API + "/api/deposits"
);



const deposits =
await response.json();



showPendingDeposits(deposits);



}

catch(error){


console.log(error);



container.innerHTML = `

<div class="empty-state">

Failed to load deposits

</div>

`;

}


}








function showPendingDeposits(deposits){


container.innerHTML = "";



const pendingDeposits =
deposits.filter(function(deposit){


return deposit.status === "Pending";


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



const card =
document.createElement("div");



card.className =
"deposit-card";



card.innerHTML = `

<h3>
Deposit Request
</h3>


<p>
Username:
<b>
${deposit.username || "Unknown"}
</b>
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
${formatDate(deposit.date)}
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





const approveButton =
card.querySelector(".approve-btn");



approveButton.onclick = function(){


approveDeposit(deposit._id);


};

const rejectButton =
card.querySelector(".reject-btn");



rejectButton.onclick = function(){


rejectDeposit(deposit._id);


};


container.appendChild(card);



});



}









async function approveDeposit(id){


try{


const response =
await fetch(

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



const result =
await response.json();



alert(result.message);



loadDeposits();



}


catch(error){


console.log(error);


alert("Deposit approval failed");


}


}

async function rejectDeposit(id){


try{


const response =
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



const result =
await response.json();



alert(result.message);



loadDeposits();



}


catch(error){


console.log(error);


alert("Deposit rejection failed");


}


}
  


  // =====================================
// PART 2 - WITHDRAWALS
// =====================================


let withdrawals = [];


// LOAD WITHDRAWALS

async function loadWithdrawals(){


container.innerHTML = `

<div class="empty-state">

Loading withdrawals...

</div>

`;



try{


let response = await fetch(
API + "/api/withdrawals"
);



withdrawals = await response.json();



displayWithdrawals();



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load withdrawals

</div>

`;

}


}





// DISPLAY PENDING WITHDRAWALS

function displayWithdrawals(){


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
Username:
<b>${withdrawal.username || ""}</b>
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
Receive:

<b>
UGX ${Number(withdrawal.receiveAmount || 0).toLocaleString()}
</b>

</p>



<p>
Date:
${formatDate(withdrawal.date)}

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



}







// APPROVE WITHDRAWAL

async function approveWithdrawal(id){


try{


let response =
await fetch(

API + "/api/withdrawals/approve/" + id,

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


alert("Failed to approve withdrawal");


}


}







// REJECT WITHDRAWAL

async function rejectWithdrawal(id){


try{


let response =
await fetch(

API + "/api/withdrawals/reject/" + id,

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


alert("Failed to reject withdrawal");


}


}
 // OPEN ALL USERS

if(section === "users"){


title.innerHTML =
"All Users";


loadAllUsers();


}




async function loadAllUsers(){


container.innerHTML = `

<div class="empty-state">

Loading users...

</div>

`;



try{


const response =
await adminFetch(
API + "/api/admin/users"
);

if(!response){
    return;
}



const users =
await response.json();



displayUsers(users);



}catch(error){


console.log(error);



container.innerHTML = `

<div class="empty-state">

Failed to load users

</div>

`;

}


}







function displayUsers(users){


container.innerHTML = "";



if(users.length === 0){


container.innerHTML = `

<div class="empty-state">

No users found

</div>

`;

return;

}






users.forEach(function(user){



const card =
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

${
user.accountActivated
?
"Active"
:
"Inactive"
}

</span>

</p>



<p>
Registered:

${formatDate(user.createdAt)}

</p>


`;



container.appendChild(card);



});


} 
// =====================================
// PART 4 - ACTIVE USERS
// =====================================


// OPEN ACTIVE USERS

if(section === "active-users"){


title.innerHTML =
"Active Users";


loadActiveUsers();


}




async function loadActiveUsers(){


container.innerHTML = `

<div class="empty-state">

Loading active users...

</div>

`;



try{


if(!response){
    return;
}


const users =
await response.json();



displayActiveUsers(users);



}catch(error){


console.log(error);



container.innerHTML = `

<div class="empty-state">

Failed to load active users

</div>

`;

}


}







function displayActiveUsers(users){


container.innerHTML = "";



if(users.length === 0){


container.innerHTML = `

<div class="empty-state">

No active users found

</div>

`;

return;

}






users.forEach(function(user){



const card =
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
Wallet Balance:

<b>
UGX ${Number(user.walletBalance || 0).toLocaleString()}
</b>

</p>



<p>
Registered:

${formatDate(user.createdAt)}

</p>



<span class="user-status">

Active

</span>


`;



container.appendChild(card);



});


}
 

// =====================================
// PART 5 - FINANCIAL RECORDS
// =====================================


if(
section === "deposit-records" ||
section === "withdrawal-records" ||
section === "income-records" ||
section === "referral-records"
){

loadFinancialRecords(section);

}



async function loadFinancialRecords(type){


container.innerHTML = `

<div class="empty-state">

Loading records...

</div>

`;


try{


const response =
await adminFetch(
API + "/api/admin/" + type
);

if(!response){
    return;
}



const records =
await response.json();



displayFinancialRecords(records);



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load records

</div>

`;

}


}





function displayFinancialRecords(records){


container.innerHTML = "";



if(!records || records.length === 0){


container.innerHTML = `

<div class="empty-state">

No records found

</div>

`;

return;

}



records.forEach(function(record){


const card =
document.createElement("div");



card.className =
"financial-card";



card.innerHTML = `

<h3>
${record.type || "Record"}
</h3>


<p>
Username:
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
${formatDate(record.date)}
</p>

`;



container.appendChild(card);



});


}
// =====================================
// PART - ANNOUNCEMENTS
// =====================================

if(section === "announcements"){

title.innerHTML = "Announcements";

loadAnnouncements();

}


// =====================================
// LOAD ANNOUNCEMENTS
// =====================================

async function loadAnnouncements(){

const announcementSection =
document.getElementById("announcementSection");

const announcementContainer =
document.getElementById("announcementContainer");

const addAnnouncementBtn =
document.getElementById("addAnnouncementBtn");

const announcementText =
document.getElementById("announcementText");


if(announcementSection){

announcementSection.style.display = "block";

}


// SHOW LOADING

if(announcementContainer){

announcementContainer.innerHTML = `

<div class="empty-state">

Loading announcements...

</div>

`;

}


try{

const response =
await adminFetch(
API + "/api/admin/announcements"
);

if(!response){
    return;
}


if(!response.ok){

throw new Error("Failed to load announcements");

}


const announcements =
await response.json();


displayAnnouncements(announcements);



}catch(error){

console.log(error);


if(announcementContainer){

announcementContainer.innerHTML = `

<div class="empty-state">

Failed to load announcements

</div>

`;

}

}



// =====================================
// POST ANNOUNCEMENT
// =====================================

if(addAnnouncementBtn){

addAnnouncementBtn.onclick =
async function(){


const message =
announcementText.value.trim();


if(!message){

alert("Please write an announcement.");

return;

}



addAnnouncementBtn.disabled = true;

addAnnouncementBtn.innerHTML =
"Posting...";



try{


const response =
await adminFetch(

API + "/api/admin/announcements",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

title:"CashNova Announcement",

message:message

})

}

);



const result =
await response.json();



if(!response.ok){

throw new Error(
result.message ||
"Failed to post announcement"
);

}



alert(
result.message ||
"Announcement posted successfully"
);



announcementText.value = "";



await loadAnnouncements();



}catch(error){


console.log(error);


alert(
error.message ||
"Failed to post announcement"
);



}finally{


addAnnouncementBtn.disabled = false;

addAnnouncementBtn.innerHTML =
"Post Announcement";


}

};

}

}


// =====================================
// DISPLAY ANNOUNCEMENTS
// =====================================

function displayAnnouncements(announcements){


const announcementContainer =
document.getElementById("announcementContainer");


if(!announcementContainer){

return;

}



announcementContainer.innerHTML = "";



if(
!announcements ||
announcements.length === 0
){

announcementContainer.innerHTML = `

<div class="empty-state">

No announcements yet.

</div>

`;

return;

}



announcements.forEach(function(announcement){


const card =
document.createElement("div");


card.className =
"announcement-card";



const date =
announcement.date
?
formatDate(announcement.date)
:
"";


card.innerHTML = `

<h3>

${announcement.title ||
"CashNova Announcement"}

</h3>


<p>

${announcement.message || ""}

</p>


<small>

${date}

</small>


<div class="admin-actions">


<button
class="delete-announcement-btn"
data-id="${announcement._id}"
>

Delete

</button>


</div>

`;



const deleteButton =
card.querySelector(
".delete-announcement-btn"
);



deleteButton.onclick =
function(){

deleteAnnouncement(
announcement._id
);

};



announcementContainer.appendChild(card);


});


}


// =====================================
// DELETE ANNOUNCEMENT
// =====================================

async function deleteAnnouncement(id){


if(!id){

return;

}



const confirmDelete =
confirm(
"Are you sure you want to delete this announcement?"
);


if(!confirmDelete){

return;

}



try{

const response =
await adminFetch(

API +
"/api/admin/announcements/" +
id,


{

method:"DELETE"

}

);



const result =
await response.json();



if(!response.ok){

throw new Error(
result.message ||
"Failed to delete announcement"
);

}



alert(
result.message ||
"Announcement deleted"
);



loadAnnouncements();



}catch(error){


console.log(error);


alert(
error.message ||
"Failed to delete announcement"
);


}

}
  // =====================================
// PART 6 - ADMIN SETTINGS
// =====================================

if(section === "settings"){

title.innerHTML = "Admin Settings";

loadSettings();

}



async function loadSettings(){

container.innerHTML = `

<div class="empty-state">

Loading settings...

</div>

`;



try{


await adminFetch(
API + "/api/admin/settings"
);



const settings =
await response.json();



displaySettings(settings);



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load settings

</div>

`;

}


}





function displaySettings(settings){


container.innerHTML = `


<div class="settings-card">


<h3>
Platform Settings
</h3>


<label>
Platform Name
</label>

<input 
id="platformName"
value="${settings.platformName || "CashNova"}"
>



<label>
Support Contact
</label>

<input 
id="supportContact"
value="${settings.supportContact || ""}"
>



<label>
Minimum Deposit
</label>

<input 
id="minimumDeposit"
type="number"
value="${settings.minimumDeposit || 15000}"
>



<label>
Minimum Withdrawal
</label>

<input 
id="minimumWithdrawal"
type="number"
value="${settings.minimumWithdrawal || 5000}"
>



<label>
Withdrawal Fee %
</label>

<input 
id="withdrawalFee"
type="number"
value="${settings.withdrawalFee || 14}"
>



<label>
Daily Withdrawal Limit
</label>

<input 
id="dailyWithdrawalLimit"
type="number"
value="${settings.dailyWithdrawalLimit || 2}"
>




<button id="saveSettingsBtn">

Save Settings

</button>



</div>


`;



document.getElementById("saveSettingsBtn").onclick =
updateSettings;



}




async function updateSettings(){



const data = {


platformName:
document.getElementById("platformName").value,


supportContact:
document.getElementById("supportContact").value,


minimumDeposit:
Number(document.getElementById("minimumDeposit").value),


minimumWithdrawal:
Number(document.getElementById("minimumWithdrawal").value),


withdrawalFee:
Number(document.getElementById("withdrawalFee").value),


dailyWithdrawalLimit:
Number(document.getElementById("dailyWithdrawalLimit").value)


};




try{

await adminFetch(

API + "/api/admin/settings",


{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

}

);



const result =
await response.json();



alert(
result.message ||
"Settings updated"
);



loadSettings();



}catch(error){


console.log(error);


alert(
"Failed to update settings"
);


}


}
  // =====================================
// PART 7 - MAINTENANCE MODE
// =====================================


if(section === "maintenance"){

title.innerHTML =
"Maintenance Mode";


loadMaintenance();

}




async function loadMaintenance(){


container.innerHTML = `

<div class="empty-state">

Loading maintenance status...

</div>

`;



try{


await adminFetch(
API + "/api/admin/maintenance"
);



const data =
await response.json();



displayMaintenance(data);



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load maintenance

</div>

`;

}


}





function displayMaintenance(data){


container.innerHTML = `


<div class="settings-card">


<h3>
Platform Maintenance
</h3>



<p>
Current Status:
<b id="maintenanceStatus">
${data.status}
</b>
</p>



<button id="activateMaintenance">

Enable Maintenance

</button>



<button id="disableMaintenance">

Disable Maintenance

</button>



</div>


`;




document.getElementById(
"activateMaintenance"
).onclick = function(){


updateMaintenance("maintenance");


};



document.getElementById(
"disableMaintenance"
).onclick = function(){


updateMaintenance("active");


};



}






async function updateMaintenance(status){


try{

await adminFetch(

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



const result =
await response.json();



alert(
result.message
);



loadMaintenance();



}catch(error){


console.log(error);


alert(
"Failed to update maintenance"
);


}


}
});
