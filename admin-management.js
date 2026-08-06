document.addEventListener("DOMContentLoaded", function(){


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
await fetch(

API + "/api/admin/users"

);



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


const response =
await fetch(

API + "/api/admin/active-users"

);



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


title.innerHTML =
"Financial Records";


loadFinancialRecords(section);


}



async function loadFinancialRecords(type){



container.innerHTML = `

<div class="empty-state">

Loading financial records...

</div>

`;


try{


const response =
await fetch(

API + "/api/admin/financial-records"

);


const records =
await response.json();

displayFinancialRecords(records,type);



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load financial records

</div>

`;

}


}





function displayFinancialRecords(records,type){


container.innerHTML = "";


if(records.length === 0){


container.innerHTML = `

<div class="empty-state">

No financial records found

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

} 
 

// =====================================
// PART 5A - DEPOSIT RECORDS
// =====================================


if(section === "deposit-records"){


title.innerHTML =
"Deposit Records";


loadDepositRecords();


}




async function loadDepositRecords(){


container.innerHTML = `

<div class="empty-state">

Loading deposit records...

</div>

`;



try{


const response =
await fetch(
API + "/api/admin/financial-records"
);



const records =
await response.json();



const deposits =
records.filter(function(record){


return record.type === "Deposit";


});



displayFinancialRecords(deposits);



}catch(error){


console.log(error);


container.innerHTML = `

<div class="empty-state">

Failed to load deposit records

</div>

`;

}


}
  
});
