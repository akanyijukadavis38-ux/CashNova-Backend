/* =================================
   CASHNOVA MY TEAM
   MONGODB / RENDER VERSION
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

            showError(
                "User session not found."
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


            /* Keep latest data locally */

            localStorage.setItem(
                "cashnovaUserData",
                JSON.stringify(user)
            );


            return user;


        } catch (error) {

            console.error(
                "My Team loading error:",
                error
            );

            showError(
                "Unable to load team information."
            );

            return null;

        }

    }


    /* =================================
       ERROR
    ================================= */

    function showError(message) {

        const container =
            document.getElementById(
                "membersContainer"
            );


        if (container) {

            container.innerHTML = `

                <div class="empty-state">

                    <i
                        class="fa-solid fa-triangle-exclamation"
                    ></i>

                    <p>
                        ${message}
                    </p>

                </div>

            `;

        }

    }


    /* =================================
       GET MEMBERS
    ================================= */

    function getMembers(user) {

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
       COMMISSION RATE
    ================================= */

    function getCommissionRate(level) {

        level =
            Number(level);


        if (level === 1) {

            return 0.20;

        }


        if (level === 2) {

            return 0.03;

        }


        if (level === 3) {

            return 0.01;

        }


        return 0;

    }


    /* =================================
       UPDATE SUMMARY
    ================================= */

    function updateSummary(user) {

        const members =
            getMembers(user);


        /* TOTAL MEMBERS */

        const totalMembers =
            document.getElementById(
                "totalMembers"
            );


        if (totalMembers) {

            totalMembers.textContent =
                members.length;

        }


        /* TOTAL TEAM DEPOSITS */

        let totalDeposits = 0;


        members.forEach(
            function(member) {

                totalDeposits +=
                    Number(
                        member.firstDepositAmount || 0
                    );

            }
        );


        const teamDeposits =
            document.getElementById(
                "teamDeposits"
            );


        if (teamDeposits) {

            teamDeposits.textContent =
                money(totalDeposits);

        }


        /* ACTIVE MEMBERS */

        let activeMembers = 0;


        members.forEach(
            function(member) {

                if (
                    String(
                        member.depositStatus || ""
                    ).toLowerCase()
                    === "active"
                ) {

                    activeMembers++;

                }

            }
        );


        const active =
            document.getElementById(
                "activeMembers"
            );


        if (active) {

            active.textContent =
                activeMembers;

        }


        /* REFERRAL EARNINGS */

        const referralEarnings =
            document.getElementById(
                "referralEarnings"
            );


        if (referralEarnings) {

            referralEarnings.textContent =
                money(
                    user.referralIncome || 0
                );

        }

    }


    /* =================================
       DISPLAY MEMBERS
    ================================= */

    function displayMembers(
        user,
        selectedLevel
    ) {

        const container =
            document.getElementById(
                "membersContainer"
            );


        if (!container) {

            return;

        }


        const allMembers =
            getMembers(user);


        /* FILTER LEVEL */

        const members =
            allMembers.filter(
                function(member) {

                    return Number(
                        member.level
                    ) === Number(
                        selectedLevel
                    );

                }
            );


        /* NO MEMBERS */

        if (members.length === 0) {

            container.innerHTML = `

                <div class="empty-state">

                    <i
                        class="fa-solid fa-user-group"
                    ></i>

                    <p>
                        No members in Level
                        ${selectedLevel} yet.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML = "";


        /* DISPLAY MEMBERS */

        members.forEach(
            function(member) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "member-card";


                /* USERNAME */

                const username =
                    member.username ||
                    "Team Member";


                /* LEVEL */

                const level =
                    Number(
                        member.level || 0
                    );


                /* FIRST DEPOSIT */

                const deposit =
                    Number(
                        member.firstDepositAmount || 0
                    );


                /* STATUS */

                const status =
                    member.depositStatus ||
                    "Not yet deposited";


                /* COMMISSION */

                const rate =
                    getCommissionRate(
                        level
                    );


                const commission =
                    deposit * rate;


                /* STATUS CLASS */

                const isActive =
                    String(status)
                        .toLowerCase()
                    === "active";


                const statusClass =
                    isActive
                        ? "active"
                        : "pending";


                /* JOIN DATE */

                let joinedDate =
                    "Unknown";


                if (
                    member.joinedDate
                ) {

                    const date =
                        new Date(
                            member.joinedDate
                        );


                    if (
                        !isNaN(
                            date.getTime()
                        )
                    ) {

                        joinedDate =
                            date.toLocaleString();

                    }
                    else {

                        joinedDate =
                            member.joinedDate;

                    }

                }


                /* CARD */

                card.innerHTML = `

                    <div class="member-top">

                        <div>

                            <h3>
                                ${username}
                            </h3>

                            <p>
                                Team Member
                            </p>

                        </div>

                        <span
                            class="level-badge"
                        >
                            Level ${level}
                        </span>

                    </div>


                    <div class="member-info">

                        <p>

                            <i
                                class="fa-solid fa-circle-check"
                            ></i>

                            Status:

                            <span
                                class="
                                    deposit-badge
                                    ${statusClass}
                                "
                            >
                                ${status}
                            </span>

                        </p>


                        <p>

                            <i
                                class="
                                    fa-solid
                                    fa-money-bill-wave
                                "
                            ></i>

                            First Deposit:

                            <b>
                                ${money(deposit)}
                            </b>

                        </p>


                        <p>

                            <i
                                class="
                                    fa-solid
                                    fa-percent
                                "
                            ></i>

                            Commission:

                            <b>
                                ${money(commission)}
                            </b>

                        </p>


                        <p>

                            <i
                                class="
                                    fa-solid
                                    fa-calendar
                                ></i>

                            Joined:

                            <span>
                                ${joinedDate}
                            </span>

                        </p>

                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );

    }


    /* =================================
       LEVEL BUTTONS
    ================================= */

    function setupLevelButtons(user) {

        const levelOne =
            document.getElementById(
                "levelOneButton"
            );


        const levelTwo =
            document.getElementById(
                "levelTwoButton"
            );


        const levelThree =
            document.getElementById(
                "levelThreeButton"
            );


        const buttons = [
            levelOne,
            levelTwo,
            levelThree
        ];


        function activateButton(
            selectedButton
        ) {

            buttons.forEach(
                function(button) {

                    if (button) {

                        button.classList.remove(
                            "active"
                        );

                    }

                }
            );


            if (selectedButton) {

                selectedButton.classList.add(
                    "active"
                );

            }

        }


        if (levelOne) {

            levelOne.onclick =
                function() {

                    activateButton(
                        levelOne
                    );

                    displayMembers(
                        user,
                        1
                    );

                };

        }


        if (levelTwo) {

            levelTwo.onclick =
                function() {

                    activateButton(
                        levelTwo
                    );

                    displayMembers(
                        user,
                        2
                    );

                };

        }


        if (levelThree) {

            levelThree.onclick =
                function() {

                    activateButton(
                        levelThree
                    );

                    displayMembers(
                        user,
                        3
                    );

                };

        }

    }


    /* =================================
       START
    ================================= */

    async function start() {

        const user =
            await loadUser();


        if (!user) {

            return;

        }


        console.log(
            "CashNova My Team:",
            user
        );


        console.log(
            "MongoDB teamMembers:",
            user.teamMembers
        );


        updateSummary(
            user
        );


        setupLevelButtons(
            user
        );


        /* Level 1 opens first */

        displayMembers(
            user,
            1
        );

    }


    start();

});
