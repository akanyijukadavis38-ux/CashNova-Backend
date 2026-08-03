/* =================================
   CASHNOVA DAILY INVESTMENT INCOME
================================= */


function checkDailyIncome(){


console.log("Daily income function started");



let users =
JSON.parse(
localStorage.getItem("cashnovaUsers")
) || [];



let currentUsername =
localStorage.getItem("cashnovaCurrentUser");



let userIndex =
users.findIndex(function(user){

    return user.username === currentUsername;

});



if(userIndex === -1){

    console.log("User not found");

    return;

}



let user = users[userIndex];



if(!user.purchasedProducts){

    console.log("No purchased products");

    return;

}



let now = new Date();

let updated = false;



user.purchasedProducts.forEach(function(product){



    if(product.status !== "Active"){

        return;

    }




    let lastIncome =
    product.lastIncomeDate
    ? new Date(product.lastIncomeDate)
    : new Date(product.purchaseDate);




    let hoursPassed =
    (now - lastIncome) /
    (1000 * 60 * 60);





    // TEST MODE
    // Change to >=24 later

    if(hoursPassed >= 24){



        // UPDATE WALLET

        user.walletBalance =
        (user.walletBalance || 0)
        + product.dailyIncome;



        user.accumulatedIncome =
        (user.accumulatedIncome || 0)
        + product.dailyIncome;




        // UPDATE PRODUCT EARNINGS

        product.totalEarned =
        (product.totalEarned || 0)
        + product.dailyIncome;

// ADD INCOME HISTORY

if(!user.incomeRecords){

    user.incomeRecords = [];

}


user.incomeRecords.push({

    type: product.name + " Daily Income",

    amount: product.dailyIncome,

    status: "Completed",

    date: new Date().toLocaleString()

});


        product.lastIncomeDate =
        now.toISOString();



        updated = true;



        console.log(
        product.name +
        " earned " +
        product.dailyIncome
        );

    }



});





// SAVE AFTER ALL PRODUCTS ARE UPDATED

if(updated){


    users[userIndex] = user;


    localStorage.setItem(

        "cashnovaUsers",

        JSON.stringify(users)

    );


    console.log("Income updated successfully");


}



}




document.addEventListener(

"DOMContentLoaded",

function(){

checkDailyIncome();

}

);