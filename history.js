/* =================================
   CASHNOVA TRANSACTION HISTORY
   SINGLE-RECORD DISPLAY SYSTEM
================================= */

document.addEventListener("DOMContentLoaded", async function () {

    const container =
        document.getElementById("historyContainer");

    const userId =
        localStorage.getItem("cashnovaUserId");


    if (!container) {
        return;
    }


    if (!userId) {

        container.innerHTML =
            "<p class='empty-history'>User not found</p>";

        return;
    }


    let user;


    // =================================
    // LOAD USER
    // =================================

    try {

        const response = await fetch(
            "https://cashnova-backend-89lg.onrender.com/api/users/" +
            userId
        );


        if (!response.ok) {
            throw new Error("Failed to load user");
        }


        user = await response.json();


    } catch (error) {

        console.log(error);


        container.innerHTML =
            "<p class='empty-history'>Failed to load history</p>";

        return;
    }


    if (!user || user.message) {

        container.innerHTML =
            "<p class='empty-history'>User not found</p>";

        return;
    }



    // =================================
    // CREATE ONE MASTER RECORD LIST
    // =================================

    /*
       transactionHistory is treated as the
       main history source.

       depositRecords and withdrawalRecords
       are only used when a transaction does
       NOT already exist in transactionHistory.
    */


    let allRecords = [];


    // ---------------------------------
    // MAIN TRANSACTION HISTORY
    // ---------------------------------

    if (Array.isArray(user.transactionHistory)) {

        user.transactionHistory.forEach(function (record) {

            allRecords.push({
                ...record,
                _source: "transactionHistory"
            });

        });

    }



    // =================================
    // ADD MISSING DEPOSIT RECORDS ONLY
    // =================================

    if (Array.isArray(user.depositRecords)) {

        user.depositRecords.forEach(function (deposit) {


            /*
               Try to identify whether this deposit
               already exists in transactionHistory.
            */

            const alreadyExists =
                allRecords.some(function (record) {

                    // Same deposit ID
                    if (
                        record.depositId &&
                        deposit.depositId &&
                        String(record.depositId) ===
                        String(deposit.depositId)
                    ) {
                        return true;
                    }


                    // Same mobile money transaction ID
                    if (
                        record.mobileMoneyTransactionId &&
                        deposit.mobileMoneyTransactionId &&
                        record.mobileMoneyTransactionId ===
                        deposit.mobileMoneyTransactionId
                    ) {
                        return true;
                    }


                    return false;

                });



            /*
               Only add it if it is genuinely
               missing from transactionHistory.
            */

            if (!alreadyExists) {

                allRecords.push({
                    ...deposit,
                    type: "Deposit",
                    _source: "depositRecords"
                });

            }

        });

    }



    // =================================
    // ADD MISSING WITHDRAWAL RECORDS ONLY
    // =================================

    if (Array.isArray(user.withdrawalRecords)) {

        user.withdrawalRecords.forEach(function (withdrawal) {


            const alreadyExists =
                allRecords.some(function (record) {


                    /*
                       Withdrawal ID is the strongest
                       way to identify the same transaction.
                    */

                    if (
                        record.withdrawalId &&
                        withdrawal.withdrawalId &&
                        String(record.withdrawalId) ===
                        String(withdrawal.withdrawalId)
                    ) {

                        return true;

                    }


                    return false;

                });



            if (!alreadyExists) {

                allRecords.push({
                    ...withdrawal,
                    type: "Withdrawal",
                    _source: "withdrawalRecords"
                });

            }

        });

    }



    // =================================
    // REMOVE LOCKED REGISTRATION BONUS
    // =================================

    allRecords =
        allRecords.filter(function (record) {

            if (
                record.type === "Registration Bonus" &&
                record.status === "Locked"
            ) {

                return false;

            }

            return true;

        });



    // =================================
    // SORT NEWEST FIRST
    // =================================

    allRecords.sort(function (a, b) {

        const dateA =
            new Date(a.date || a.createdAt || 0);

        const dateB =
            new Date(b.date || b.createdAt || 0);


        return dateB - dateA;

    });



    // =================================
    // NO RECORDS
    // =================================

    if (allRecords.length === 0) {

        container.innerHTML =
            "<p class='empty-history'>No transaction history available</p>";

        return;

    }



    // =================================
    // DISPLAY HISTORY
    // =================================

    function displayHistory(records) {


        container.innerHTML = "";


        if (!records || records.length === 0) {

            container.innerHTML =
                "<p class='empty-history'>No records found</p>";

            return;

        }



        records.forEach(function (record) {


            const card =
                document.createElement("div");


            card.className =
                "history-card";



            // =================================
            // TRANSACTION TYPE
            // =================================

            const recordType =
                String(record.type || "Transaction");


            const type =
                recordType.toLowerCase();



            // =================================
            // ICON
            // =================================

            let icon =
                "fa-money-bill-transfer";


            if (type.includes("deposit")) {

                icon =
                    "fa-arrow-down";

            }


            else if (type.includes("withdraw")) {

                icon =
                    "fa-arrow-up";

            }


            else if (type.includes("bonus")) {

                icon =
                    "fa-gift";

            }


            else if (
                type.includes("daily") ||
                type.includes("income") ||
                type.includes("profit")
            ) {

                icon =
                    "fa-chart-line";

            }


            else if (type.includes("referral")) {

                icon =
                    "fa-users";

            }


            else if (type.includes("purchase")) {

                icon =
                    "fa-box";

            }



            // =================================
            // STATUS CLASS
            // =================================

            let status =
                String(record.status || "Pending");


            let statusClass =
                "status-pending";


            if (
                status === "Approved" ||
                status === "Credited" ||
                status === "Completed"
            ) {

                statusClass =
                    "status-approved";

            }


            else if (status === "Rejected") {

                statusClass =
                    "status-rejected";

            }



            // =================================
            // DATE
            // =================================

            let displayDate =
                record.date || "";


            /*
               Existing records may contain dates
               saved using toLocaleString().

               We display them as stored so we
               don't accidentally change historical
               timestamps.
            */



            // =================================
            // AMOUNT
            // =================================

            const amount =
                Number(record.amount || 0);



            // =================================
            // PRODUCT
            // =================================

            let productHTML = "";


            if (record.product) {

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
            // TRANSACTION ID
            // =================================

            let transactionIdHTML = "";


            if (record.mobileMoneyTransactionId) {

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
            // WITHDRAWAL DETAILS
            // =================================

            let withdrawalDetailsHTML = "";


            if (type.includes("withdraw")) {

                if (record.fee !== undefined) {

                    withdrawalDetailsHTML += `

                        <p>
                            Fee:
                            <b>
                                UGX ${Number(
                                    record.fee || 0
                                ).toLocaleString()}
                            </b>
                        </p>

                    `;

                }


                if (record.receiveAmount !== undefined) {

                    withdrawalDetailsHTML += `

                        <p>
                            Receive:
                            <b>
                                UGX ${Number(
                                    record.receiveAmount || 0
                                ).toLocaleString()}
                            </b>
                        </p>

                    `;

                }

            }



            // =================================
            // CARD HTML
            // =================================

            card.innerHTML = `

                <div class="history-left">


                    <div class="history-icon">

                        <i class="fa-solid ${icon}"></i>

                    </div>



                    <div class="history-details">


                        <h4>
                            ${recordType}
                        </h4>


                        <p>
                            ${displayDate}
                        </p>


                        ${productHTML}


                        ${transactionIdHTML}


                        ${withdrawalDetailsHTML}


                    </div>


                </div>



                <div class="history-right">


                    <div class="history-amount">

                        UGX ${amount.toLocaleString()}

                    </div>


                    <span
                        class="history-status ${statusClass}"
                    >

                        ${status}

                    </span>


                </div>

            `;



            container.appendChild(card);

        });

    }



    // =================================
    // SHOW ALL
    // =================================

    displayHistory(allRecords);



    // =================================
    // FILTER BUTTONS
    // =================================

    const filterButtons =
        document.querySelectorAll(
            ".history-filters button"
        );


    filterButtons.forEach(function (button) {


        button.onclick =
            function () {


                // Remove active
                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                // Activate selected
                button.classList.add("active");



                const selected =
                    button.innerText.trim();



                let filtered =
                    allRecords;



                // =================================
                // DEPOSITS
                // =================================

                if (selected === "Deposits") {

                    filtered =
                        allRecords.filter(
                            function (record) {

                                return String(
                                    record.type || ""
                                )
                                .toLowerCase()
                                .includes("deposit");

                            }
                        );

                }



                // =================================
                // WITHDRAWALS
                // =================================

                else if (
                    selected === "Withdrawals"
                ) {

                    filtered =
                        allRecords.filter(
                            function (record) {

                                return String(
                                    record.type || ""
                                )
                                .toLowerCase()
                                .includes("withdraw");

                            }
                        );

                }



                // =================================
                // DAILY INCOME
                // =================================

                else if (
                    selected === "Daily Income"
                ) {

                    filtered =
                        allRecords.filter(
                            function (record) {

                                const type =
                                    String(
                                        record.type || ""
                                    ).toLowerCase();


                                return (
                                    type.includes("daily") ||
                                    type.includes("income") ||
                                    type.includes("profit")
                                );

                            }
                        );

                }



                // =================================
                // BONUS
                // =================================

                else if (
                    selected === "Bonus"
                ) {

                    filtered =
                        allRecords.filter(
                            function (record) {

                                return String(
                                    record.type || ""
                                )
                                .toLowerCase()
                                .includes("bonus");

                            }
                        );

                }



                // =================================
                // REFERRAL
                // =================================

                else if (
                    selected === "Referral"
                ) {

                    filtered =
                        allRecords.filter(
                            function (record) {

                                return String(
                                    record.type || ""
                                )
                                .toLowerCase()
                                .includes("referral");

                            }
                        );

                }



                // =================================
                // DISPLAY FILTERED
                // =================================

                displayHistory(filtered);

            };

    });

});
