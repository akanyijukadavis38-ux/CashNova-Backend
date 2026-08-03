document
.getElementById("resetBtn")
.addEventListener("click", function(){



let account =
document.getElementById("recoverAccount").value.trim();



let newPassword =
document.getElementById("newPassword").value.trim();



let confirmPassword =
document.getElementById("confirmPassword").value.trim();



let message =
document.getElementById("message");



if(!account || !newPassword || !confirmPassword){

    message.innerHTML =
    "Please fill all fields";

    return;

}



if(newPassword !== confirmPassword){

    message.innerHTML =
    "Passwords do not match";

    return;

}




let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];




let user =
users.find(function(item){


return item.email === account ||
       item.phone === account;


});





if(!user){


message.innerHTML =
"Account not found";


return;


}





user.password = newPassword;




localStorage.setItem(

"cashnovaUsers",

JSON.stringify(users)

);




message.innerHTML =
"Password reset successful. You can now login.";



});