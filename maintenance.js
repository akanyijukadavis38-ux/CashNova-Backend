/* =================================
   CASHNOVA GLOBAL MAINTENANCE MODE
   MONGODB / RENDER VERSION
================================= */

(function () {

    async function checkMaintenance() {

        try {

            const response = await fetch(
                "https://cashnova-backend-89lg.onrender.com/api/admin/maintenance",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                console.log("Maintenance check failed.");
                return;
            }

            const settings = await response.json();

            if (settings.status === "maintenance") {

                showMaintenanceScreen();

            }

        } catch (error) {

            console.log(
                "Maintenance check error:",
                error
            );

        }

    }


    function showMaintenanceScreen() {

        document.body.innerHTML = `

            <div style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                text-align:center;
                padding:30px;
                box-sizing:border-box;
                font-family:Arial,sans-serif;
                background:#f5f7fb;
            ">

                <div style="
                    max-width:500px;
                    width:100%;
                    background:white;
                    padding:40px 25px;
                    border-radius:20px;
                    box-shadow:0 10px 35px rgba(0,0,0,0.10);
                ">

                    <div style="
                        font-size:55px;
                        margin-bottom:20px;
                    ">
                        🔧
                    </div>

                    <h1 style="
                        margin:0 0 15px;
                        font-size:28px;
                    ">
                        CashNova Maintenance
                    </h1>

                    <p style="
                        font-size:16px;
                        line-height:1.6;
                        color:#555;
                        margin:0;
                    ">
                        Our platform is currently under maintenance.
                        <br><br>
                        Please try again later.
                    </p>

                </div>

            </div>

        `;

    }


    /*
       Run immediately when the page is ready
    */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            checkMaintenance
        );

    } else {

        checkMaintenance();

    }

})();
