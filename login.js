document
.getElementById("loginForm")
.addEventListener("submit", async function(event){

event.preventDefault();


let username =
document.getElementById("loginUsername").value.trim();


let password =
document.getElementById("loginPassword").value.trim();



if(username === "" || password === ""){

alert("Please enter username and password.");

return;

}



try{


let response = await fetch(

"https://cashnova-backend-89lg.onrender.com/api/users/login",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

username:username,

password:password

})

}

);



let data = await response.json();

if(response.ok){


localStorage.setItem(
"cashnovaCurrentUser",
username
);


// Save MongoDB user ID

localStorage.setItem(
"cashnovaUserId",
data.user._id
);


localStorage.setItem(
"cashnovaUserData",
JSON.stringify(data.user)
);




alert("Login successful");


window.location.href="dashboard.html";


}


else{


alert(data.message);


}



}

catch(error){


console.log(error);

alert("Server connection failed");


}


});