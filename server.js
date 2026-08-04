const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const depositRoutes = require("./depositRoutes");
const withdrawalRoutes = require("./withdrawalRoutes");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");

const app = express();
// Allow frontend connection
app.use(cors());


// Read JSON data
app.use(express.json());


// Connect database
connectDB();



app.use("/api/users", userRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/admin", adminRoutes);
// Test route
app.get("/", function(req, res){

    res.send("CashNova Backend Running Successfully");

});


const PORT = process.env.PORT || 3000;


app.listen(PORT, function(){

    console.log(
        "CashNova server running on port " + PORT
    );

});
