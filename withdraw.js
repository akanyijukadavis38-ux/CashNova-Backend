/* =================================
   CASHNOVA WITHDRAW SYSTEM
   MONGODB CONNECTED VERSION
================================= */

document.addEventListener("DOMContentLoaded", async function(){


let userId =
localStorage.getItem("cashnovaUserId");



if(!userId){

alert("Login session missing");

return;

}



// GET USER DATA FROM DATABASE

let user;



try{


let response = await fetch(

"https://cashnova-backend-89lg.onrender.com/api/users/" + userId

);


let data = await response.json();


if(!response.ok){

alert(data.message || "User not found");

return;

}


user = data;
console.log("Withdraw.js loaded");

console.log(user);

console.log(user.walletBalance);

console.log(user.phone);

}

catch(error){


console.log(error);

alert("Server connection failed");

return;


}




// ================================
// SHOW WALLET BALANCE
// ================================

let walletBalance =
document.getElementById("walletBalance");


if(walletBalance){

walletBalance.innerHTML =
"UGX " +
Number(user.walletBalance || 0).toLocaleString();

}





// ================================
// LOAD PHONE NUMBER
// ================================

let withdrawPhone =
document.getElementById("withdrawPhone");


if(withdrawPhone){

withdrawPhone.value =
user.phone || "";

}
  // ================================
// ELEMENTS
// ================================

let withdrawAmount =
document.getElementById("withdrawAmount");


let withdrawFee =
document.getElementById("withdrawFee");


let receiveAmount =
document.getElementById("receiveAmount");





// ================================
// CALCULATE WITHDRAWAL FEE
// ================================

if(withdrawAmount){

withdrawAmount.oninput = function(){


let amount =
Number(withdrawAmount.value || 0);


let fee =
amount * 14 / 100;


let receive =
amount - fee;



if(withdrawFee){

withdrawFee.innerHTML =
"UGX " +
fee.toLocaleString();

}



if(receiveAmount){

receiveAmount.innerHTML =
"UGX " +
receive.toLocaleString();

}


};


}





// ================================
// CONFIRM WITHDRAWAL
// ================================

let confirmWithdraw =
document.getElementById("confirmWithdraw");



if(confirmWithdraw){


confirmWithdraw.onclick = async function(){



// FIRST DEPOSIT CHECK

if(user.firstDepositCompleted !== true){

alert(
"Complete your first deposit before withdrawal."
);

return;

}




// PRODUCT PURCHASE CHECK

if(
!user.purchasedProducts ||
user.purchasedProducts.length === 0
){

alert(
"Purchase a product before withdrawal."
);

return;

}





let amount =
Number(withdrawAmount.value || 0);





if(amount < 5000){

alert(
"Minimum withdrawal is UGX 5,000"
);

return;

}




if(amount > Number(user.walletBalance || 0)){

alert(
"Insufficient wallet balance"
);

return;

}
 // ================================
// SEND WITHDRAWAL TO BACKEND
// ================================


let response =
await fetch(

"https://cashnova-backend-89lg.onrender.com/api/withdrawals",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

userId:userId,

amount:amount,

phone:user.phone

})

}

);



let data =
await response.json();




if(!response.ok){


alert(
data.message || "Withdrawal failed"
);


return;


}




alert(
"Withdrawal request submitted successfully"
);



// UPDATE DISPLAYED BALANCE

if(walletBalance){

walletBalance.innerHTML =
"UGX " +
Number(data.walletBalance || 0)
.toLocaleString();

}



location.reload();



};


} 
  
