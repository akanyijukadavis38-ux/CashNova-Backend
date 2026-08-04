document.addEventListener("DOMContentLoaded", async function(){


// ===============================
// LOAD DATA
// ===============================

let users = [];

let response = await fetch(
"https://cashnova-backend-89lg.onrender.com/api/admin/users"
);

users = await response.json();


let deposits = [];

let depositResponse = await fetch(
"https://cashnova-backend-89lg.onrender.com/api/admin/deposit-records"
);

deposits = await depositResponse.json();



let withdrawals = [];

let withdrawalResponse = await fetch(
"https://cashnova-backend-89lg.onrender.com/api/admin/withdrawal-records"
);

withdrawals = await withdrawalResponse.json();






// ===============================
// TOTAL USERS
// ===============================


let totalUsers =
document.getElementById("totalUsers");


if(totalUsers){

totalUsers.innerHTML =
users.length;

}








// ===============================
// ACTIVE USERS
// ===============================


let activeUsers =
users.filter(function(user){

return user.firstDepositCompleted === true ||
user.accountActivated === true;

});



let activeUsersBox =
document.getElementById("activeUsers");



if(activeUsersBox){

activeUsersBox.innerHTML =
activeUsers.length;

}








// ===============================
// TOTAL DEPOSITS
// ===============================


let totalDepositsAmount = 0;



deposits.forEach(function(deposit){


if(deposit.status === "Credited"){


totalDepositsAmount +=
Number(deposit.amount || 0);


}


});



let totalDeposits =
document.getElementById("totalDeposits");



if(totalDeposits){

totalDeposits.innerHTML =
"UGX " +
totalDepositsAmount.toLocaleString();

}








// ===============================
// TOTAL WITHDRAWALS
// ===============================


let totalWithdrawalsAmount = 0;



withdrawals.forEach(function(withdrawal){


if(withdrawal.status === "Approved"){


totalWithdrawalsAmount +=
Number(withdrawal.amount || 0);


}


});



let totalWithdrawals =
document.getElementById("totalWithdrawals");



if(totalWithdrawals){

totalWithdrawals.innerHTML =
"UGX " +
totalWithdrawalsAmount.toLocaleString();

}








// ===============================
// PENDING COUNTS
// ===============================

let pendingDeposits =
deposits.filter(function(item){

return String(item.status).toLowerCase().trim() === "pending";

}).length;




let pendingWithdrawals =
withdrawals.filter(function(item){

return String(item.status).toLowerCase().trim() === "pending";

}).length;







let pendingDepositsBox =
document.getElementById("pendingDeposits");



let pendingWithdrawalsBox =
document.getElementById("pendingWithdrawals");





if(pendingDepositsBox){

pendingDepositsBox.innerHTML =
"(" + pendingDeposits + ")";

}




if(pendingWithdrawalsBox){

pendingWithdrawalsBox.innerHTML =
"(" + pendingWithdrawals + ")";

}








// ===============================
// TOTAL INVESTMENTS
// ===============================


let totalInvestmentsAmount = 0;



users.forEach(function(user){



if(user.purchasedProducts){



user.purchasedProducts.forEach(function(product){



totalInvestmentsAmount +=
Number(product.price || product.amount || 0);



});


}



});





let totalInvestments =
document.getElementById("totalInvestments");



if(totalInvestments){

totalInvestments.innerHTML =
"UGX " +
totalInvestmentsAmount.toLocaleString();

}








// ===============================
// TOTAL INCOME PAID
// ===============================


let totalIncome = 0;



users.forEach(function(user){



if(user.incomeRecords){



user.incomeRecords.forEach(function(record){


if(
record.status === "Credited" ||
record.status === "Completed"
){



totalIncome +=
Number(record.amount || 0);


}


});


}



});






let totalIncomePaid =
document.getElementById("totalIncomePaid");



if(totalIncomePaid){

totalIncomePaid.innerHTML =
"UGX " +
totalIncome.toLocaleString();

}




// ===============================
// LOGOUT
// ===============================

let logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.onclick = function(){

localStorage.removeItem("cashnovaAdminSession");

alert("Admin logged out successfully");

window.location.href = "admin-login.html";

};

}



// =================================
// ANALYTICS DATA
// =================================


let platformGrowth =
document.querySelector(".analytics-card:nth-child(1) h3");


let moneyFlow =
document.querySelector(".analytics-card:nth-child(2) h3");


let userActivity =
document.querySelector(".analytics-card:nth-child(3) h3");




// PLATFORM GROWTH

if(platformGrowth){

platformGrowth.innerHTML =
users.length + " Users";

}



// MONEY FLOW

let totalMoneyFlow = 0;


deposits.forEach(function(deposit){


if(deposit.status === "Credited"){


totalMoneyFlow +=
Number(deposit.amount || 0);


}


});



if(moneyFlow){

moneyFlow.innerHTML =
"UGX " +
totalMoneyFlow.toLocaleString();

}




// USER ACTIVITY

let activeCount =
users.filter(function(user){

return user.accountActivated === true ||
user.firstDepositCompleted === true;

}).length;



if(userActivity){

userActivity.innerHTML =
activeCount + " Active";

}




});
