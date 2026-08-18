/* =================================
   CASHNOVA WITHDRAW SYSTEM
   CLEAN MONGODB VERSION
================================= */

document.addEventListener("DOMContentLoaded", async function(){


const userId = localStorage.getItem("cashnovaUserId");


if(!userId){

alert("Login session missing");

return;

}


let user;


// ================================
// LOAD USER DATA
// ================================

try{


const response = await fetch(

"https://cashnova-backend-production-2404.up.railway.app/api/users/" + userId

);


const data = await response.json();



if(!response.ok){

alert(data.message || "Unable to load account");

return;

}


user = data;



}catch(error){


console.log(error);

alert("Server connection error");

return;

}



// ================================
// SHOW BALANCE
// ================================

const walletBalance =
document.getElementById("walletBalance");


if(walletBalance){

walletBalance.innerHTML =
"UGX " +
Number(user.walletBalance || 0)
.toLocaleString();

}



// ================================
// SHOW REGISTERED NUMBER
// ================================

const withdrawPhone =
document.getElementById("withdrawPhone");


if(withdrawPhone){

withdrawPhone.value =
user.phone || "";

}



// ================================
// CALCULATE FEE
// ================================


const withdrawAmount =
document.getElementById("withdrawAmount");


const withdrawFee =
document.getElementById("withdrawFee");


const receiveAmount =
document.getElementById("receiveAmount");



if(withdrawAmount){


withdrawAmount.addEventListener("input", function(){


const amount =
Number(this.value || 0);


const fee =
amount * 0.14;


const receive =
amount - fee;



withdrawFee.innerHTML =
"UGX " +
fee.toLocaleString();



receiveAmount.innerHTML =
"UGX " +
receive.toLocaleString();



});


}





// ================================
// SUBMIT WITHDRAWAL
// ================================


const confirmWithdraw =
document.getElementById("confirmWithdraw");



if(confirmWithdraw){


confirmWithdraw.onclick = async function(){



const amount =
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





const response =
await fetch(

"https://cashnova-backend-89lg.onrender.com/api/withdrawals",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

userId:user._id,

amount:amount,

phone:user.phone

})


}

);





const result =
await response.json();





if(!response.ok){


alert(
result.message || "Withdrawal failed"
);


return;


}




alert(
"Withdrawal request submitted successfully"
);



window.location.reload();



};


}



});
