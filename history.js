/* =================================
   CASHNOVA TRANSACTION HISTORY
   MONGODB MASTER HISTORY SYSTEM
   UGANDA / KAMPALA TIME
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


    // =================================
    // UGANDA DATE & TIME
    // =================================

    function formatUgandaDate(date) {

        if (!date) {
            return "";
        }


        const parsedDate =
            new Date(date);


        if (isNaN(parsedDate.getTime())) {
            return String(date);
        }


        return parsedDate.toLocaleString(
            "en-UG",
            {
                timeZone: "Africa/Kampala",

                day: "numeric",

                month: "short",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit",

                second: "2-digit",

                hour12: false
            }
        );

    }



    // =================================
    // LOAD MASTER HISTORY
    // =================================

    let history = [];


    try {

        const response =
            await fetch(
                "https://cashnova-backend-production-2404.up.railway.app/api/users/history/" +
                userId
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load transaction history"
            );

        }


        const result =
            await response.json();


        history =
            Array.isArray(result.history)
                ? result.history
                : [];


    } catch (error) {

        console.log(
            "History loading error:",
            error
        );


        container.innerHTML =
            "<p class='empty-history'>Failed to load history</p>";

        return;
    }



    // =================================
    // REMOVE LOCKED BONUS
    // =================================

    history =
        history.filter(function (record) {

            return !(
                String(record.type || "")
                    .toLowerCase()
                    .includes("registration bonus")
                &&
                String(record.status || "")
                    .toLowerCase()
                    === "locked"
            );

        });



    // =================================
    // SORT NEWEST FIRST
    // =================================

    history.sort(function (a, b) {

        return (
            new Date(b.date || 0) -
            new Date(a.date || 0)
        );

    });



    // =================================
    // DISPLAY HISTORY
    // =================================

    function displayHistory(records) {

        container.innerHTML = "";


        if (
            !records ||
            records.length === 0
        ) {

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
            // TYPE
            // =================================

            const recordType =
                String(
                    record.type ||
                    "Transaction"
                );


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
            // STATUS
            // =================================

            const status =
                String(
                    record.status ||
                    "Pending"
                );


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

            else if (
                status === "Rejected"
            ) {

                statusClass =
                    "status-rejected";

            }



            // =================================
            // AMOUNT
            // =================================

            const amount =
                Number(
                    record.amount || 0
                );



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


            if (
                record.mobileMoneyTransactionId
            ) {

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
            // PAYMENT METHOD
            // =================================

            let methodHTML = "";


            if (
                record.method &&
                type.includes("deposit")
            ) {

                methodHTML = `

                    <p>
                        Method:
                        <b>
                            ${record.method}
                        </b>
                    </p>

                `;

            }



            // =================================
            // WITHDRAWAL DETAILS
            // =================================

            let withdrawalDetailsHTML =
                "";


            if (
                type.includes("withdraw")
            ) {


                if (
                    record.fee !== undefined
                ) {

                    withdrawalDetailsHTML += `

                        <p>
                            Fee:
                            <b>
                                UGX ${
                                    Number(
                                        record.fee || 0
                                    ).toLocaleString()
                                }
                            </b>
                        </p>

                    `;

                }


                if (
                    record.receiveAmount !==
                    undefined
                ) {

                    withdrawalDetailsHTML += `

                        <p>
                            Receive:
                            <b>
                                UGX ${
                                    Number(
                                        record.receiveAmount || 0
                                    ).toLocaleString()
                                }
                            </b>
                        </p>

                    `;

                }

            }



            // =================================
            // DATE
            // =================================

            const displayDate =
                formatUgandaDate(
                    record.date
                );



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
                            ${recordType}
                        </h4>


                        <p>
                            ${displayDate}
                        </p>


                        ${productHTML}


                        ${transactionIdHTML}


                        ${methodHTML}


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

    displayHistory(history);



    // =================================
    // FILTER BUTTONS
    // =================================

    const filterButtons =
        document.querySelectorAll(
            ".history-filters button"
        );


    filterButtons.forEach(
        function (button) {

            button.onclick =
                function () {


                    // REMOVE ACTIVE
                    filterButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    // SET ACTIVE
                    button.classList.add(
                        "active"
                    );


                    const selected =
                        button.innerText.trim();


                    let filtered =
                        history;



                    // =================================
                    // DEPOSITS
                    // =================================

                    if (
                        selected ===
                        "Deposits"
                    ) {

                        filtered =
                            history.filter(
                                function (record) {

                                    return String(
                                        record.type || ""
                                    )
                                    .toLowerCase()
                                    .includes(
                                        "deposit"
                                    );

                                }
                            );

                    }



                    // =================================
                    // WITHDRAWALS
                    // =================================

                    else if (
                        selected ===
                        "Withdrawals"
                    ) {

                        filtered =
                            history.filter(
                                function (record) {

                                    return String(
                                        record.type || ""
                                    )
                                    .toLowerCase()
                                    .includes(
                                        "withdraw"
                                    );

                                }
                            );

                    }



                    // =================================
                    // DAILY INCOME
                    // =================================

                    else if (
                        selected ===
                        "Daily Income"
                    ) {

                        filtered =
                            history.filter(
                                function (record) {

                                    const type =
                                        String(
                                            record.type || ""
                                        )
                                        .toLowerCase();


                                    return (
                                        type.includes(
                                            "daily"
                                        ) ||
                                        type.includes(
                                            "income"
                                        ) ||
                                        type.includes(
                                            "profit"
                                        )
                                    );

                                }
                            );

                    }



                    // =================================
                    // BONUS
                    // =================================

                    else if (
                        selected ===
                        "Bonus"
                    ) {

                        filtered =
                            history.filter(
                                function (record) {

                                    return String(
                                        record.type || ""
                                    )
                                    .toLowerCase()
                                    .includes(
                                        "bonus"
                                    );

                                }
                            );

                    }



                    // =================================
                    // REFERRAL
                    // =================================

                    else if (
                        selected ===
                        "Referral"
                    ) {

                        filtered =
                            history.filter(
                                function (record) {

                                    return String(
                                        record.type || ""
                                    )
                                    .toLowerCase()
                                    .includes(
                                        "referral"
                                    );

                                }
                            );

                    }



                    // =================================
                    // DISPLAY
                    // =================================

                    displayHistory(
                        filtered
                    );

                };

        }
    );

});
