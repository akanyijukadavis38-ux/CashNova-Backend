/* =================================
   CASHNOVA TEAM SYSTEM
   MONGODB / RENDER VERSION
   TEAM SUMMARY PAGE ONLY
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
            Number(amount || 0)
                .toLocaleString();

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
                    API + "/" + userId
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
       REFERRAL LINK
    ================================= */

    function createReferralLink(code) {

        if (!code) {

            return "";

        }


        const url =
            new URL(
                window.location.href
            );


        url.search = "";


        url.searchParams.set(
            "ref",
            code
        );


        return url.toString();

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
                user.referredBy
                    ? user.referredBy
                    : "Direct registration";

        }

    }


    /* =================================
       GET TEAM MEMBERS
    ================================= */

    function getTeamMembers(user) {

        if (
            Array.isArray(
                user.teamMembers
            )
        ) {

            return user.teamMembers;

        }


        return [];

    }


    /* =================================
       CALCULATE LEVEL
    ================================= */

    function calculateLevel(
        members,
        level
    ) {

        const levelMembers =
            members.filter(function(member) {

                return Number(
                    member.level
                ) === Number(level);

            });


        let totalAmount = 0;


        levelMembers.forEach(
            function(member) {

                totalAmount +=
                    Number(
                        member.firstDepositAmount || 0
                    );

            }
        );


        return {

            members:
                levelMembers.length,

            amount:
                totalAmount

        };

    }


    /* =================================
       DISPLAY TEAM STATISTICS
    ================================= */

    function displayStatistics(user) {

        const members =
            getTeamMembers(user);


        /* TOTAL TEAM */

        const totalTeam =
            document.getElementById(
                "totalTeam"
            );


        if (totalTeam) {

            totalTeam.textContent =
                members.length;

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
            calculateLevel(
                members,
                1
            );


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
                level1.members;

        }


        if (levelOneAmount) {

            levelOneAmount.textContent =
                money(level1.amount);

        }


        /* LEVEL 2 */

        const level2 =
            calculateLevel(
                members,
                2
            );


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
                level2.members;

        }


        if (levelTwoAmount) {

            levelTwoAmount.textContent =
                money(level2.amount);

        }


        /* LEVEL 3 */

        const level3 =
            calculateLevel(
                members,
                3
            );


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
                level3.members;

        }


        if (levelThreeAmount) {

            levelThreeAmount.textContent =
                money(level3.amount);

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
            async function() {

                if (!input.value) {

                    return;

                }


                try {

                    await navigator.clipboard
                        .writeText(
                            input.value
                        );


                    button.innerHTML =
                        '<i class="fa-solid fa-check"></i>';


                    setTimeout(
                        function() {

                            button.innerHTML =
                                '<i class="fa-solid fa-copy"></i>';

                        },
                        1500
                    );


                } catch(error) {

                    input.select();

                    document.execCommand(
                        "copy"
                    );

                }

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
            async function() {

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

                    } catch(error) {

                        console.log(
                            "Share cancelled."
                        );

                    }

                }
                else {

                    try {

                        await navigator.clipboard
                            .writeText(link);


                        alert(
                            "Referral link copied!"
                        );

                    } catch(error) {

                        alert(link);

                    }

                }

            };

    }


    /* =================================
       MY TEAM BUTTON
       OPEN SEPARATE PAGE
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
            function() {

                /*
                 IMPORTANT:
                 Change ONLY this filename if
                 your separate My Team page
                 has another filename.
                */

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


        console.log(
            "CashNova MongoDB team:",
            user.teamMembers
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
