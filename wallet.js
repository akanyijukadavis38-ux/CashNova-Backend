/* =================================
   CASHNOVA WALLET SYSTEM
   BACKEND CONNECTED VERSION
================================= */


document.addEventListener("DOMContentLoaded", async function(){


const userId =
localStorage.getItem("cashnovaUserId");



if(!userId){

console.log("User ID missing");

return;

}



try{


const response = await fetch(

"https://cashnova-backend-89lg.onrender.com/api/users/" 
+ userId

);



const user = await response.json();



if(!response.ok){

throw new Error(
"Unable to load user wallet"
);

}




// SAVE UPDATED USER DATA

localStorage.setItem(

"cashnovaUserData",

JSON.stringify(user)

);





// ===============================
// WALLET BALANCE
// ===============================


const walletBalance =
document.getElementById("walletBalance");


if(walletBalance){

walletBalance.innerHTML =

"UGX " +

Number(
user.walletBalance || 0
).toLocaleString();

}




// ===============================
// CUMULATIVE INCOME
// ===============================


let totalIncome =
Number(user.cumulativeIncome || 0);




const cumulativeIncome =
document.getElementById("cumulativeIncome");



if(cumulativeIncome){

cumulativeIncome.innerHTML =

"UGX " +

totalIncome.toLocaleString();

}




// ===============================
// REGISTRATION BONUS
// ===============================


const registrationBonus =
document.getElementById("registrationBonus");

const bonusStatus =
document.getElementById("bonusStatus");



if(registrationBonus){

registrationBonus.innerHTML =

"UGX " +

Number(
user.registrationBonus || 5000
).toLocaleString();

}



if(bonusStatus){

bonusStatus.innerHTML =

user.registrationBonusStatus ||
"Locked";

}





// ===============================
// PHONE NUMBER
// ===============================


const userPhone =
document.getElementById("userPhone");


if(userPhone){

userPhone.innerHTML =
user.phone || "";

}





}

catch(error){


console.log(error);


alert(
"Unable to load wallet information"
);


}



});
