/* =================================
   CASHNOVA DAILY CHECK-IN
   MONGODB / BACKEND VERSION
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const checkInButton =
        document.getElementById("checkInButton");

    const checkMessage =
        document.getElementById("checkMessage");

    const totalBonus =
        document.getElementById("totalBonus");


    const API =
        "https://cashnova-backend-production-2404.up.railway.app/api/users";


    /* =================================
       GET CURRENT USER ID
    ================================= */

    function getUserId() {

        return localStorage.getItem(
            "cashnovaUserId"
        );

    }


    /* =================================
       FORMAT MONEY
    ================================= */

    function money(amount) {

        return "UGX " +
            Number(amount || 0).toLocaleString();

    }


    /* =================================
       LOAD USER FROM MONGODB
    ================================= */

    async function getUserData() {

        const userId =
            getUserId();

        if (!userId) {

            return null;

        }

        try {

            const response =
                await fetch(
                    API + "/" + userId
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load user"
                );

            }

            const user =
                await response.json();

            return user;

        }
        catch (error) {

            console.error(
                "Check-in user loading error:",
                error
            );

            return null;

        }

    }


    /* =================================
       SHOW TOTAL CHECK-IN BONUS
    ================================= */

    async function displayTotalBonus() {

        const user =
            await getUserData();

        if (!user) {

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
       CHECK CURRENT CHECK-IN STATUS
    ================================= */

    async function updateCheckInStatus() {

        const user =
            await getUserData();

        if (!user) {

            checkMessage.textContent =
                "User session not found.";

            checkInButton.disabled = true;

            return;

        }


        if (!user.lastCheckInDate) {

            checkInButton.disabled = false;

            checkInButton.textContent =
                "Check In Now";

            checkMessage.textContent =
                "Your UGX 100 daily reward is available.";

            return;

        }


        const lastCheckIn =
            new Date(
                user.lastCheckInDate
            );

        const now =
            new Date();


        const millisecondsPassed =
            now - lastCheckIn;


        const twentyFourHours =
            24 * 60 * 60 * 1000;


        /* =================================
           STILL WITHIN 24 HOURS
        ================================= */

        if (
            millisecondsPassed <
            twentyFourHours
        ) {

            const remainingMilliseconds =
                twentyFourHours -
                millisecondsPassed;


            const remainingHours =
                Math.floor(
                    remainingMilliseconds /
                    (1000 * 60 * 60)
                );


            const remainingMinutes =
                Math.floor(
                    (
                        remainingMilliseconds %
                        (1000 * 60 * 60)
                    ) /
                    (1000 * 60)
                );


            checkInButton.disabled = true;

            checkInButton.textContent =
                "Already Checked In";


            checkMessage.textContent =
                "You have already checked in. " +
                "Come back in " +
                remainingHours +
                "h " +
                remainingMinutes +
                "m.";

            return;

        }


        /* =================================
           24 HOURS COMPLETED
        ================================= */

        checkInButton.disabled = false;

        checkInButton.textContent =
            "Check In Now";

        checkMessage.textContent =
            "Your UGX 100 daily reward is available.";

    }


    /* =================================
       CHECK-IN BUTTON
    ================================= */

    checkInButton.onclick =
        async function () {

            const userId =
                getUserId();


            if (!userId) {

                checkMessage.textContent =
                    "User session not found.";

                return;

            }


            /* =================================
               PREVENT DOUBLE CLICK
            ================================= */

            checkInButton.disabled = true;

            checkInButton.textContent =
                "Checking...";


            try {

                const response =
                    await fetch(
                        API +
                        "/check-in/" +
                        userId,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response.json();


                /* =================================
                   BACKEND REJECTED CHECK-IN
                ================================= */

                if (!response.ok) {

                    if (
                        data.alreadyCheckedIn
                    ) {

                        checkMessage.textContent =
                            data.message;

                        checkInButton.disabled =
                            true;

                        checkInButton.textContent =
                            "Already Checked In";

                    }
                    else {

                        checkMessage.textContent =
                            data.message ||
                            "Unable to complete check-in.";

                        checkInButton.disabled =
                            false;

                        checkInButton.textContent =
                            "Check In Now";

                    }

                    return;

                }


                /* =================================
                   SUCCESS
                ================================= */

                checkMessage.textContent =
                    "Congratulations! " +
                    "You received UGX 100 Check-in Bonus.";


                checkInButton.disabled =
                    true;

                checkInButton.textContent =
                    "Already Checked In";


                /* =================================
                   UPDATE TOTAL BONUS
                ================================= */

                totalBonus.textContent =
                    money(
                        data.totalCheckInBonus
                    );


                /* =================================
                   SAVE LATEST USER LOCALLY
                ================================= */

                if (data.user) {

                    localStorage.setItem(
                        "cashnovaUserData",
                        JSON.stringify(
                            data.user
                        )
                    );

                }


            }
            catch (error) {

                console.error(
                    "Check-in error:",
                    error
                );


                checkMessage.textContent =
                    "Connection error. " +
                    "Please try again.";


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

    updateCheckInStatus();

});
