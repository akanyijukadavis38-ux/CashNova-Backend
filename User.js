const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },


    username:{
        type:String,
        required:true,
        unique:true
    },


    phone:{
        type:String
    },


    password:{
        type:String,
        required:true
    },


    accountNumber:{
        type:String
    },


    walletBalance:{
        type:Number,
        default:0
    },


    totalDeposits:{
        type:Number,
        default:0
    },


    referralCode:{
        type:String
    },


    referredBy:{
        type:String
    },


    referralIncome:{
        type:Number,
        default:0
    },


    accountActivated:{
        type:Boolean,
        default:false
    },
email:{
    type:String,
    unique:true
},


myReferralCode:{
    type:String,
    unique:true
},


registrationBonus:{
    type:Number,
    default:5000
},


registrationBonusStatus:{
    type:String,
    default:"Locked"
},


registrationBonusUnlocked:{
    type:Boolean,
    default:false
},


firstDepositCompleted:{
    type:Boolean,
    default:false
},


purchasedProducts:{
    type:Array,
    default:[]
},


incomeRecords:{
    type:Array,
    default:[]
},


transactionHistory:{
    type:Array,
    default:[]
},


teamMembers:{
    type:Array,
    default:[]
},


referralMembers:{
    type:Array,
    default:[]
},


depositRecords:{
    type:Array,
    default:[]
},


withdrawalRecords:{
    type:Array,
    default:[]
},

    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports =
mongoose.model(
    "User",
    UserSchema
);