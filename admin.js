document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // CASHNOVA ADMIN DASHBOARD
    // =====================================

    const API =
        "https://cashnova-backend-89lg.onrender.com";


    // =====================================
    // ADMIN TOKEN
    // =====================================

    const adminToken =
        localStorage.getItem("cashnovaAdminToken");


    if (!adminToken) {

        window.location.href =
            "admin-login.html";

        return;

    }


    // =====================================
    // ADMIN FETCH
    // =====================================

    async function adminFetch(url, options = {}) {

        options.headers = {

            ...(options.headers || {}),

            "Authorization":
                "Bearer " + adminToken,

            "Content-Type":
                "application/json"

        };


        const response =
            await fetch(url, options);


        // ---------------------------------
        // SESSION EXPIRED
        // ---------------------------------

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "cashnovaAdminToken"
            );

            localStorage.removeItem(
                "cashnovaAdminSession"
            );

            window.location.href =
                "admin-login.html";

            return null;

        }


        return response;

    }


    // =====================================
    // FORMAT MONEY
    // =====================================

    function formatMoney(amount) {

        return (
            "UGX " +
            Number(amount || 0).toLocaleString(
                "en-UG"
            )
        );

    }


    // =====================================
    // SAFE NUMBER
    // =====================================

    function number(value) {

        const result =
            Number(value);

        return Number.isFinite(result)
            ? result
            : 0;

    }


    // =====================================
    // LOGOUT
    // =====================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.onclick =
            function () {

                localStorage.removeItem(
                    "cashnovaAdminToken"
                );

                localStorage.removeItem(
                    "cashnovaAdminSession"
                );

                window.location.href =
                    "admin-login.html";

            };

    }


    // =====================================
    // LOAD DASHBOARD
    // =====================================

    loadDashboard();


    async function loadDashboard() {

        try {

            // ---------------------------------
            // LOAD USERS
            // ---------------------------------

            const usersResponse =
                await adminFetch(
                    API +
                    "/api/admin/users"
                );


            if (!usersResponse) {

                return;

            }


            if (!usersResponse.ok) {

                throw new Error(
                    "Failed to load users"
                );

            }


            const users =
                await usersResponse.json();


            // ---------------------------------
            // LOAD ACTIVE USERS
            // ---------------------------------

            const activeResponse =
                await adminFetch(
                    API +
                    "/api/admin/active-users"
                );


            if (!activeResponse) {

                return;

            }


            if (!activeResponse.ok) {

                throw new Error(
                    "Failed to load active users"
                );

            }


            const activeUsers =
                await activeResponse.json();


            // ---------------------------------
            // LOAD DEPOSITS
            // ---------------------------------

            const depositsResponse =
                await adminFetch(
                    API +
                    "/api/deposits"
                );


            if (!depositsResponse) {

                return;

            }


            if (!depositsResponse.ok) {

                throw new Error(
                    "Failed to load deposits"
                );

            }


            const deposits =
                await depositsResponse.json();


            // ---------------------------------
            // LOAD WITHDRAWALS
            // ---------------------------------

            const withdrawalsResponse =
                await adminFetch(
                    API +
                    "/api/withdrawals"
                );


            if (!withdrawalsResponse) {

                return;

            }


            if (!withdrawalsResponse.ok) {

                throw new Error(
                    "Failed to load withdrawals"
                );

            }


            const withdrawals =
                await withdrawalsResponse.json();


            // ---------------------------------
            // CALCULATE DASHBOARD
            // ---------------------------------

            calculateDashboard(
                users,
                activeUsers,
                deposits,
                withdrawals
            );


        } catch (error) {

            console.log(
                "ADMIN DASHBOARD ERROR:",
                error
            );

        }

    }


    // =====================================
    // CALCULATE DASHBOARD DATA
    // =====================================

    function calculateDashboard(
        users,
        activeUsers,
        deposits,
        withdrawals
    ) {


        users =
            Array.isArray(users)
                ? users
                : [];


        activeUsers =
            Array.isArray(activeUsers)
                ? activeUsers
                : [];


        deposits =
            Array.isArray(deposits)
                ? deposits
                : [];


        withdrawals =
            Array.isArray(withdrawals)
                ? withdrawals
                : [];


        // =================================
        // TOTAL USERS
        // =================================

        const totalUsers =
            users.length;


        // =================================
        // ACTIVE USERS
        // =================================

        const totalActiveUsers =
            activeUsers.length;


        // =================================
        // TOTAL DEPOSITS
        // ONLY CREDITED DEPOSITS
        // =================================

        let totalDeposits = 0;


        deposits.forEach(
            function (deposit) {

                if (
                    deposit.status ===
                    "Credited"
                ) {

                    totalDeposits +=
                        number(
                            deposit.amount
                        );

                }

            }
        );


        // =================================
        // PENDING DEPOSITS
        // =================================

        const pendingDeposits =
            deposits.filter(
                function (deposit) {

                    return (
                        deposit.status ===
                        "Pending"
                    );

                }
            ).length;


        // =================================
        // TOTAL WITHDRAWALS
        // APPROVED ONLY
        // =================================

        let totalWithdrawals = 0;


        withdrawals.forEach(
            function (withdrawal) {

                if (
                    withdrawal.status ===
                    "Approved"
                ) {

                    totalWithdrawals +=
                        number(
                            withdrawal.amount
                        );

                }

            }
        );


        // =================================
        // PENDING WITHDRAWALS
        // =================================

        const pendingWithdrawals =
            withdrawals.filter(
                function (withdrawal) {

                    return (
                        withdrawal.status ===
                        "Pending"
                    );

                }
            ).length;


        // =================================
        // TOTAL INCOME PAID
        // =================================

        let totalIncomePaid = 0;


        users.forEach(
            function (user) {

                if (
                    Array.isArray(
                        user.incomeRecords
                    )
                ) {

                    user.incomeRecords.forEach(
                        function (record) {

                            if (
                                record.status ===
                                "Completed"
                            ) {

                                totalIncomePaid +=
                                    number(
                                        record.amount
                                    );

                            }

                        }
                    );

                }

            }
        );

// =================================
// TOTAL INVESTMENTS
// SUM ALL PURCHASED PRODUCTS
// =================================

let totalInvestments = 0;

users.forEach(function (user) {

    if (
        Array.isArray(
            user.purchasedProducts
        )
    ) {

        user.purchasedProducts.forEach(
            function (product) {

                totalInvestments +=
                    number(
                        product.price
                    );

            }
        );

    }

});
        


        // =================================
        // MONEY FLOW
        // =================================

        const moneyFlow =
            totalDeposits -
            totalWithdrawals;


        // =================================
        // UPDATE STATISTICS
        // =================================

        const totalUsersElement =
            document.getElementById(
                "totalUsers"
            );


        const activeUsersElement =
            document.getElementById(
                "activeUsers"
            );


        const totalDepositsElement =
            document.getElementById(
                "totalDeposits"
            );


        const totalWithdrawalsElement =
            document.getElementById(
                "totalWithdrawals"
            );


        const totalInvestmentsElement =
            document.getElementById(
                "totalInvestments"
            );


        const totalIncomePaidElement =
            document.getElementById(
                "totalIncomePaid"
            );


        const pendingDepositsElement =
            document.getElementById(
                "pendingDeposits"
            );


        const pendingWithdrawalsElement =
            document.getElementById(
                "pendingWithdrawals"
            );


        if (totalUsersElement) {

            totalUsersElement.textContent =
                totalUsers;

        }


        if (activeUsersElement) {

            activeUsersElement.textContent =
                totalActiveUsers;

        }


        if (totalDepositsElement) {

            totalDepositsElement.textContent =
                formatMoney(
                    totalDeposits
                );

        }


        if (totalWithdrawalsElement) {

            totalWithdrawalsElement.textContent =
                formatMoney(
                    totalWithdrawals
                );

        }


        if (totalInvestmentsElement) {

            totalInvestmentsElement.textContent =
                formatMoney(
                    totalInvestments
                );

        }


        if (totalIncomePaidElement) {

            totalIncomePaidElement.textContent =
                formatMoney(
                    totalIncomePaid
                );

        }


        if (pendingDepositsElement) {

            pendingDepositsElement.textContent =
                "(" +
                pendingDeposits +
                ")";

        }


        if (pendingWithdrawalsElement) {

            pendingWithdrawalsElement.textContent =
                "(" +
                pendingWithdrawals +
                ")";

        }


        // =================================
        // UPDATE ANALYTICS
        // =================================

        updateAnalytics(
            moneyFlow,
            totalActiveUsers,
            totalUsers
        );

    }


    // =====================================
    // UPDATE ANALYTICS
    // =====================================

    function updateAnalytics(
        moneyFlow,
        activeUsers,
        totalUsers
    ) {

        const analyticsCards =
            document.querySelectorAll(
                ".analytics-card"
            );


        if (
            !analyticsCards ||
            analyticsCards.length < 3
        ) {

            return;

        }


        // ---------------------------------
        // PLATFORM GROWTH
        // ---------------------------------

        const growthElement =
            analyticsCards[0]
            .querySelector("h3");


        if (growthElement) {

            if (totalUsers === 0) {

                growthElement.textContent =
                    "No Users";

            } else if (
                activeUsers === totalUsers
            ) {

                growthElement.textContent =
                    "Excellent";

            } else if (
                activeUsers >
                totalUsers * 0.5
            ) {

                growthElement.textContent =
                    "Growing";

            } else {

                growthElement.textContent =
                    "Stable";

            }

        }


        // ---------------------------------
        // MONEY FLOW
        // ---------------------------------

        const moneyFlowElement =
            analyticsCards[1]
            .querySelector("h3");


        if (moneyFlowElement) {

            moneyFlowElement.textContent =
                formatMoney(
                    moneyFlow
                );

        }


        // ---------------------------------
        // USER ACTIVITY
        // ---------------------------------

        const activityElement =
            analyticsCards[2]
            .querySelector("h3");


        if (activityElement) {

            activityElement.textContent =
                activeUsers +
                " Users";

        }

    }

});
