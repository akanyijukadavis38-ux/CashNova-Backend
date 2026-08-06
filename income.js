/* =================================
   CASHNOVA DAILY INVESTMENT INCOME
   MONGODB VERSION
================================= */


document.addEventListener(
"DOMContentLoaded",
async function(){


const userId =
localStorage.getItem("cashnovaUserId");


if(!userId){

console.log("User ID missing");

return;

}



try{


const response = await fetch(

"https://cashnova-backend-89lg.onrender.com/api/users/daily-income/" + userId,

{

method:"POST",

headers:{

"Content-Type":"application/json"

}

}

);



const result =
await response.json();



console.log(
"Daily income:",
result.message
);




// Update latest user data

if(result.user){


localStorage.setItem(

"cashnovaUserData",

JSON.stringify(result.user)

);


}




}catch(error){


console.log(
"Daily income error:",
error
);


}



});
