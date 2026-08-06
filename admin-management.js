document.addEventListener("DOMContentLoaded", function(){


const API =
"https://cashnova-backend-89lg.onrender.com";



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
${deposit.date || ""}
</p>



<span class="pending">
Pending
</span>



<div class="admin-actions">

<button class="approve-btn">
Approve
</button>


</div>


`;





const approveButton =
card.querySelector(".approve-btn");



approveButton.onclick = function(){


approveDeposit(deposit._id);


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



});
