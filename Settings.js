const mongoose = require("mongoose");


const SettingsSchema = new mongoose.Schema({


platformName:{
    type:String,
    default:"CashNova"
},


supportContact:{
    type:String,
    default:""
},



minimumDeposit:{
    type:Number,
    default:15000
},


registrationBonus:{
    type:Number,
    default:5000
},


dailyLoginBonus:{
    type:Number,
    default:100
},



minimumWithdrawal:{
    type:Number,
    default:5000
},


withdrawalFee:{
    type:Number,
    default:14
},


dailyWithdrawalLimit:{
    type:Number,
    default:2
},



maintenanceStatus:{
    type:String,
    default:"active"
},



updatedDate:{
    type:Date,
    default:Date.now
}



});


module.exports = mongoose.model(
"Settings",
SettingsSchema
);
