const mongoose = require("mongoose");


const withdrawalSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    username:{
        type:String,
        required:true
    },


    phone:{
        type:String,
        required:true
    },


    amount:{
        type:Number,
        required:true
    },


    fee:{
        type:Number,
        default:0
    },


    receiveAmount:{
        type:Number,
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
"Withdrawal",
withdrawalSchema
);