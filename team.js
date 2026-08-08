/* =================================
   CASHNOVA TEAM SYSTEM
   MONGODB / RENDER VERSION
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const API =
        "https://cashnova-backend-89lg.onrender.com/api/users";


    /* =================================
       GET CURRENT USER ID
    ================================= */

    function getUserId() {

        return localStorage.getItem("cashnovaUserId");

    }


    /* =================================
       LOAD USER FROM MONGODB
    ================================= */

    async function loadUser() {

        const userId = getUserId();

        if (!userId) {

            console.error(
                "cashnovaUserId was not found."
            );

            showLoadingError();

            return null;
        }


        try {

            const response =
                await fetch(API + "/" + userId);


            if (!response.ok) {

                throw new Error(
                    "Server returned " +
                    response.status
                );

            }


            const user =
                await response.json();


            /* Save latest data locally too */

            localStorage.setItem(
                "cashnovaUserData",
                JSON.stringify(user)
            );


            return user;


        } catch (error) {

            console.error(
                "CashNova Team loading error:",
                error
            );

            showLoadingError();

            return null;

        }

    }


    /* =================================
       ERROR DISPLAY
    ================================= */

    function showLoadingError() {

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
       CREATE REFERRAL LINK
    ================================= */

    function createReferralLink(code) {

        if (!code) {

            return "";

        }


        /*
         Use the current website address
         and attach the referral code.
        */

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


        const code =
            user.myReferralCode ||
            user.referralCode ||
            "";


        /* Referral Code */

        if (referralCode) {

            referralCode.textContent =
                code || "Not available";

        }


        /* Referral Link */

        if (referralLink) {

            referralLink.value =
                createReferralLink(code);

        }


        /* Referred By */

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
       LEVEL STATISTICS
    ================================= */

    function calculateLevel(
        members,
        level
    ) {

        const levelMembers =
            members.filter(function (member) {

                return Number(member.level) ===
                    Number(level);

            });


        let totalAmount = 0;


        levelMembers.forEach(
            function (member) {

                totalAmount +=
                    Number(
                        member.firstDepositAmount || 0
                    );

            }
        );


        return {

            count:
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


        /* Total Team */

        const totalTeam =
            document.getElementById(
                "totalTeam"
            );


        if (totalTeam) {

            totalTeam.textContent =
                members.length;

        }


        /* Referral Earnings */

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


        /* Level 1 */

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
                level1.count;

        }


        if (levelOneAmount) {

            levelOneAmount.textContent =
                money(level1.amount);

        }


        /* Level 2 */

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
                level2.count;

        }


        if (levelTwoAmount) {

            levelTwoAmount.textContent =
                money(level2.amount);

        }


        /* Level 3 */

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
                level3.count;

        }


        if (levelThreeAmount) {

            levelThreeAmount.textContent =
                money(level3.amount);

        }

    }


    /* =================================
       CREATE MY TEAM SECTION
    ================================= */

    function createTeamMembersSection() {

        let existing =
            document.getElementById(
                "dynamicTeamMembers"
            );


        if (existing) {

            return existing;

        }


        const section =
            document.createElement(
                "section"
            );


        section.id =
            "dynamicTeamMembers";


        section.style.marginTop =
            "20px";


        section.innerHTML = `

            <div class="my-team-container">

                <h2>
                    <i class="fa-solid fa-users"></i>
                    My Team Members
                </h2>

                <div
                    id="teamMembersList"
                ></div>

            </div>

        `;


        const buttonSection =
            document.querySelector(
                ".my-team-button-section"
            );


        if (buttonSection) {

            buttonSection.after(section);

        }
        else {

            document
                .querySelector(".team-page")
                .appendChild(section);

        }


        return section;

    }


    /* =================================
       DISPLAY TEAM MEMBERS
    ================================= */

    function displayTeamMembers(user) {

        const section =
            createTeamMembersSection();


        const list =
            section.querySelector(
                "#teamMembersList"
            );


        if (!list) {

            return;

        }


        const members =
            getTeamMembers(user);


        if (members.length === 0) {

            list.innerHTML = `

                <div class="empty-state">

                    <i
                        class="fa-solid fa-user-group"
                    ></i>

                    <p>
                        No team members yet.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML = "";


        members.forEach(
            function (member) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "member-card";


                const username =
                    member.username ||
                    "Team Member";


                const level =
                    Number(
                        member.level || 0
                    );


                const deposit =
                    Number(
                        member.firstDepositAmount || 0
                    );


                const status =
                    member.depositStatus ||
                    "Not yet deposited";


                let percentage = 0;


                if (level === 1) {

                    percentage = 0.20;

                }
                else if (level === 2) {

                    percentage = 0.03;

                }
                else if (level === 3) {

                    percentage = 0.01;

                }


                const commission =
                    deposit *
                    percentage;


                const statusClass =
                    String(status)
                        .toLowerCase() ===
                    "active"
                        ? "active"
                        : "pending";


                card.innerHTML = `

                    <div class="member-top">

                        <h3>
                            ${username}
                        </h3>

                        <span class="level-badge">
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
                                class="deposit-badge
                                ${statusClass}"
                            >
                                ${status}
                            </span>

                        </p>


                        <p>

                            <i
                                class="fa-solid fa-money-bill-wave"
                            ></i>

                            Deposit:

                            <b>
                                ${money(deposit)}
                            </b>

                        </p>


                        <p>

                            <i
                                class="fa-solid fa-percent"
                            ></i>

                            Commission:

                            <b>
                                ${money(commission)}
                            </b>

                        </p>


                        <p>

                            <i
                                class="fa-solid fa-calendar"
                            ></i>

                            Joined:

                            <span>
                                ${
                                    member.joinedDate ||
                                    "Unknown"
                                }
                            </span>

                        </p>

                    </div>

                `;


                list.appendChild(card);

            }
        );

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
                        '<i class="fa-solid fa-check"></i>';


                    setTimeout(
                        function () {

                            button.innerHTML =
                                '<i class="fa-solid fa-copy"></i>';

                        },
                        1500
                    );


                } catch (error) {

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

                }
                else {

                    try {

                        await navigator.clipboard
                            .writeText(link);


                        alert(
                            "Referral link copied!"
                        );

                    } catch (error) {

                        alert(
                            link
                        );

                    }

                }

            };

    }


    /* =================================
       MY TEAM BUTTON
    ================================= */

    function setupTeamButton(user) {

        const button =
            document.getElementById(
                "viewTeamButton"
            );


        if (!button) {

            return;

        }


        button.onclick =
            function () {

                const section =
                    document.getElementById(
                        "dynamicTeamMembers"
                    );


                if (!section) {

                    displayTeamMembers(
                        user
                    );

                    return;

                }


                if (
                    section.style.display ===
                    "none"
                ) {

                    section.style.display =
                        "block";

                    section.scrollIntoView({
                        behavior:"smooth"
                    });

                }
                else {

                    section.style.display =
                        "none";

                }

            };

    }


    /* =================================
       START TEAM PAGE
    ================================= */

    async function startTeamPage() {

        const user =
            await loadUser();


        if (!user) {

            return;

        }


        console.log(
            "CashNova Team user:",
            user
        );


        console.log(
            "CashNova Team members:",
            user.teamMembers
        );


        displayReferralInformation(
            user
        );


        displayStatistics(
            user
        );


        displayTeamMembers(
            user
        );


        setupCopyButton();


        setupShareButton();


        setupTeamButton(
            user
        );

    }


    startTeamPage();

});
