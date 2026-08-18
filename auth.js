// LOAD REFERRAL CODE FROM LINK

document.addEventListener("DOMContentLoaded", function(){

    let params = new URLSearchParams(
        window.location.search
    );

    let ref = params.get("ref");

    if(ref){

        document.getElementById("referral").value = ref;

    }

});


// REGISTER USER

document
.getElementById("registerForm")
.addEventListener("submit", async function(event){

    event.preventDefault();


    let fullName = document.getElementById("fullName").value.trim();
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value.trim();
    let referral = document.getElementById("referral").value.trim();


    if(!/^\d{9}$/.test(phone)){

        alert("Enter a valid Uganda phone number.");

        return;

    }


    try{


        let response = await fetch(

        "https://cashnova-backend-production-2404.up.railway.app/api/users/register",

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },


            body:JSON.stringify({

                fullName:fullName,

                username:username,

                email:email,

                phone:"+256"+phone,

                password:password,

                referredBy:referral

            })

        });



        let result = await response.json();



        if(response.ok){


            alert("Registration successful");


            window.location.href="login.html";


        }

        else{


            alert(result.message);

        }



    }

    catch(error){


        alert("Unable to connect to server");


        console.log(error);


    }


});
