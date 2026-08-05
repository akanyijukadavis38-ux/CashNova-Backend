/* =================================
   CASHNOVA CHECK-IN SYSTEM
================================= */


document.addEventListener("DOMContentLoaded", function(){



const checkInButton =
document.getElementById("checkInButton");


const checkMessage =
document.getElementById("checkMessage");


const totalBonus =
document.getElementById("totalBonus");





// LOAD CURRENT USER DATA

async function getUserData(){

let userId =
localStorage.getItem("cashnovaUserId");

if(!userId){

return null;

}

let response = await fetch(

"https://cashnova-backend-89lg.onrender.com/api/users/" + userId

);

return await response.json();

}







// SHOW TOTAL CHECK-IN BONUS
async function displayTotalBonus(){

let user = await getUserData();

if(!user){

return;

}

totalBonus.innerHTML =
"UGX " +
Number(user.totalCheckInBonus || 0).toLocaleString();

}

displayTotalBonus();




















// CHECK-IN BUTTON


checkInButton.onclick = function(){



let data = getUserData();



if(!data.user){


checkMessage.innerHTML =
"User session missing";


return;


}





let user = data.user;



let now = new Date();



let lastCheckIn = user.lastCheckInDate

? new Date(user.lastCheckInDate)

: null;





if(lastCheckIn){



let hoursPassed =

(now - lastCheckIn) /

(1000 * 60 * 60);





if(hoursPassed < 24){



checkMessage.innerHTML =

"You have already checked in for today. Try again after 24 hours.";



return;



}



}







// GIVE CHECK-IN BONUS


let bonus = 100;



// USE EXISTING WALLET SYSTEM

addIncome(

bonus,

"Check-in Bonus"

);
console.log("Check-in bonus added");
// RELOAD USER AFTER addIncome()

data = getUserData();

user = data.user;



// SAVE CHECK-IN TIME


user.lastCheckInDate =

now.toISOString();





user.totalCheckInBonus =

(user.totalCheckInBonus || 0)

+ bonus;





data.users[data.index] = user;



localStorage.setItem(

"cashnovaUsers",

JSON.stringify(data.users)

);





checkMessage.innerHTML =

"Congratulations! You received UGX 100 Check-in Bonus.";





displayTotalBonus();



};




});
