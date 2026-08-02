const mongoose = require("mongoose");


const depositSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    username:{
        type:String,
        required:true
    },


    amount:{
        type:Number,
        required:true
    },


    method:{
        type:String,
        required:true
    },


    mobileMoneyTransactionId:{
        type:String,
        required:true
    },


    status:{
        type:String,
        default:"Pending"
    },


    date:{
        type:Date,
        default:Date.now
    },


    approvedDate:{
        type:Date
    }


});


module.exports = mongoose.model(
"Deposit",
depositSchema
);