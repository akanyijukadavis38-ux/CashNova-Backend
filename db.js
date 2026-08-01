const mongoose = require("mongoose");


const connectDB = async () => {

    try {

        await mongoose.connect(
            "YOUR_MONGODB_CONNECTION_STRING"
        );


        console.log(
            "CashNova Database Connected"
        );


    } catch(error){

        console.log(
            "Database connection failed:",
            error.message
        );

        process.exit(1);

    }

};


module.exports = connectDB;