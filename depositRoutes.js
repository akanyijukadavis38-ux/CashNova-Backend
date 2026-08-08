const express = require("express");
const router = express.Router();

const Deposit = require("./Deposit");
const User = require("./User");


// =====================================
// CREATE DEPOSIT REQUEST
// =====================================

router.post("/", async function(req, res){

    try{

        const deposit = new Deposit({

            userId: req.body.userId,

            username: req.body.username,

            amount: Number(req.body.amount),

            method: req.body.method,

            mobileMoneyTransactionId:
                req.body.mobileMoneyTransactionId,

            status: "Pending",

            date: new Date()

        });


        await deposit.save();


        res.json({

            message: "Deposit submitted successfully",

            deposit: deposit

        });


    }catch(error){

        res.status(500).json({

            message: error.message

        });

    }

});



// =====================================
// GET ALL DEPOSITS FOR ADMIN
// OLDEST FIRST
// =====================================

router.get("/", async function(req, res){

    try{

        const deposits =
            await Deposit.find()
            .sort({ date: 1 });


        res.json(deposits);


    }catch(error){

        res.status(500).json({

            message: error.message

        });

    }

});



// =====================================
// APPROVE DEPOSIT
// =====================================

router.post("/approve/:id", async function(req, res){

    try{

        // ---------------------------------
        // FIND DEPOSIT
        // ---------------------------------

        const deposit =
            await Deposit.findById(req.params.id);


        if(!deposit){

            return res.status(404).json({

                message: "Deposit not found"

            });

        }


        // ---------------------------------
        // PREVENT DOUBLE APPROVAL
        // ---------------------------------

        if(deposit.status === "Credited"){

            return res.status(400).json({

                message:
                    "This deposit has already been approved."

            });

        }


        if(deposit.status === "Rejected"){

            return res.status(400).json({

                message:
                    "This deposit has already been rejected."

            });

        }



        // ---------------------------------
        // FIND USER
        // ---------------------------------

        const user =
            await User.findById(deposit.userId);


        if(!user){

            return res.status(404).json({

                message: "User not found"

            });

        }



        // ---------------------------------
        // INITIALIZE RECORD ARRAYS
        // ---------------------------------

        if(!user.incomeRecords){

            user.incomeRecords = [];

        }


        if(!user.transactionHistory){

            user.transactionHistory = [];

        }


        if(!user.depositRecords){

            user.depositRecords = [];

        }


        if(!user.teamMembers){

            user.teamMembers = [];

        }


        if(!user.referralMembers){

            user.referralMembers = [];

        }



        const depositAmount =
            Number(deposit.amount || 0);



        // ---------------------------------
        // CHECK WHETHER THIS IS FIRST DEPOSIT
        // ---------------------------------

        const isFirstDeposit =
            user.firstDepositCompleted !== true;



        // ---------------------------------
        // CREDIT USER WALLET
        // ---------------------------------

        user.walletBalance =
            Number(user.walletBalance || 0)
            +
            depositAmount;



        // ---------------------------------
        // UPDATE TOTAL DEPOSITS
        // ---------------------------------

        user.totalDeposits =
            Number(user.totalDeposits || 0)
            +
            depositAmount;



        // ---------------------------------
        // FIRST DEPOSIT
        // ---------------------------------

        if(isFirstDeposit){

            user.firstDepositCompleted = true;

            user.accountActivated = true;



            // =================================
            // UNLOCK REGISTRATION BONUS
            // =================================

            if(user.registrationBonusUnlocked !== true){

                user.registrationBonusUnlocked = true;

                user.registrationBonusStatus =
                    "Unlocked";


                const bonus =
                    Number(user.registrationBonus || 5000);


                user.cumulativeIncome =
                    Number(user.cumulativeIncome || 0)
                    +
                    bonus;



                user.incomeRecords.push({

                    type: "Registration Bonus",

                    amount: bonus,

                    status: "Completed",

                    date: new Date()

                });



                user.transactionHistory.push({

                    type: "Registration Bonus",

                    amount: bonus,

                    status: "Completed",

                    date: new Date()

                });

            }

        }



        // =================================
        // SAVE DEPOSIT TRANSACTION
        // =================================

        user.transactionHistory.push({

            type: "Deposit",

            depositId: deposit._id,

            amount: depositAmount,

            method: deposit.method,

            mobileMoneyTransactionId:
                deposit.mobileMoneyTransactionId,

            status: "Credited",

            date: new Date()

        });



        // =================================
        // SAVE DEPOSIT RECORD
        // =================================

        user.depositRecords.push({

            depositId: deposit._id,

            amount: depositAmount,

            method: deposit.method,

            mobileMoneyTransactionId:
                deposit.mobileMoneyTransactionId,

            status: "Credited",

            date: new Date()

        });



        // =================================
        // REFERRAL SYSTEM
        // ONLY AFTER FIRST APPROVED DEPOSIT
        // =================================

        if(isFirstDeposit){

            await processReferralChain(
                user,
                depositAmount
            );

        }



        // =================================
        // UPDATE DEPOSIT STATUS
        // =================================

        deposit.status = "Credited";

        deposit.approvedDate = new Date();



        // =================================
        // SAVE USER + DEPOSIT
        // =================================

        await user.save();

        await deposit.save();



        // =================================
        // RESPONSE
        // =================================

        res.json({

            message: "Deposit approved",

            user: user,

            deposit: deposit

        });


    }catch(error){

        console.log(
            "DEPOSIT APPROVAL ERROR:",
            error
        );


        res.status(500).json({

            message: error.message

        });

    }

});



// =====================================
// REFERRAL CHAIN
// LEVEL 1 = 20%
// LEVEL 2 = 3%
// LEVEL 3 = 1%
// =====================================

