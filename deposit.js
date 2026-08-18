/* =================================
   CASHNOVA DEPOSIT SYSTEM
   PART 1
================================= */

document.addEventListener("DOMContentLoaded", function(){

// =====================================
// VARIABLES
// =====================================

let selectedMethod = "";

const amountInput =
document.getElementById("depositAmount");

const transactionInput =
document.getElementById("transactionId");

const paymentDetails =
document.getElementById("paymentDetails");

const mtnButton =
document.getElementById("mtnButton");

const airtelButton =
document.getElementById("airtelButton");

const confirmButton =
document.getElementById("confirmPayment");

const successPopup =
document.getElementById("successPopup");

const successOk =
document.getElementById("successOk");



// =====================================
// QUICK AMOUNT BUTTONS
// =====================================

const amountButtons =
document.querySelectorAll(".amount-buttons button");

amountButtons.forEach(function(button){

button.addEventListener("click", function(){

amountInput.value =
Number(button.textContent);

});

});



// =====================================
// SHOW PAYMENT DETAILS
// =====================================

function showPayment(network){

let merchantCode = "";
let dial = "";

if(network === "MTN"){

merchantCode = "52200475";
dial = "*165*3#";

}else{

merchantCode = "7157334";
dial = "*185*9#";

}

paymentDetails.innerHTML = `

<div class="payment-card">

<h3>${network} Mobile Money</h3>

<p>Dial</p>

<h3>${dial}</h3>

<p>Merchant Code</p>

<div class="merchant-code">
${merchantCode}
</div>

<button
class="copy-button"
id="copyCode">

Copy Merchant Code

</button>

</div>

`;

const copyButton =
document.getElementById("copyCode");

if(copyButton){

copyButton.onclick = function(){

navigator.clipboard.writeText(merchantCode);

alert("Merchant code copied successfully.");

};

}

}



// =====================================
// MTN BUTTON
// =====================================

if(mtnButton){

mtnButton.onclick = function(){

selectedMethod = "MTN";

mtnButton.classList.add("active");

airtelButton.classList.remove("active");

showPayment("MTN");

};

}



// =====================================
// AIRTEL BUTTON
// =====================================

if(airtelButton){

airtelButton.onclick = function(){

selectedMethod = "AIRTEL";

airtelButton.classList.add("active");

mtnButton.classList.remove("active");

showPayment("AIRTEL");

};

}
  // =====================================
// CONFIRM PAYMENT
// =====================================

if(confirmButton){

confirmButton.onclick = function(e){

e.preventDefault();

let amount =
Number(amountInput.value);

let transactionId =
transactionInput.value.trim();

let depositRules =
JSON.parse(
localStorage.getItem("cashnovaDepositRules")
) || {

minimumDeposit:15000

};

// VALIDATION
if(amount < depositRules.minimumDeposit){

alert(
"Minimum deposit amount is UGX " +
depositRules.minimumDeposit.toLocaleString() +
"."
);

return;

}



if(selectedMethod === ""){

alert("Please select MTN or Airtel Mobile Money.");

return;

}


if(transactionId === ""){

alert("Please enter your Mobile Money Transaction ID.");

return;

}



// CURRENT USER

let currentUser =
localStorage.getItem("cashnovaCurrentUser");
let userId =
localStorage.getItem("cashnovaUserId");

if(!currentUser){

alert("User session missing.");

return;

}



// CREATE DEPOSIT OBJECT

let depositRequest = {
    userId: userId,
    username: currentUser,
    amount: amount,
    method: selectedMethod,
    mobileMoneyTransactionId: transactionId
};




// SEND DEPOSIT TO BACKEND

fetch(
"https://cashnova-backend-production-2404.up.railway.app/api/deposits",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(depositRequest)

}

)

.then(response=>response.json())

.then(data=>{

console.log(data);

alert("Deposit submitted successfully");

})

.catch(error=>{

console.log(error);

alert("Deposit failed");

});



// SAVE TO USER RECORDS

let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];

let user =
users.find(function(item){

return item.username === currentUser;

});


if(user){

if(!user.incomeRecords){

user.incomeRecords = [];

}

user.incomeRecords.push(depositRequest);

localStorage.setItem(
"cashnovaUsers",
JSON.stringify(users)
);

}



// SHOW SUCCESS POPUP

if(successPopup){

successPopup.style.display = "flex";

}

};

}
  // =====================================
// SUCCESS POPUP
// =====================================

if(successOk){

successOk.onclick = function(){

if(successPopup){

successPopup.style.display = "none";

}

// RESET FORM

amountInput.value = "";

transactionInput.value = "";

selectedMethod = "";

if(mtnButton){

mtnButton.classList.remove("active");

}

if(airtelButton){

airtelButton.classList.remove("active");

}

paymentDetails.innerHTML = `

<p>
Select MTN or Airtel to view payment instructions
</p>

`;

};

}



// =====================================
// END OF DEPOSIT SYSTEM
// =====================================

});
