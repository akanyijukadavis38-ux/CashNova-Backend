/* =================================
   CASHNOVA TEAM SYSTEM
   MONGODB / RENDER VERSION
   TEAM SUMMARY PAGE
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const API =
        "https://cashnova-backend-89lg.onrender.com/api/users";


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
       CREATE REGISTRATION REFERRAL LINK
    ================================= */

    function createReferralLink(code) {

        if (!code) {

            return "";

        }

        /*
         IMPORTANT:
         This automatically uses the same
         GitHub Pages location where the
         registration page exists.

         Example:
         https://username.github.io/CashNova/register.html?ref=CN741828
        */

        const registerURL =
            new URL(
                "register.html",
                window.location.href
            );

        registerURL.searchParams.set(
            "ref",
            code
        );

        return registerURL.href;

    }


    /* =================================
       LOAD USER FROM MONGODB
    ================================= */

    async function loadUser() {

        const userId =
            getUserId();


        if (!userId) {

            console.error(
                "cashnovaUserId not found."
            );

            return null;

        }


        try {

            const response =
                await fetch(
                    API + "/team/" + userId
                );


            if (!response.ok) {

                throw new Error(
                    "Server returned " +
                    response.status
                );

            }


            const user =
                await response.json();


            /* Keep latest user data locally */

            localStorage.setItem(
                "cashnovaUserData",
                JSON.stringify(user)
            );


            return user;


        } catch (error) {

            console.error(
                "Team loading error:",
                error
            );

            return null;

        }

    }


    /* =================================
       DISPLAY REFERRAL INFORMATION
    ================================= */

    function displayReferralInformation(user) {

        const code =
            user.myReferralCode ||
            user.referralCode ||
            "";


        const referralCode =
            document.getElementById(
                "referralCode"
            );


        const referralLink =
            document.getElementById(
                "referralLink"
            );


        const referredBy =
            document.getElementById(
                "referredBy"
            );


        if (referralCode) {

            referralCode.textContent =
                code || "Not available";

        }


        if (referralLink) {

            referralLink.value =
                createReferralLink(code);

        }


        if (referredBy) {

            referredBy.textContent =
                user.referredBy ||
                "Direct registration";

        }

    }


    /* =================================
       DISPLAY TEAM STATISTICS
    ================================= */

    function displayStatistics(user) {

        /* TOTAL TEAM */

        const totalTeam =
            document.getElementById(
                "totalTeam"
            );


        if (totalTeam) {

            totalTeam.textContent =
                Number(
                    user.totalTeam || 0
                );

        }


        /* REFERRAL EARNINGS */

        const referralIncome =
            document.getElementById(
                "referralIncome"
            );


        if (referralIncome) {

            referralIncome.textContent =
                money(
                    user.referralIncome || 0
                );

        }


        /* LEVEL 1 */

        const level1 =
            user.levels &&
            user.levels.level1
                ? user.levels.level1
                : {
                    members: 0,
                    amount: 0
                };


        const levelOneMembers =
            document.getElementById(
                "levelOneMembers"
            );


        const levelOneAmount =
            document.getElementById(
                "levelOneAmount"
            );


        if (levelOneMembers) {

            levelOneMembers.textContent =
                Number(
                    level1.members || 0
                );

        }


        if (levelOneAmount) {

            levelOneAmount.textContent =
                money(
                    level1.amount || 0
                );

        }


        /* LEVEL 2 */

        const level2 =
            user.levels &&
            user.levels.level2
                ? user.levels.level2
                : {
                    members: 0,
                    amount: 0
                };


        const levelTwoMembers =
            document.getElementById(
                "levelTwoMembers"
            );


        const levelTwoAmount =
            document.getElementById(
                "levelTwoAmount"
            );


        if (levelTwoMembers) {

            levelTwoMembers.textContent =
                Number(
                    level2.members || 0
                );

        }


        if (levelTwoAmount) {

            levelTwoAmount.textContent =
                money(
                    level2.amount || 0
                );

        }


        /* LEVEL 3 */

        const level3 =
            user.levels &&
            user.levels.level3
                ? user.levels.level3
                : {
                    members: 0,
                    amount: 0
                };


        const levelThreeMembers =
            document.getElementById(
                "levelThreeMembers"
            );


        const levelThreeAmount =
            document.getElementById(
                "levelThreeAmount"
            );


        if (levelThreeMembers) {

            levelThreeMembers.textContent =
                Number(
                    level3.members || 0
                );

        }


        if (levelThreeAmount) {

            levelThreeAmount.textContent =
                money(
                    level3.amount || 0
                );

        }

    }


    /* =================================
       COPY REFERRAL LINK
    ================================= */

    function setupCopyButton() {

        const button =
            document.getElementById(
                "copyReferral"
            );


        const input =
            document.getElementById(
                "referralLink"
            );


        if (!button || !input) {

            return;

        }


        button.onclick =
            async function () {

                if (!input.value) {

                    return;

                }


                try {

                    await navigator.clipboard.writeText(
                        input.value
                    );


                    button.innerHTML =
                        '<i class="fa-solid fa-check"></i> Copied!';


                } catch (error) {

                    input.select();

                    document.execCommand(
                        "copy"
                    );


                    button.innerHTML =
                        '<i class="fa-solid fa-check"></i> Copied!';

                }


                setTimeout(
                    function () {

                        button.innerHTML =
                            '<i class="fa-solid fa-copy"></i>';

                    },
                    2000
                );

            };

    }


    /* =================================
       SHARE REFERRAL LINK
    ================================= */

    function setupShareButton() {

        const button =
            document.getElementById(
                "shareReferral"
            );


        const input =
            document.getElementById(
                "referralLink"
            );


        if (!button || !input) {

            return;

        }


        button.onclick =
            async function () {

                const link =
                    input.value;


                if (!link) {

                    return;

                }


                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share({

                            title:
                                "Join CashNova",

                            text:
                                "Join CashNova using my referral link.",

                            url:
                                link

                        });

                    } catch (error) {

                        console.log(
                            "Share cancelled."
                        );

                    }

                } else {

                    try {

                        await navigator.clipboard.writeText(
                            link
                        );


                        alert(
                            "Referral link copied!"
                        );


                    } catch (error) {

                        alert(link);

                    }

                }

            };

    }


    /* =================================
       MY TEAM BUTTON
    ================================= */

    function setupTeamButton() {

        const button =
            document.getElementById(
                "viewTeamButton"
            );


        if (!button) {

            return;

        }


        button.onclick =
            function () {

                window.location.href =
                    "my-team.html";

            };

    }


    /* =================================
       START TEAM PAGE
    ================================= */

    async function startTeamPage() {

        const user =
            await loadUser();


        if (!user) {

            const referralCode =
                document.getElementById(
                    "referralCode"
                );


            const referredBy =
                document.getElementById(
                    "referredBy"
                );


            if (referralCode) {

                referralCode.textContent =
                    "Unable to load";

            }


            if (referredBy) {

                referredBy.textContent =
                    "Unable to load";

            }


            return;

        }


        console.log(
            "CashNova Team user:",
            user
        );


        displayReferralInformation(
            user
        );


        displayStatistics(
            user
        );


        setupCopyButton();


        setupShareButton();


        setupTeamButton();

    }


    startTeamPage();

});
