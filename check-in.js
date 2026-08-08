/* =================================
   CASHNOVA CHECK-IN SYSTEM
   MONGODB / RENDER VERSION
================================= */

document.addEventListener("DOMContentLoaded", function(){

    const API =
        "https://cashnova-backend-89lg.onrender.com/api/users";


    const checkInButton =
        document.getElementById("checkInButton");


    const checkMessage =
        document.getElementById("checkMessage");


    const totalBonus =
        document.getElementById("totalBonus");


    /* =================================
       GET CURRENT USER ID
    ================================= */

    function getUserId(){

        return localStorage.getItem(
            "cashnovaUserId"
        );

    }


    /* =================================
       FORMAT MONEY
    ================================= */

    function money(amount){

        return "UGX " +
            Number(amount || 0)
                .toLocaleString();

    }


    /* =================================
       LOAD USER FROM MONGODB
    ================================= */

    async function getUserData(){

        const userId =
            getUserId();


        if(!userId){

            return null;

        }


        try{

            const response =
                await fetch(
                    API + "/" + userId
                );


            if(!response.ok){

                throw new Error(
                    "Unable to load user"
                );

            }


            const user =
                await response.json();


            /* Save latest user locally */

            localStorage.setItem(
                "cashnovaUserData",
                JSON.stringify(user)
            );


            return user;


        }
        catch(error){

            console.error(
                "Check-in user loading error:",
                error
            );

            return null;

        }

    }


    /* =================================
       DISPLAY TOTAL BONUS
    ================================= */

    async function displayTotalBonus(){

        const user =
            await getUserData();


        if(!user){

            totalBonus.textContent =
                "UGX 0";

            return;

        }


        totalBonus.textContent =
            money(
                user.totalCheckInBonus || 0
            );

    }


    /* =================================
       CHECK CURRENT STATUS
    ================================= */

    async function checkCurrentStatus(){

        const user =
            await getUserData();


        if(!user){

            return;

        }


        if(!user.lastCheckInDate){

            checkInButton.disabled = false;

            checkInButton.textContent =
                "Check In Now";

            return;

        }


        const lastCheckIn =
            new Date(
                user.lastCheckInDate
            );


        const now =
            new Date();


        const hoursPassed =
            (now - lastCheckIn) /
            (1000 * 60 * 60);


        if(hoursPassed < 24){

            checkInButton.disabled = true;

            checkInButton.textContent =
                "Already Checked In";

        }
        else{

            checkInButton.disabled = false;

            checkInButton.textContent =
                "Check In Now";

        }

    }


    /* =================================
       CHECK-IN BUTTON
    ================================= */

    checkInButton.onclick =
        async function(){

        const userId =
            getUserId();


        if(!userId){

            checkMessage.textContent =
                "User session missing.";

            return;

        }


        /* Prevent double clicking */

        checkInButton.disabled = true;

        checkInButton.textContent =
            "Checking in...";


        checkMessage.textContent =
            "";


        try{

            const response =
                await fetch(
                    API +
                    "/check-in/" +
                    userId,
                    {

                        method:"POST",

                        headers:{
                            "Content-Type":
                                "application/json"
                        }

                    }
                );


            const data =
                await response.json();


            /* =================================
               CHECK SERVER RESPONSE
            ================================= */

            if(!response.ok){

                checkMessage.textContent =
                    data.message ||
                    "Check-in unavailable.";


                checkInButton.disabled = true;

                checkInButton.textContent =
                    "Already Checked In";


                return;

            }


            /* =================================
               SUCCESS
            ================================= */

            checkMessage.textContent =
                "Congratulations! You received UGX 100 Check-in Bonus.";


            checkMessage.style.color =
                "green";


            checkInButton.disabled =
                true;


            checkInButton.textContent =
                "Checked In ✓";


            /* Update total immediately */

            totalBonus.textContent =
                money(
                    data.totalCheckInBonus
                );


            /* Save latest user */

            if(data.user){

                localStorage.setItem(
                    "cashnovaUserData",
                    JSON.stringify(
                        data.user
                    )
                );

            }


        }
        catch(error){

            console.error(
                "Check-in error:",
                error
            );


            checkMessage.textContent =
                "Unable to complete check-in. Please try again.";


            checkMessage.style.color =
                "red";


            checkInButton.disabled =
                false;


            checkInButton.textContent =
                "Check In Now";

        }

    };


    /* =================================
       START
    ================================= */

    displayTotalBonus();

    checkCurrentStatus();

});
