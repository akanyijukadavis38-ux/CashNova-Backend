/* =================================
   CASHNOVA ADVANCED HISTORY SYSTEM
================================= */

document.addEventListener("DOMContentLoaded", async function(){



let container =
document.getElementById("historyContainer");

let userId =
localStorage.getItem("cashnovaUserId");

if(!userId){

container.innerHTML =
"<p class='empty-history'>User not found</p>";

return;

}

let user;

try{

let response = await fetch(

"https://cashnova-backend-89lg.onrender.com/api/users/" +
userId

);

user = await response.json();

}catch(error){

container.innerHTML =
"<p class='empty-history'>Failed to load history</p>";

return;

}

if(!user || user.message){

container.innerHTML =
"<p class='empty-history'>User not found</p>";

return;

}
let allRecords = [

...(user.transactionHistory || []),

...(user.depositRecords || []),

...(user.withdrawalRecords || []),

...(user.incomeRecords || [])

];




// Remove locked registration bonus from history
allRecords = allRecords.filter(function(record){

    if(
        record.type === "Registration Bonus" &&
        record.status === "Locked"
    ){

        return false;

    }

    return true;

});
// Remove duplicate records
let uniqueRecords = [];
let recordKeys = new Set();

allRecords.forEach(function(record){
let key =
record.type + "-" +
Number(record.amount) + "-" +
new Date(record.date).getTime();
   

    if(!recordKeys.has(key)){
        recordKeys.add(key);
        uniqueRecords.push(record);
    }

});

// REMOVE DUPLICATES

allRecords = uniqueRecords;


// SORT NEWEST TRANSACTIONS FIRST

allRecords.sort(function(a,b){

    return new Date(b.date) - new Date(a.date);

});





if(allRecords.length === 0){

container.innerHTML =
"<p class='empty-history'>No transaction history available</p>";

return;

}







function displayHistory(records){


container.innerHTML = "";



records.forEach(function(record){



let card =
document.createElement("div");


card.className =
"history-card";





let type =
record.type.toLowerCase();



let icon =
"fa-money-bill-transfer";



if(type.includes("deposit")){

icon="fa-arrow-down";

}



if(type.includes("withdraw")){

icon="fa-arrow-up";

}



if(type.includes("bonus")){

icon="fa-gift";

}



if(type.includes("daily") ||
type.includes("income") ||
type.includes("profit")){

icon="fa-chart-line";

}



if(type.includes("referral")){

icon="fa-users";

}







let statusClass =
"status-pending";



if(record.status === "Approved" ||
record.status === "Credited"){

statusClass =
"status-approved";

}



if(record.status === "Rejected"){

statusClass =
"status-rejected";

}







card.innerHTML = `


<div class="history-left">


<div class="history-icon">

<i class="fa-solid ${icon}"></i>

</div>


<div class="history-details">


<h4>
${record.type}
</h4>

<p>
${
record.date
?
new Date(record.date).toLocaleString("en-UG",{

timeZone:"Africa/Kampala",

year:"numeric",

month:"short",

day:"numeric",

hour:"2-digit",

minute:"2-digit",

second:"2-digit"

})
:
""
}
</p>



${
record.mobileMoneyTransactionId
?
`
<p>
Transaction ID:
<b>${record.mobileMoneyTransactionId}</b>
</p>
`
:
""
}


</div>





<div class="history-right">


<div class="history-amount">

UGX ${Number(record.amount).toLocaleString()}

</div>


<span class="history-status ${statusClass}">

${record.status}

</span>


</div>


`;



container.appendChild(card);



});


}






// SHOW ALL FIRST

displayHistory(allRecords);








// FILTER BUTTONS


let filterButtons =
document.querySelectorAll(".history-filters button");



filterButtons.forEach(function(button){



button.onclick=function(){



filterButtons.forEach(function(btn){

btn.classList.remove("active");

});



button.classList.add("active");



let selected =
button.innerText;



let filtered =
allRecords;



if(selected !== "All"){



filtered =
allRecords.filter(function(record){



let type =
record.type.toLowerCase();





if(selected === "Deposits"){

return type.includes("deposit");

}





if(selected === "Withdrawals"){

return type.includes("withdraw");

}





if(selected === "Daily Income"){

return type.includes("daily") ||
type.includes("income") ||
type.includes("profit");

}





if(selected === "Bonus"){

return type.includes("bonus");

}





if(selected === "Referral"){

return type.includes("referral");

}





return false;



});


}



displayHistory(filtered);



};



});



});
