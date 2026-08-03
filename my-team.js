/* =================================
   CASHNOVA MY TEAM SYSTEM
================================= */


document.addEventListener("DOMContentLoaded", function(){



function getCurrentUserData(){


let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];


let username =
localStorage.getItem("cashnovaCurrentUser");



return users.find(function(user){

return user.username === username;

});


}






function showMembers(level){


let user = getCurrentUserData();


if(!user){

return;

}




// GET ALL TEAM MEMBERS

let members =
user.teamMembers || [];




// FILTER BY LEVEL

if(level !== undefined){


members =
members.filter(function(member){


return Number(member.level) === Number(level);


});


}






// TOTAL MEMBERS (ALL LEVELS)

let totalMembers =
document.getElementById("totalMembers");



if(totalMembers){


let allMembers =
user.teamMembers || [];



totalMembers.innerHTML =
allMembers.length;


}



// ACTIVE MEMBERS

let activeMembers =
document.getElementById("activeMembers");



if(activeMembers){

let allMembers =
user.teamMembers || [];

let active =
allMembers.filter(function(member){

return member.depositStatus === "Active";

});


activeMembers.innerHTML =
active.length;

}





// REFERRAL EARNINGS

let referralEarnings =
document.getElementById("referralEarnings");



if(referralEarnings){

referralEarnings.innerHTML =
"UGX " +
Number(user.referralIncome || 0)
.toLocaleString();

}
// TOTAL TEAM FIRST DEPOSITS

let teamDeposits =
document.getElementById("teamDeposits");

if(teamDeposits){

    let totalFirstDeposits = 0;

    (user.teamMembers || []).forEach(function(member){

        totalFirstDeposits += Number(member.firstDepositAmount || 0);

    });

    teamDeposits.innerHTML =
    "UGX " + totalFirstDeposits.toLocaleString();

}

let container =
document.getElementById("membersContainer");



if(!container){

return;

}






if(members.length === 0){


container.innerHTML =

`
<div class="empty-state">

<i class="fa-solid fa-user-group"></i>

<p>
No members in this level yet
</p>

</div>
`;

return;

}






container.innerHTML = "";






members.forEach(function(member){



let card =
document.createElement("div");



card.className =
"member-card";





let hiddenAccount =
member.username ?

"****" + member.username.slice(-4)

:

"****";


card.innerHTML =

`

<div class="member-top">

<h3>
${hiddenAccount}
</h3>

<span class="level-badge">
Level ${member.level}
</span>

</div>



<div class="member-info">

<p>
<i class="fa-solid fa-wallet"></i>
Deposit:
<span class="deposit-badge">
${member.depositStatus || "Not yet deposited"}
</span>
</p>




<p>
<i class="fa-solid fa-wallet"></i>
Deposit:
<b>
UGX ${Number(member.firstDepositAmount || 0).toLocaleString()}
</b>
</p>

<p>
<i class="fa-solid fa-percent"></i>
Commission Earnings:
<b>
UGX ${
(
Number(member.firstDepositAmount || 0) *
(
Number(member.level) === 1 ? 0.20 :
Number(member.level) === 2 ? 0.03 :
Number(member.level) === 3 ? 0.01 : 0
)
)
.toLocaleString()
}
</b>
</p>





<p>
<i class="fa-solid fa-calendar"></i>
Joined:
${member.joinedDate || "Unknown"}
</p>


</div>

`;






container.appendChild(card);



});


}









function setActiveButton(button){


document.querySelectorAll(".level-buttons button")
.forEach(function(btn){

btn.classList.remove("active");

});


button.classList.add("active");


}







let levelOneButton =
document.getElementById("levelOneButton");


let levelTwoButton =
document.getElementById("levelTwoButton");


let levelThreeButton =
document.getElementById("levelThreeButton");






if(levelOneButton){

levelOneButton.onclick = function(){

setActiveButton(levelOneButton);

showMembers(1);

};

}






if(levelTwoButton){

levelTwoButton.onclick = function(){

setActiveButton(levelTwoButton);

showMembers(2);

};

}






if(levelThreeButton){

levelThreeButton.onclick = function(){

setActiveButton(levelThreeButton);

showMembers(3);

};

}






// LOAD LEVEL ONE BY DEFAULT

showMembers(1);



});