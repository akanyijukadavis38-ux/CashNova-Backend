/* =================================
   CASHNOVA MY TEAM SYSTEM
   MONGODB VERSION
================================= */

document.addEventListener("DOMContentLoaded", async function () {

    const API =
        "https://cashnova-backend-89lg.onrender.com/api/users";


    /* =================================
       GET CURRENT USER
    ================================= */

    function getCurrentUserId() {

        return localStorage.getItem("cashnovaUserId");

    }


    /* =================================
       LOAD CURRENT USER FROM MONGODB
    ================================= */

    async function getCurrentUserData() {

        const userId = getCurrentUserId();

        if (!userId) {

            console.error("CashNova user ID not found.");

            return null;

        }


        try {

            const response =
                await fetch(API + "/" + userId);


            if (!response.ok) {

                throw new Error(
                    "Unable to load user"
                );

            }


            const user =
                await response.json();


            /*
             SAVE FRESH USER DATA LOCALLY
             SO OTHER CASHNOVA PAGES CAN
             ALSO USE THE LATEST DATA.
            */

            localStorage.setItem(
                "cashnovaUserData",
                JSON.stringify(user)
            );


            return user;


        } catch (error) {

            console.error(
                "Team user loading error:",
                error
            );

            return null;

        }

    }


    /* =================================
       SHOW TEAM MEMBERS
    ================================= */

    async function showMembers(level) {

        const user =
            await getCurrentUserData();


        if (!user) {

            const container =
                document.getElementById(
                    "membersContainer"
                );


            if (container) {

                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <p>
                            Unable to load team members.
                        </p>
                    </div>
                `;

            }

            return;

        }


        /* =================================
           GET TEAM MEMBERS FROM MONGODB
        ================================= */

        let members =
            Array.isArray(user.teamMembers)
                ? user.teamMembers
                : [];


        /* =================================
           FILTER LEVEL
        ================================= */

        if (level !== undefined) {

            members =
                members.filter(function (member) {

                    return Number(member.level) ===
                        Number(level);

                });

        }


        /* =================================
           TOTAL TEAM MEMBERS
        ================================= */

        const totalMembers =
            document.getElementById(
                "totalMembers"
            );


        if (totalMembers) {

            totalMembers.innerHTML =
                Array.isArray(user.teamMembers)
                    ? user.teamMembers.length
                    : 0;

        }


        /* =================================
           ACTIVE TEAM MEMBERS
        ================================= */

        const activeMembers =
            document.getElementById(
                "activeMembers"
            );


        if (activeMembers) {

            const allMembers =
                Array.isArray(user.teamMembers)
                    ? user.teamMembers
                    : [];


            const active =
                allMembers.filter(function (member) {

                    return String(
                        member.depositStatus || ""
                    ).toLowerCase() === "active";

                });


            activeMembers.innerHTML =
                active.length;

        }


        /* =================================
           REFERRAL EARNINGS
        ================================= */

        const referralEarnings =
            document.getElementById(
                "referralEarnings"
            );


        if (referralEarnings) {

            referralEarnings.innerHTML =
                "UGX " +
                Number(
                    user.referralIncome || 0
                ).toLocaleString();

        }


        /* =================================
           TOTAL TEAM DEPOSITS
        ================================= */

        const teamDeposits =
            document.getElementById(
                "teamDeposits"
            );


        if (teamDeposits) {

            let totalFirstDeposits = 0;


            const allMembers =
                Array.isArray(user.teamMembers)
                    ? user.teamMembers
                    : [];


            allMembers.forEach(function (member) {

                totalFirstDeposits +=
                    Number(
                        member.firstDepositAmount || 0
                    );

            });


            teamDeposits.innerHTML =
                "UGX " +
                totalFirstDeposits.toLocaleString();

        }


        /* =================================
           MEMBERS CONTAINER
        ================================= */

        const container =
            document.getElementById(
                "membersContainer"
            );


        if (!container) {

            console.error(
                "membersContainer not found."
            );

            return;

        }


        /* =================================
           NO MEMBERS
        ================================= */

        if (members.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-user-group"></i>

                    <p>
                        No members in this level yet
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        /* =================================
           DISPLAY MEMBERS
        ================================= */

        members.forEach(function (member) {


            const card =
                document.createElement("div");


            card.className =
                "member-card";


            /* =================================
               MEMBER NAME
            ================================= */

            let memberName =
                member.username ||
                member.fullName ||
                "Team Member";


            /*
             DO NOT HIDE THE WHOLE NAME.

             Show the username normally so
             the owner can identify the member.
            */


            /* =================================
               DEPOSIT AMOUNT
            ================================= */

            const depositAmount =
                Number(
                    member.firstDepositAmount || 0
                );


            /* =================================
               DEPOSIT STATUS
            ================================= */

            const depositStatus =
                member.depositStatus ||
                "Not yet deposited";


            /* =================================
               COMMISSION
            ================================= */

            let percentage = 0;


            if (Number(member.level) === 1) {

                percentage = 0.20;

            }

            else if (Number(member.level) === 2) {

                percentage = 0.03;

            }

            else if (Number(member.level) === 3) {

                percentage = 0.01;

            }


            const commission =
                depositAmount * percentage;


            /* =================================
               MEMBER CARD
            ================================= */

            card.innerHTML = `

                <div class="member-top">

                    <h3>
                        ${memberName}
                    </h3>

                    <span class="level-badge">
                        Level ${member.level}
                    </span>

                </div>


                <div class="member-info">

                    <p>

                        <i class="fa-solid fa-wallet"></i>

                        Deposit Status:

                        <span class="deposit-badge">

                            ${depositStatus}

                        </span>

                    </p>


                    <p>

                        <i class="fa-solid fa-money-bill-wave"></i>

                        Deposit:

                        <b>
                            UGX
                            ${depositAmount.toLocaleString()}
                        </b>

                    </p>


                    <p>

                        <i class="fa-solid fa-percent"></i>

                        Commission:

                        <b>
                            UGX
                            ${commission.toLocaleString()}
                        </b>

                    </p>


                    <p>

                        <i class="fa-solid fa-calendar"></i>

                        Joined:

                        ${member.joinedDate || "Unknown"}

                    </p>

                </div>

            `;


            container.appendChild(card);

        });

    }


    /* =================================
       ACTIVE BUTTON
    ================================= */

    function setActiveButton(button) {

        document
            .querySelectorAll(
                ".level-buttons button"
            )
            .forEach(function (btn) {

                btn.classList.remove("active");

            });


        if (button) {

            button.classList.add("active");

        }

    }


    /* =================================
       LEVEL BUTTONS
    ================================= */

    const levelOneButton =
        document.getElementById(
            "levelOneButton"
        );


    const levelTwoButton =
        document.getElementById(
            "levelTwoButton"
        );


    const levelThreeButton =
        document.getElementById(
            "levelThreeButton"
        );


    if (levelOneButton) {

        levelOneButton.onclick =
            async function () {

                setActiveButton(
                    levelOneButton
                );

                await showMembers(1);

            };

    }


    if (levelTwoButton) {

        levelTwoButton.onclick =
            async function () {

                setActiveButton(
                    levelTwoButton
                );

                await showMembers(2);

            };

    }


    if (levelThreeButton) {

        levelThreeButton.onclick =
            async function () {

                setActiveButton(
                    levelThreeButton
                );

                await showMembers(3);

            };

    }


    /* =================================
       INITIAL LOAD
       LEVEL 1
    ================================= */

    if (levelOneButton) {

        setActiveButton(
            levelOneButton
        );

    }


    await showMembers(1);

});
