/* =================================
   CASHNOVA TRANSACTION HISTORY
   MONGODB VERSION
================================= */

document.addEventListener("DOMContentLoaded", async function(){

    const container =
        document.getElementById("historyContainer");

    const userId =
        localStorage.getItem("cashnovaUserId");


    // =================================
    // CHECK USER
    // =================================

    if(!container){
        return;
    }

    if(!userId){

        container.innerHTML =
            "<p class='empty-history'>User not found</p>";

        return;
    }


    // =================================
    // LOAD USER FROM MONGODB
    // =================================

    let user;

    try{

        const response = await fetch(
            "https://cashnova-backend-89lg.onrender.com/api/users/" +
            userId
        );


        if(!response.ok){

            throw new Error("Failed to load user");

        }


        user = await response.json();


    }catch(error){

        console.log("History loading error:", error);

        container.innerHTML =
            "<p class='empty-history'>Failed to load history</p>";

        return;

    }


    if(!user || user.message){

        container.innerHTML =
            "<p class='empty-history'>User not found</p>";

        return;

    }


    // =================================
    // COLLECT ALL RECORDS
    // =================================

    let allRecords = [];


    // TRANSACTION HISTORY

    if(Array.isArray(user.transactionHistory)){

        user.transactionHistory.forEach(function(record){

            allRecords.push({
                ...record,
                source:"transactionHistory"
            });

        });

    }


    // DEPOSIT RECORDS

    if(Array.isArray(user.depositRecords)){

        user.depositRecords.forEach(function(record){

            allRecords.push({
                ...record,
                type: record.type || "Deposit",
                source:"depositRecords"
            });

        });

    }


    // WITHDRAWAL RECORDS

    if(Array.isArray(user.withdrawalRecords)){

        user.withdrawalRecords.forEach(function(record){

            allRecords.push({
                ...record,
                type: record.type || "Withdrawal",
                source:"withdrawalRecords"
            });

        });

    }


    // INCOME RECORDS

    if(Array.isArray(user.incomeRecords)){

        user.incomeRecords.forEach(function(record){

            allRecords.push({
                ...record,
                source:"incomeRecords"
            });

        });

    }


    // =================================
    // REMOVE ONLY LOCKED REGISTRATION BONUS
    // =================================

    allRecords =
        allRecords.filter(function(record){

            return !(
                record.type === "Registration Bonus" &&
                record.status === "Locked"
            );

        });


    // =================================
    // SORT NEWEST FIRST
    // =================================

    allRecords.sort(function(a,b){

        const dateA =
            new Date(a.date).getTime() || 0;

        const dateB =
            new Date(b.date).getTime() || 0;


        return dateB - dateA;

    });


    // =================================
    // UGANDA DATE & TIME
    // =================================

    function formatUgandaDate(date){

        if(!date){
            return "Date unavailable";
        }


        const parsedDate =
            new Date(date);


        if(isNaN(parsedDate.getTime())){

            return String(date);

        }


        return parsedDate.toLocaleString(
            "en-UG",
            {
                timeZone:"Africa/Kampala",

                year:"numeric",

                month:"short",

                day:"numeric",

                hour:"2-digit",

                minute:"2-digit",

                second:"2-digit",

                hour12:false
            }
        );

    }


    // =================================
    // GET RECORD TYPE
    // =================================

    function getRecordType(record){

        return String(
            record.type || "Transaction"
        );

    }


    // =================================
    // GET ICON
    // =================================

    function getIcon(type){

        const lowerType =
            type.toLowerCase();


        if(lowerType.includes("deposit")){
            return "fa-arrow-down";
        }


        if(lowerType.includes("withdraw")){
            return "fa-arrow-up";
        }


        if(lowerType.includes("bonus")){
            return "fa-gift";
        }


        if(
            lowerType.includes("daily") ||
            lowerType.includes("income") ||
            lowerType.includes("profit")
        ){

            return "fa-chart-line";

        }


        if(lowerType.includes("referral")){

            return "fa-users";

        }


        if(lowerType.includes("purchase")){

            return "fa-box-open";

        }


        return "fa-money-bill-transfer";

    }


    // =================================
    // GET STATUS CLASS
    // =================================

    function getStatusClass(status){

        const currentStatus =
            String(status || "").toLowerCase();


        if(
            currentStatus === "approved" ||
            currentStatus === "credited" ||
            currentStatus === "completed"
        ){

            return "status-approved";

        }


        if(currentStatus === "rejected"){

            return "status-rejected";

        }


        return "status-pending";

    }


    // =================================
    // DISPLAY HISTORY
    // =================================

    function displayHistory(records){

        container.innerHTML = "";


        if(!records || records.length === 0){

            container.innerHTML =
                "<p class='empty-history'>No transaction history available</p>";

            return;

        }


        records.forEach(function(record){

            const card =
                document.createElement("div");


            card.className =
                "history-card";


            const type =
                getRecordType(record);


            const icon =
                getIcon(type);


            const status =
                record.status || "Pending";


            const statusClass =
                getStatusClass(status);


            const amount =
                Number(record.amount || 0);


            const formattedAmount =
                amount.toLocaleString("en-UG");


            const formattedDate =
                formatUgandaDate(record.date);


            // =================================
            // TRANSACTION ID
            // =================================

            let transactionIdHTML = "";


            if(record.mobileMoneyTransactionId){

                transactionIdHTML = `

                    <p>
                        Transaction ID:
                        <b>
                            ${record.mobileMoneyTransactionId}
                        </b>
                    </p>

                `;

            }


            // =================================
            // PRODUCT NAME
            // =================================

            let productHTML = "";


            if(record.product){

                productHTML = `

                    <p>
                        Product:
                        <b>
                            ${record.product}
                        </b>
                    </p>

                `;

            }


            // =================================
            // CARD
            // =================================

            card.innerHTML = `

                <div class="history-left">

                    <div class="history-icon">

                        <i class="fa-solid ${icon}"></i>

                    </div>


                    <div class="history-details">

                        <h4>
                            ${type}
                        </h4>


                        <p>
                            ${formattedDate}
                        </p>

                        ${productHTML}

                        ${transactionIdHTML}

                    </div>


                    <div class="history-right">

                        <div class="history-amount">

                            UGX ${formattedAmount}

                        </div>


                        <span class="history-status ${statusClass}">

                            ${status}

                        </span>

                    </div>

                </div>

            `;


            container.appendChild(card);

        });

    }


    // =================================
    // SHOW ALL HISTORY
    // =================================

    displayHistory(allRecords);


    // =================================
    // FILTER BUTTONS
    // =================================

    const filterButtons =
        document.querySelectorAll(
            ".history-filters button"
        );


    filterButtons.forEach(function(button){

        button.onclick = function(){

            filterButtons.forEach(function(btn){

                btn.classList.remove("active");

            });


            button.classList.add("active");


            const selected =
                button.innerText.trim();


            let filtered =
                allRecords;


            // =================================
            // ALL
            // =================================

            if(selected === "All"){

                filtered =
                    allRecords;

            }


            // =================================
            // DEPOSITS
            // =================================

            else if(selected === "Deposits"){

                filtered =
                    allRecords.filter(function(record){

                        return getRecordType(record)
                            .toLowerCase()
                            .includes("deposit");

                    });

            }


            // =================================
            // WITHDRAWALS
            // =================================

            else if(selected === "Withdrawals"){

                filtered =
                    allRecords.filter(function(record){

                        return getRecordType(record)
                            .toLowerCase()
                            .includes("withdraw");

                    });

            }


            // =================================
            // DAILY INCOME
            // =================================

            else if(selected === "Daily Income"){

                filtered =
                    allRecords.filter(function(record){

                        const type =
                            getRecordType(record)
                                .toLowerCase();


                        return (
                            type.includes("daily") ||
                            type.includes("income") ||
                            type.includes("profit")
                        );

                    });

            }


            // =================================
            // BONUS
            // =================================

            else if(selected === "Bonus"){

                filtered =
                    allRecords.filter(function(record){

                        return getRecordType(record)
                            .toLowerCase()
                            .includes("bonus");

                    });

            }


            // =================================
            // REFERRAL
            // =================================

            else if(selected === "Referral"){

                filtered =
                    allRecords.filter(function(record){

                        return getRecordType(record)
                            .toLowerCase()
                            .includes("referral");

                    });

            }


            displayHistory(filtered);

        };

    });


});
