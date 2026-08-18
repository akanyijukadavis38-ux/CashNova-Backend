/* =================================
   CASHNOVA WITHDRAW SYSTEM
   CLEAN MONGODB VERSION
================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function(){

        const API =
        "https://cashnova-backend-production-2404.up.railway.app";


        // ================================
        // GET USER ID
        // ================================

        const userId =
        localStorage.getItem(
            "cashnovaUserId"
        );


        if(!userId){

            alert(
                "Login session missing"
            );

            return;

        }


        let user;


        // ================================
        // LOAD USER DATA
        // ================================

        try{

            const response =
            await fetch(

                API +
                "/api/users/" +
                userId,

                {
                    method:"GET",
                    cache:"no-store"
                }

            );


            let data = {};

            try{

                data =
                await response.json();

            }
            catch(error){

                data = {};

            }


            if(!response.ok){

                alert(
                    data.message ||
                    "Unable to load account"
                );

                return;

            }


            user = data;


        }
        catch(error){

            console.error(
                "USER LOAD ERROR:",
                error
            );


            alert(
                "Server connection error"
            );

            return;

        }



        // ================================
        // SHOW BALANCE
        // ================================

        const walletBalance =
        document.getElementById(
            "walletBalance"
        );


        if(walletBalance){

            walletBalance.innerHTML =
            "UGX " +
            Number(
                user.walletBalance || 0
            ).toLocaleString(
                "en-UG"
            );

        }



        // ================================
        // SHOW REGISTERED NUMBER
        // ================================

        const withdrawPhone =
        document.getElementById(
            "withdrawPhone"
        );


        if(withdrawPhone){

            withdrawPhone.value =
            user.phone || "";

        }



        // ================================
        // WITHDRAWAL ELEMENTS
        // ================================

        const withdrawAmount =
        document.getElementById(
            "withdrawAmount"
        );


        const withdrawFee =
        document.getElementById(
            "withdrawFee"
        );


        const receiveAmount =
        document.getElementById(
            "receiveAmount"
        );



        // ================================
        // CALCULATE WITHDRAWAL FEE
        // ================================

        if(withdrawAmount){

            withdrawAmount.addEventListener(
                "input",
                function(){

                    const amount =
                    Number(
                        this.value || 0
                    );


                    const fee =
                    amount * 0.14;


                    const receive =
                    amount - fee;


                    if(withdrawFee){

                        withdrawFee.innerHTML =
                        "UGX " +
                        fee.toLocaleString(
                            "en-UG"
                        );

                    }


                    if(receiveAmount){

                        receiveAmount.innerHTML =
                        "UGX " +
                        Math.max(
                            receive,
                            0
                        ).toLocaleString(
                            "en-UG"
                        );

                    }

                }
            );

        }



        // ================================
        // SUBMIT WITHDRAWAL
        // ================================

        const confirmWithdraw =
        document.getElementById(
            "confirmWithdraw"
        );


        if(confirmWithdraw){

            confirmWithdraw.onclick =
            async function(){


                // =========================
                // GET AMOUNT
                // =========================

                const amount =
                Number(
                    withdrawAmount?.value || 0
                );


                // =========================
                // VALIDATE AMOUNT
                // =========================

                if(
                    !Number.isFinite(amount) ||
                    amount <= 0
                ){

                    alert(
                        "Please enter a withdrawal amount."
                    );

                    return;

                }


                // =========================
                // MINIMUM WITHDRAWAL
                // =========================

                if(amount < 5000){

                    alert(
                        "Minimum withdrawal is UGX 5,000"
                    );

                    return;

                }


                // =========================
                // CHECK BALANCE
                // =========================

                if(
                    amount >
                    Number(
                        user.walletBalance || 0
                    )
                ){

                    alert(
                        "Insufficient wallet balance"
                    );

                    return;

                }


                // =========================
                // CHECK PHONE
                // =========================

                if(
                    !user.phone ||
                    String(user.phone).trim() === ""
                ){

                    alert(
                        "Your registered phone number could not be found."
                    );

                    return;

                }


                // =========================
                // PREVENT DOUBLE SUBMISSION
                // =========================

                confirmWithdraw.disabled =
                true;


                const originalButtonText =
                confirmWithdraw.textContent;


                confirmWithdraw.textContent =
                "Submitting...";


                try{


                    // =========================
                    // SEND TO RAILWAY BACKEND
                    // =========================

                    const response =
                    await fetch(

                        API +
                        "/api/withdrawals",

                        {

                            method:"POST",

                            headers:{

                                "Content-Type":
                                "application/json"

                            },

                            body:
                            JSON.stringify({

                                userId:
                                user._id,

                                amount:
                                amount,

                                phone:
                                user.phone

                            })

                        }

                    );


                    // =========================
                    // READ SERVER RESPONSE
                    // =========================

                    let result = {};


                    const responseText =
                    await response.text();


                    if(responseText){

                        try{

                            result =
                            JSON.parse(
                                responseText
                            );

                        }
                        catch(error){

                            result = {

                                message:
                                responseText

                            };

                        }

                    }


                    // =========================
                    // HANDLE FAILED REQUEST
                    // =========================

                    if(!response.ok){

                        throw new Error(

                            result.message ||

                            "Withdrawal request failed."

                        );

                    }


                    // =========================
                    // SUCCESS
                    // =========================

                    alert(

                        result.message ||

                        "Withdrawal request submitted successfully."

                    );


                    // =========================
                    // UPDATE LOCAL USER DATA
                    // IF SERVER RETURNS USER
                    // =========================

                    if(result.user){

                        user =
                        result.user;


                        localStorage.setItem(

                            "cashnovaUserData",

                            JSON.stringify(
                                result.user
                            )

                        );

                    }


                    // =========================
                    // REFRESH PAGE
                    // =========================

                    window.location.reload();


                }
                catch(error){

                    console.error(
                        "WITHDRAWAL ERROR:",
                        error
                    );


                    alert(

                        error.message ||

                        "Unable to submit withdrawal request. Please try again."

                    );

                }
                finally{

                    confirmWithdraw.disabled =
                    false;


                    confirmWithdraw.textContent =
                    originalButtonText;

                }

            };

        }


    }
);