async function processReferralChain(
    depositedUser,
    depositAmount
){

    try{

        let currentUser =
            depositedUser;


        const percentages = {

            1: 0.20,

            2: 0.03,

            3: 0.01

        };



        for(
            let level = 1;
            level <= 3;
            level++
        ){

            // ---------------------------------
            // FIND REFERRER
            // ---------------------------------

            const referralCode =
                currentUser.referredBy;


            if(
                !referralCode ||
                referralCode === ""
            ){

                break;

            }



            // ---------------------------------
            // FIND PARENT USER
            // ---------------------------------

            const parentUser =
                await User.findOne({

                    myReferralCode:
                        referralCode

                });



            if(!parentUser){

                break;

            }



            // ---------------------------------
            // COMMISSION
            // ---------------------------------

            const commission =
                depositAmount *
                percentages[level];



            // ---------------------------------
            // INITIALIZE ARRAYS
            // ---------------------------------

            if(!parentUser.teamMembers){

                parentUser.teamMembers = [];

            }


            if(!parentUser.referralMembers){

                parentUser.referralMembers = [];

            }


            if(!parentUser.incomeRecords){

                parentUser.incomeRecords = [];

            }


            if(!parentUser.transactionHistory){

                parentUser.transactionHistory = [];

            }



            // ---------------------------------
            // CHECK EXISTING TEAM MEMBER
            // ---------------------------------

            const existingMember =
                parentUser.teamMembers.find(
                    function(member){

                        return String(
                            member.userId || ""
                        ) === String(
                            depositedUser._id
                        );

                    }
                );



            // ---------------------------------
            // MEMBER INFORMATION
            // ---------------------------------

            const memberData = {

                userId:
                    depositedUser._id,

                username:
                    depositedUser.username,

                accountNumber:
                    depositedUser.accountNumber,

                level: level,

                firstDepositAmount:
                    depositAmount,

                totalDeposits:
                    Number(
                        depositedUser.totalDeposits || 0
                    ),

                depositStatus:
                    "Active",

                commissionRate:
                    percentages[level],

                commissionEarned:
                    commission,

                joinedDate:
                    new Date()

            };



            // ---------------------------------
            // ADD OR UPDATE TEAM MEMBER
            // ---------------------------------

            if(existingMember){

                Object.assign(
                    existingMember,
                    memberData
                );

            }else{

                parentUser.teamMembers.push(
                    memberData
                );

            }



            // ---------------------------------
            // REFERRAL MEMBERS
            // ---------------------------------

            const existingReferralMember =
                parentUser.referralMembers.find(
                    function(member){

                        return String(
                            member.userId || ""
                        ) === String(
                            depositedUser._id
                        );

                    }
                );



            if(!existingReferralMember){

                parentUser.referralMembers.push({

                    userId:
                        depositedUser._id,

                    username:
                        depositedUser.username,

                    level: level,

                    depositAmount:
                        depositAmount,

                    commission:
                        commission,

                    date:
                        new Date()

                });

            }



            // ---------------------------------
            // ADD COMMISSION TO WALLET
            // ---------------------------------

            parentUser.walletBalance =
                Number(
                    parentUser.walletBalance || 0
                )
                +
                commission;



            // ---------------------------------
            // ADD TO CUMULATIVE INCOME
            // ---------------------------------

            parentUser.cumulativeIncome =
                Number(
                    parentUser.cumulativeIncome || 0
                )
                +
                commission;



            // ---------------------------------
            // ADD REFERRAL INCOME
            // ---------------------------------

            parentUser.referralIncome =
                Number(
                    parentUser.referralIncome || 0
                )
                +
                commission;



            // ---------------------------------
            // INCOME RECORD
            // ---------------------------------

            parentUser.incomeRecords.push({

                type:
                    "Referral Commission",

                level:
                    level,

                fromUser:
                    depositedUser.username,

                amount:
                    commission,

                depositAmount:
                    depositAmount,

                commissionRate:
                    percentages[level],

                status:
                    "Completed",

                date:
                    new Date()

            });



            // ---------------------------------
            // TRANSACTION HISTORY
            // ---------------------------------

            parentUser.transactionHistory.push({

                type:
                    "Referral Commission",

                level:
                    level,

                fromUser:
                    depositedUser.username,

                amount:
                    commission,

                depositAmount:
                    depositAmount,

                commissionRate:
                    percentages[level],

                status:
                    "Completed",

                date:
                    new Date()

            });



            // ---------------------------------
            // SAVE PARENT USER
            // ---------------------------------

            await parentUser.save();



            // ---------------------------------
            // MOVE UP THE REFERRAL CHAIN
            // ---------------------------------

            currentUser =
                parentUser;

        }


    }catch(error){

        console.log(
            "REFERRAL PROCESS ERROR:",
            error
        );

        throw error;

    }

}



// =====================================
// REJECT DEPOSIT
// =====================================

router.post("/reject/:id", async function(req,res){

    try{

        const deposit =
            await Deposit.findById(req.params.id);


        if(!deposit){

            return res.status(404).json({

                message: "Deposit not found"

            });

        }



        // ---------------------------------
        // PREVENT INVALID REJECTION
        // ---------------------------------

        if(deposit.status === "Credited"){

            return res.status(400).json({

                message:
                    "This deposit has already been approved."

            });

        }


        if(deposit.status === "Rejected"){

            return res.status(400).json({

                message:
                    "This deposit has already been rejected."

            });

        }



        // ---------------------------------
        // REJECT
        // ---------------------------------

        deposit.status = "Rejected";

        deposit.rejectedDate = new Date();



        await deposit.save();



        res.json({

            message: "Deposit rejected",

            deposit: deposit

        });


    }catch(error){

        res.status(500).json({

            message: error.message

        });

    }

});


module.exports = router;
