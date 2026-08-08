const mongoose = require("mongoose");


// =================================
// TEAM MEMBER SCHEMA
// =================================

const TeamMemberSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    username: {
        type: String,
        default: ""
    },

    level: {
        type: Number,
        required: true
    },

    firstDepositAmount: {
        type: Number,
        default: 0
    },

    depositStatus: {
        type: String,
        default: "Not yet deposited"
    },

    joinedDate: {
        type: Date,
        default: Date.now
    }

}, {
    _id: false
});


// =================================
// USER SCHEMA
// =================================

const UserSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        unique: true
    },

    phone: {
        type: String
    },

    password: {
        type: String,
        required: true
    },

    accountNumber: {
        type: String
    },

    network: {
        type: String,
        default: ""
    },


    // =================================
    // MONEY
    // =================================

    walletBalance: {
        type: Number,
        default: 0
    },

    cumulativeIncome: {
        type: Number,
        default: 0
    },

    totalDeposits: {
        type: Number,
        default: 0
    },


    // =================================
    // REFERRAL
    // =================================

    myReferralCode: {
        type: String,
        unique: true
    },

    referralCode: {
        type: String
    },

    referredBy: {
        type: String,
        default: ""
    },

    referralIncome: {
        type: Number,
        default: 0
    },


    // =================================
    // ACCOUNT STATUS
    // =================================

    accountActivated: {
        type: Boolean,
        default: false
    },

    firstDepositCompleted: {
        type: Boolean,
        default: false
    },


    // =================================
    // REGISTRATION BONUS
    // =================================

    registrationBonus: {
        type: Number,
        default: 5000
    },

    registrationBonusStatus: {
        type: String,
        default: "Locked"
    },

    registrationBonusUnlocked: {
        type: Boolean,
        default: false
    },


    // =================================
    // PRODUCTS
    // =================================

    purchasedProducts: {
        type: Array,
        default: []
    },
// =================================
// CHECK-IN
// =================================

lastCheckInDate: {
    type: Date,
    default: null
},

totalCheckInBonus: {
    type: Number,
    default: 0
},


// =================================
// RECORDS
// =================================

incomeRecords: {
    type: Array,
    default: []
},

    // =================================
    // RECORDS
    // =================================

    incomeRecords: {
        type: Array,
        default: []
    },

    transactionHistory: {
        type: Array,
        default: []
    },

    depositRecords: {
        type: Array,
        default: []
    },

    withdrawalRecords: {
        type: Array,
        default: []
    },


    // =================================
    // TEAM
    // =================================

    teamMembers: {
        type: [TeamMemberSchema],
        default: []
    },

    referralMembers: {
        type: Array,
        default: []
    },


    // =================================
    // CREATED DATE
    // =================================

    createdAt: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model(
    "User",
    UserSchema
);
