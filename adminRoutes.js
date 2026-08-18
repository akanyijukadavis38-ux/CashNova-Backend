const Announcement = require("./Announcement");
const Settings = require("./Settings");
const express = require("express");
const router = express.Router();
const Withdrawal = require("./Withdrawal");
const User = require("./User");
const jwt = require("jsonwebtoken");
const adminAuth = require("./adminAuth");
// =====================================
// ADMIN LOGIN
// =====================================

router.post("/login", async function(req, res){

    try{

        const password =
            String(req.body.password || "").trim();

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        const jwtSecret =
            process.env.JWT_SECRET;


        // Check admin password configuration
        if(!adminPassword){

            return res.status(500).json({

                success:false,

                message:
                    "Admin password is not configured on the server."

            });

        }


        // Check JWT configuration
        if(!jwtSecret){

            console.error(
                "JWT_SECRET is missing from Railway environment variables."
            );

            return res.status(500).json({

                success:false,

                message:
                    "JWT authentication is not configured on the server."

            });

        }


        // Check password
        if(password !== adminPassword){

            return res.status(401).json({

                success:false,

                message:
                    "Wrong admin password"

            });

        }


        // Create admin token
        const token =
            jwt.sign(

                {
                    isAdmin:true,
                    role:"admin"
                },

                jwtSecret,

                {
                    expiresIn:"24h"
                }

            );


        return res.status(200).json({

            success:true,

            message:
                "Admin login successful",

            token:token

        });


    }catch(error){

        console.error(
            "Admin login error:",
            error
        );

        return res.status(500).json({

            success:false,

            message:
                "Unable to complete admin login",

            error:
                error.message

        });

    }

});


// =====================================
// PUBLIC MAINTENANCE STATUS
// USED BY USER PAGES
// =====================================

router.get("/maintenance", async function(req, res){

    try{

        const settings =
            await Settings.findOne();

        return res.status(200).json({

            status:
                settings &&
                settings.maintenanceStatus
                ? settings.maintenanceStatus
                : "active"

        });

    }catch(error){

        console.log(
            "Maintenance status error:",
            error
        );

        return res.status(500).json({

            status:"active",

            message:
                "Unable to check maintenance status"

        });

    }

});


// =====================================
// PROTECT ALL ADMIN ROUTES BELOW
// =====================================

router.use(adminAuth);


// =====================================
// UPDATE MAINTENANCE STATUS
// ADMIN ONLY
// =====================================

router.put("/maintenance", async function(req, res){

    try{

        let settings =
            await Settings.findOne();

        if(!settings){

            settings =
                new Settings();

        }

        const status =
            String(req.body.status || "").trim();

        if(
            status !== "active" &&
            status !== "maintenance"
        ){

            return res.status(400).json({

                success:false,

                message:
                    "Invalid maintenance status"

            });

        }

        settings.maintenanceStatus =
            status;

        await settings.save();

        return res.status(200).json({

            success:true,

            message:
                status === "maintenance"
                ? "Maintenance enabled"
                : "Maintenance disabled",

            status:
                settings.maintenanceStatus

        });

    }catch(error){

        console.log(
            "Maintenance update error:",
            error
        );

        return res.status(500).json({

            success:false,

            message:
                "Failed to update maintenance",

            error:
                error.message

        });

    }

});


// =====================================
// VERIFY ADMIN AUTHENTICATION
// =====================================

router.get("/verify", function(req, res){

    res.json({

        authenticated:true,

        message:
            "Admin authentication valid"

    });

});


// =====================================
// GET ACTIVE USERS
// =====================================

