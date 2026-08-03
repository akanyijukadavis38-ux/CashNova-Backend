function logoutUser(){


let confirmLogout =
confirm("Are you sure you want to logout?");



if(confirmLogout){


localStorage.removeItem(
"cashnovaCurrentUser"
);



window.location.href =
"login.html";


}


}