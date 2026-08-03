/* =================================
   CASHNOVA TEAM & REFERRAL SYSTEM
================================= */


document.addEventListener("DOMContentLoaded", function(){



// GET CURRENT USER DATA

function getCurrentUserData(){


let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];


let username =
localStorage.getItem("cashnovaCurrentUser");



let index =
users.findIndex(function(user){

return user.username === username;

});



return {

users: users,

index:index,

user:users[index]

};


}







// CREATE UNIQUE REFERRAL CODE


function generateReferralCode(){


return "CN" +

Math.floor(
100000 + Math.random() * 900000
);


}







// INITIALIZE USER TEAM DATA


function initializeTeam(){



let data = getCurrentUserData();



if(!data.user){

return;

}



let user = data.user;



let changed = false;



if(!user.myReferralCode){

user.myReferralCode =
generateReferralCode();

changed = true;

}





if(!user.teamMembers){

user.teamMembers = [];

changed = true;

}





if(!user.referralIncome){

user.referralIncome = 0;

changed = true;

}





if(!user.levelOneAmount){

user.levelOneAmount = 0;

changed = true;

}



if(!user.levelTwoAmount){

user.levelTwoAmount = 0;

changed = true;

}



if(!user.levelThreeAmount){

user.levelThreeAmount = 0;

changed = true;

}





if(changed){


data.users[data.index] = user;


localStorage.setItem(

"cashnovaUsers",

JSON.stringify(data.users)

);


}



return user;


}









// SHOW REFERRAL INFORMATION


function displayReferral(){


let user = initializeTeam();



if(!user){

return;

}



let code =
document.getElementById("referralCode");


let link =
document.getElementById("referralLink");


let referredBy =
document.getElementById("referredBy");





if(code){

code.innerHTML =
user.myReferralCode;

}





if(link){

link.value =

window.location.origin +

"/register.html?ref=" +

user.myReferralCode;

}





if(referredBy){

referredBy.innerHTML =
user.referredBy || "No referrer";

}


}









// COUNT TEAM LEVELS


function displayTeamStats(){


let user = initializeTeam();



if(!user){

return;

}



let levelOne = 0;

let levelTwo = 0;

let levelThree = 0;



let members =
user.teamMembers || [];
let levelOneAmount = 0;
let levelTwoAmount = 0;
let levelThreeAmount = 0;

members.forEach(function(member){

    let deposit = Number(member.firstDepositAmount || 0);

    if(Number(member.level) === 1){
        levelOne++;
        levelOneAmount += deposit * 0.20;
    }

    if(Number(member.level) === 2){
        levelTwo++;
        levelTwoAmount += deposit * 0.03;
    }

    if(Number(member.level) === 3){
        levelThree++;
        levelThreeAmount += deposit * 0.01;
    }

});





let total =

levelOne +
levelTwo +
levelThree;




let totalTeam =
document.getElementById("totalTeam");


if(totalTeam){

totalTeam.innerHTML =
total;

}





let referralIncome =
document.getElementById("referralIncome");


if(referralIncome){

referralIncome.innerHTML =

"UGX " +

Number(
user.referralIncome || 0
)
.toLocaleString();

}





let levelOneMembers =
document.getElementById("levelOneMembers");


if(levelOneMembers){

levelOneMembers.innerHTML =
levelOne;

}





let levelTwoMembers =
document.getElementById("levelTwoMembers");


if(levelTwoMembers){

levelTwoMembers.innerHTML =
levelTwo;

}





let levelThreeMembers =
document.getElementById("levelThreeMembers");

if(levelThreeMembers){

levelThreeMembers.innerHTML =
levelThree;

}


// ADD HERE

document.getElementById("levelOneAmount").innerHTML =
"UGX " + levelOneAmount.toLocaleString();

document.getElementById("levelTwoAmount").innerHTML =
"UGX " + levelTwoAmount.toLocaleString();

document.getElementById("levelThreeAmount").innerHTML =
"UGX " + levelThreeAmount.toLocaleString();


}


// COPY REFERRAL LINK


let copyButton =
document.getElementById("copyReferral");



if(copyButton){


copyButton.onclick=function(){


let link =
document.getElementById("referralLink");


navigator.clipboard.writeText(
link.value
);


alert(
"Referral link copied"
);


};


}









// SHARE REFERRAL


let shareButton =
document.getElementById("shareReferral");



if(shareButton){


shareButton.onclick=function(){


let link =
document.getElementById("referralLink").value;



if(navigator.share){


navigator.share({

title:"CashNova",

text:"Join CashNova using my referral link",

url:link

});


}

else{

alert(link);

}


};


}









// MY TEAM BUTTON


let teamButton =
document.getElementById("viewTeamButton");



if(teamButton){


teamButton.onclick=function(){


window.location.href =
"my-team.html";


};


}









// REFERRAL COMMISSION


function calculateReferralCommission(
depositAmount,
level
){


let percentage = 0;



if(level === 1){

percentage = 0.20;

}



if(level === 2){

percentage = 0.03;

}



if(level === 3){

percentage = 0.01;

}



return depositAmount * percentage;


}




window.calculateReferralCommission =
calculateReferralCommission;







displayReferral();


displayTeamStats();



});