router.get("/active-users", async function(req,res){

    try{

        const users =
            await User.find({

                $or:[
                    {
                        accountActivated:true
                    },
                    {
                        firstDepositCompleted:true
                    }
                ]

            });

        res.json(users);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// GET FINANCIAL RECORDS
// =====================================

router.get("/financial-records", async function(req,res){

    try{

        const users =
            await User.find();

        let records = [];

        users.forEach(function(user){

            // DEPOSITS

            if(user.depositRecords){

                user.depositRecords.forEach(function(record){

                    records.push({

                        username:user.username,

                        type:"Deposit",

                        amount:record.amount,

                        status:record.status,

                        date:record.date

                    });

                });

            }


            // WITHDRAWALS

            if(user.withdrawalRecords){

                user.withdrawalRecords.forEach(function(record){

                    if(
                        record.status === "Approved" ||
                        record.status === "Rejected"
                    ){

                        records.push({

                            username:user.username,

                            type:"Withdrawal",

                            amount:record.amount,

                            status:record.status,

                            date:record.date

                        });

                    }

                });

            }


            // INCOME

            if(user.incomeRecords){

                user.incomeRecords.forEach(function(record){

                    records.push({

                        username:user.username,

                        type:record.type,

                        amount:record.amount,

                        status:record.status,

                        date:record.date

                    });

                });

            }

        });

        res.json(records);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// GET INCOME RECORDS
// =====================================

router.get("/income-records", async function(req,res){

    try{

        const users =
            await User.find();

        let records = [];

        users.forEach(function(user){

            if(user.incomeRecords){

                user.incomeRecords.forEach(function(record){

                    records.push({

                        username:user.username,

                        type:record.type,

                        amount:record.amount,

                        status:record.status,

                        date:record.date

                    });

                });

            }

        });

        res.json(records);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// GET REFERRAL RECORDS
// =====================================

router.get("/referral-records", async function(req,res){

    try{

        const users =
            await User.find();

        let records = [];

        users.forEach(function(user){

            if(user.transactionHistory){

                user.transactionHistory.forEach(function(record){

                    if(
                        record.type &&
                        record.type
                            .toLowerCase()
                            .includes("referral")
                    ){

                        records.push({

                            username:user.username,

                            type:record.type,

                            amount:record.amount,

                            status:record.status,

                            date:record.date

                        });

                    }

                });

            }

        });

        res.json(records);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// GET ALL USERS
// =====================================

router.get("/users", async function(req,res){

    try{

        const users =
            await User.find();

        res.json(users);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// GET DEPOSIT RECORDS
// =====================================

router.get("/deposit-records", async function(req,res){

    try{

        const users =
            await User.find();

        let records = [];

        users.forEach(function(user){

            if(user.depositRecords){

                user.depositRecords.forEach(function(record){

                    records.push({

                        username:user.username,

                        amount:record.amount,

                        status:record.status,

                        date:record.date

                    });

                });

            }

        });

        res.json(records);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// GET WITHDRAWAL RECORDS
// =====================================

router.get("/withdrawal-records", async function(req,res){

    try{

        const records =
            await Withdrawal.find({

                status:{
                    $in:[
                        "Approved",
                        "Rejected"
                    ]
                }

            }).sort({
                date:-1
            });

        res.json(records);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// ANNOUNCEMENTS
// =====================================

// GET ANNOUNCEMENTS

router.get("/announcements", async function(req,res){

    try{

        const announcements =
            await Announcement.find()
            .sort({
                date:-1
            });

        res.json(announcements);

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// CREATE ANNOUNCEMENT

router.post("/announcements", async function(req,res){

    try{

        const announcement =
            new Announcement({

                title:req.body.title,

                message:req.body.message,

                date:new Date()

            });

        await announcement.save();

        res.json({

            message:
                "Announcement created successfully",

            announcement:announcement

        });

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// DELETE ANNOUNCEMENT

router.delete("/announcements/:id", async function(req,res){

    try{

        await Announcement.findByIdAndDelete(
            req.params.id
        );

        res.json({

            message:
                "Announcement deleted"

        });

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// =====================================
// ADMIN SETTINGS
// =====================================

// GET SETTINGS

router.get("/settings", async function(req,res){

    try{

        let settings =
            await Settings.findOne();

        res.json(
            settings || {}
        );

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


// UPDATE SETTINGS

router.put("/settings", async function(req,res){

    try{

        let settings =
            await Settings.findOne();

        if(!settings){

            settings =
                new Settings(req.body);

        }else{

            settings.platformName =
                req.body.platformName;

            settings.supportContact =
                req.body.supportContact;

            settings.minimumDeposit =
                req.body.minimumDeposit;

            settings.minimumWithdrawal =
                req.body.minimumWithdrawal;

            settings.withdrawalFee =
                req.body.withdrawalFee;

            settings.dailyWithdrawalLimit =
                req.body.dailyWithdrawalLimit;

        }

        await settings.save();

        res.json({

            message:
                "Settings updated",

            settings:settings

        });

    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

});


module.exports = router;
