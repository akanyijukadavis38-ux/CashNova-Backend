/* =================================
   CASHNOVA TEAM & REFERRAL SYSTEM
   MONGODB VERSION
================================= */

document.addEventListener("DOMContentLoaded", async function () {

    // =================================
    // GET CURRENT USER ID
    // =================================

    const userId =
        localStorage.getItem("cashnovaUserId");


    if (!userId) {

        console.log("CashNova user ID missing");

        return;

    }



    // =================================
    // LOAD USER FROM MONGODB
    // =================================

    let user;


    try {

        const response = await fetch(
            "https://cashnova-backend-89lg.onrender.com/api/users/" +
            userId
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load user"
            );

        }


        user = await response.json();


        // Keep latest user data locally
        localStorage.setItem(
            "cashnovaUserData",
            JSON.stringify(user)
        );


    } catch (error) {

        console.log(
            "Team user loading error:",
            error
        );

        return;

    }



    if (!user) {

        return;

    }



    // =================================
    // REFERRAL CODE
    // =================================

    const referralCode =
        document.getElementById("referralCode");


    const referralLink =
        document.getElementById("referralLink");


    const referredBy =
        document.getElementById("referredBy");



    if (referralCode) {

        referralCode.textContent =
            user.myReferralCode || "N/A";

    }



    if (referralLink) {

        referralLink.value =
            window.location.origin +
            "/register.html?ref=" +
            (user.myReferralCode || "");

    }



    if (referredBy) {

        referredBy.textContent =
            user.referredBy || "No referrer";

    }



    // =================================
    // TEAM MEMBERS
    // =================================

    const members =
        Array.isArray(user.teamMembers)
            ? user.teamMembers
            : [];



    // =================================
    // LEVEL COUNTS
    // =================================

    let levelOneMembers = 0;

    let levelTwoMembers = 0;

    let levelThreeMembers = 0;



    let levelOneAmount = 0;

    let levelTwoAmount = 0;

    let levelThreeAmount = 0;



    members.forEach(function (member) {

        const level =
            Number(member.level || 0);


        const deposit =
            Number(
                member.firstDepositAmount || 0
            );



        if (level === 1) {

            levelOneMembers++;

            levelOneAmount +=
                deposit * 0.20;

        }


        else if (level === 2) {

            levelTwoMembers++;

            levelTwoAmount +=
                deposit * 0.03;

        }


        else if (level === 3) {

            levelThreeMembers++;

            levelThreeAmount +=
                deposit * 0.01;

        }

    });



    // =================================
    // TOTAL TEAM
    // =================================

    const totalTeam =
        document.getElementById("totalTeam");


    if (totalTeam) {

        totalTeam.textContent =
            members.length;

    }



    // =================================
    // REFERRAL EARNINGS
    // =================================

    const referralIncome =
        document.getElementById("referralIncome");


    if (referralIncome) {

        referralIncome.textContent =
            "UGX " +
            Number(
                user.referralIncome || 0
            ).toLocaleString();

    }



    // =================================
    // LEVEL 1
    // =================================

    const levelOne =
        document.getElementById("levelOneMembers");


    if (levelOne) {

        levelOne.textContent =
            levelOneMembers;

    }



    const levelOneTotal =
        document.getElementById("levelOneAmount");


    if (levelOneTotal) {

        levelOneTotal.textContent =
            "UGX " +
            levelOneAmount.toLocaleString();

    }



    // =================================
    // LEVEL 2
    // =================================

    const levelTwo =
        document.getElementById("levelTwoMembers");


    if (levelTwo) {

        levelTwo.textContent =
            levelTwoMembers;

    }



    const levelTwoTotal =
        document.getElementById("levelTwoAmount");


    if (levelTwoTotal) {

        levelTwoTotal.textContent =
            "UGX " +
            levelTwoAmount.toLocaleString();

    }



    // =================================
    // LEVEL 3
    // =================================

    const levelThree =
        document.getElementById("levelThreeMembers");


    if (levelThree) {

        levelThree.textContent =
            levelThreeMembers;

    }



    const levelThreeTotal =
        document.getElementById("levelThreeAmount");


    if (levelThreeTotal) {

        levelThreeTotal.textContent =
            "UGX " +
            levelThreeAmount.toLocaleString();

    }



    // =================================
    // COPY REFERRAL LINK
    // =================================

    const copyButton =
        document.getElementById("copyReferral");


    if (copyButton) {

        copyButton.onclick = async function () {

            const link =
                document.getElementById(
                    "referralLink"
                );


            if (!link) {

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    link.value
                );


                alert(
                    "Referral link copied"
                );


            } catch (error) {

                link.select();

                document.execCommand("copy");

                alert(
                    "Referral link copied"
                );

            }

        };

    }



    // =================================
    // SHARE REFERRAL LINK
    // =================================

    const shareButton =
        document.getElementById("shareReferral");


    if (shareButton) {

        shareButton.onclick = async function () {

            const link =
                document.getElementById(
                    "referralLink"
                );


            if (!link) {

                return;

            }


            const url =
                link.value;


            if (navigator.share) {

                try {

                    await navigator.share({

                        title:
                            "CashNova",

                        text:
                            "Join CashNova using my referral link",

                        url:
                            url

                    });

                } catch (error) {

                    console.log(
                        "Share cancelled"
                    );

                }

            } else {

                alert(url);

            }

        };

    }



    // =================================
    // MY TEAM BUTTON
    // =================================

    const teamButton =
        document.getElementById(
            "viewTeamButton"
        );


    if (teamButton) {

        teamButton.onclick = function () {

            window.location.href =
                "my-team.html";

        };

    }



});
