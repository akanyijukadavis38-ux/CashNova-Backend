/* =================================
   CASHNOVA MY TEAM SYSTEM
   MONGODB VERSION
================================= */

document.addEventListener("DOMContentLoaded", function(){

    // =================================
    // BACKEND URL
    // =================================

    const API_URL =
        "https://cashnova-backend-89lg.onrender.com/api/users";


    // =================================
    // GET CURRENT USER FROM MONGODB
    // =================================

    async function getCurrentUserData(){

        const userId =
            localStorage.getItem("cashnovaUserId");

        if(!userId){

            console.log("CashNova user ID not found");

            return null;
        }


        try{

            const response =
                await fetch(
                    API_URL + "/" + userId
                );


            if(!response.ok){

                console.log(
                    "Failed to load user:",
                    response.status
                );

                return null;
            }


            const user =
                await response.json();


            // Keep latest user data locally too
            localStorage.setItem(
                "cashnovaUserData",
                JSON.stringify(user)
            );


            return user;


        }catch(error){

            console.log(
                "Team user loading error:",
                error
            );

            return null;
        }

    }



    // =================================
    // SHOW MEMBERS
    // =================================

    async function showMembers(level){

        const user =
            await getCurrentUserData();


        if(!user){

            const container =
                document.getElementById(
                    "membersContainer"
                );


            if(container){

                container.innerHTML = `
                    <div class="empty-state">

                        <i class="fa-solid fa-user-group"></i>

                        <p>
                            Unable to load team members
                        </p>

                    </div>
                `;

            }

            return;
        }


        // =================================
        // GET ALL TEAM MEMBERS
        // =================================

        const allMembers =
            Array.isArray(user.teamMembers)
            ?
            user.teamMembers
            :
            [];


        // =================================
        // FILTER BY LEVEL
        // =================================

        let members =
            allMembers.filter(function(member){

                return Number(member.level) ===
                       Number(level);

            });


        // =================================
        // TOTAL MEMBERS
        // =================================

        const totalMembers =
            document.getElementById(
                "totalMembers"
            );


        if(totalMembers){

            totalMembers.innerHTML =
                allMembers.length;

        }


        // =================================
        // ACTIVE MEMBERS
        // =================================

        const activeMembers =
            document.getElementById(
                "activeMembers"
            );


        if(activeMembers){

            const active =
                allMembers.filter(
                    function(member){

                        return (
                            member.depositStatus ===
                            "Active"
                        );

                    }
                );


            activeMembers.innerHTML =
                active.length;

        }


        // =================================
        // REFERRAL EARNINGS
        // =================================

        const referralEarnings =
            document.getElementById(
                "referralEarnings"
            );


        if(referralEarnings){

            referralEarnings.innerHTML =
                "UGX " +
                Number(
                    user.referralIncome || 0
                ).toLocaleString();

        }


        // =================================
        // TOTAL TEAM DEPOSITS
        // =================================

        const teamDeposits =
            document.getElementById(
                "teamDeposits"
            );


        if(teamDeposits){

            let totalDeposits = 0;


            allMembers.forEach(
                function(member){

                    totalDeposits +=
                        Number(
                            member.firstDepositAmount ||
                            0
                        );

                }
            );


            teamDeposits.innerHTML =
                "UGX " +
                totalDeposits.toLocaleString();

        }


        // =================================
        // MEMBERS CONTAINER
        // =================================

        const container =
            document.getElementById(
                "membersContainer"
            );


        if(!container){

            return;
        }


        // =================================
        // NO MEMBERS
        // =================================

        if(members.length === 0){

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


        // =================================
        // CLEAR OLD MEMBERS
        // =================================

        container.innerHTML = "";


        // =================================
        // DISPLAY MEMBERS
        // =================================

        members.forEach(
            function(member){

                const card =
                    document.createElement("div");


                card.className =
                    "member-card";


                // =================================
                // HIDE USERNAME
                // =================================

                let hiddenAccount =
                    "****";


                if(member.username){

                    const username =
                        String(
                            member.username
                        );


                    if(username.length > 4){

                        hiddenAccount =
                            "****" +
                            username.slice(-4);

                    }else{

                        hiddenAccount =
                            "****";

                    }

                }


                // =================================
                // MEMBER DEPOSIT
                // =================================

                const depositAmount =
                    Number(
                        member.firstDepositAmount ||
                        0
                    );


                // =================================
                // COMMISSION PERCENTAGE
                // =================================

                let percentage = 0;


                if(Number(member.level) === 1){

                    percentage = 0.20;

                }

                else if(
                    Number(member.level) === 2
                ){

                    percentage = 0.03;

                }

                else if(
                    Number(member.level) === 3
                ){

                    percentage = 0.01;

                }


                // =================================
                // COMMISSION
                // =================================

                const commission =
                    depositAmount *
                    percentage;


                // =================================
                // JOINED DATE
                // =================================

                let joinedDate =
                    "Unknown";


                if(member.joinedDate){

                    const date =
                        new Date(
                            member.joinedDate
                        );


                    if(!isNaN(date.getTime())){

                        joinedDate =
                            date.toLocaleDateString();

                    }

                }


                // =================================
                // MEMBER CARD
                // =================================

                card.innerHTML = `

                    <div class="member-top">

                        <h3>
                            ${hiddenAccount}
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

                                ${
                                    member.depositStatus ||
                                    "Not yet deposited"
                                }

                            </span>

                        </p>


                        <p>

                            <i class="fa-solid fa-money-bill-wave"></i>

                            Deposit:

                            <b>
                                UGX ${depositAmount.toLocaleString()}
                            </b>

                        </p>


                        <p>

                            <i class="fa-solid fa-percent"></i>

                            Commission:

                            <b>
                                UGX ${commission.toLocaleString()}
                            </b>

                        </p>


                        <p>

                            <i class="fa-solid fa-calendar"></i>

                            Joined:

                            ${joinedDate}

                        </p>

                    </div>

                `;


                container.appendChild(card);

            }
        );

    }



    // =================================
    // ACTIVE BUTTON
    // =================================

    function setActiveButton(button){

        document
            .querySelectorAll(
                ".level-buttons button"
            )
            .forEach(
                function(btn){

                    btn.classList.remove(
                        "active"
                    );

                }
            );


        button.classList.add("active");

    }



    // =================================
    // LEVEL BUTTONS
    // =================================

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



    if(levelOneButton){

        levelOneButton.onclick =
            function(){

                setActiveButton(
                    levelOneButton
                );

                showMembers(1);

            };

    }



    if(levelTwoButton){

        levelTwoButton.onclick =
            function(){

                setActiveButton(
                    levelTwoButton
                );

                showMembers(2);

            };

    }



    if(levelThreeButton){

        levelThreeButton.onclick =
            function(){

                setActiveButton(
                    levelThreeButton
                );

                showMembers(3);

            };

    }



    // =================================
    // LOAD LEVEL 1 BY DEFAULT
    // =================================

    showMembers(1);

});
