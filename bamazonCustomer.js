//-------------------------------------------------------------------//
// bamazonCustomer.js application which displays in the console
// products that a customer can buy, and allows the customer to 
// mock purchase the products
//-------------------------------------------------------------------//

//------------------------------------------//
// global variables including npm packages
// and mySQL database connection
//------------------------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");
var currencyFormatter = require('currency-formatter');
var Table = require('cli-table');

var productTable = new Table({
    head: ['PRODUCT ID', 'PRODUCT NAME', 'PRODUCT PRICE'],
    colWidths: [20, 30, 20]
});
var orderTable = new Table({
    head: ['PRODUCT ID', 'PRODUCT NAME', 'PRODUCT PRICE',
        'QUANTITY', 'COST', 'ORDER TOTAL'
    ],
    colWidths: [10, 20, 10, 10, 10, 15]
});

var orderTotal = 0;
var items = [];
var productQuery;

// connection to the bamazon_db mySQL database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});


//-------------------------------------------//
// this function kicks off the application.
// it opens the connection with the database
// and sets up the first query.  It calls
// displayProductsForSale().
//-------------------------------------------//
function beginShopping() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        productQuery = "SELECT * FROM bamazon_db.product_t order by product_id";
        displayProductsForSale(productQuery);
    });
}

//-------------------------------------------//
// this function continues the shopping.
// At this point the connection is already 
// open so it just needs to kick off displaying 
// the products
//-------------------------------------------//
function continueShopping() {
    productQuery = "SELECT * FROM bamazon_db.product_t order by product_id";
    displayProductsForSale(productQuery);
}

//-------------------------------------------//
// this function displays the products for sale.
// then it kicks off the function which asks
// the user which product they would like to buy
//-------------------------------------------//
function displayProductsForSale(productQuery) {
    connection.query(productQuery,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            var items = [];
            productTable.length = 0;
            console.log("-----------------------------------");
            console.log(" ");
            for (let i = 0; i < res.length; i++) {
                items.push(res[i].product_id);
                productTable.push(
                    [res[i].product_id,
                        res[i].product_name,
                        currencyFormatter.format(res[i].price, {
                            code: 'USD'
                        })
                    ]
                );
            }
            console.log(productTable.toString());
            console.log(" ");
            console.log("-----------------------------------");
            console.log(" ");
            inquireWhichProduct(items);
        });
}



//--------------------------------------------------//
// this function
// Asks the user what they want to buy
// and then ask how much they want to buy
//--------------------------------------------------//
function inquireWhichProduct(items) {
    inquirer.prompt([{
            type: "input",
            name: "product_id",
            message: "What is the PRODUCT ID of the item you would you like to buy??",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "count",
            message: "How Many would you like to buy??",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function (selection) {
        checkStock(selection);
    });

}

//-------------------------------------------//
// this function checks the database to 
// confirm there is enough stock there to fill
// the request.  It updates the database with the
// quantity which has been sold. It prints to the 
// console the order details and a summary of 
// everything that has been ordered so far
//-------------------------------------------//
function checkStock(selection) {
    productQuery =
        "SELECT product_id, product_name, price, stock_quantity, product_sales " +
        "FROM bamazon_db.product_t WHERE product_id = " +
        selection.product_id;
    connection.query(productQuery,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            if (res[0].stock_quantity >= selection.count) {
                let cost = parseFloat(selection.count) * parseFloat(res[0].price);
                let product_sales_updated = res[0].product_sales + cost
                console.log("\n+++++++++++++++++++++++++++++++++++");
                console.log("Your item and cost: ");
                console.log("ITEM ID:       " + res[0].product_id);
                console.log("ITEM NAME:     " + res[0].product_name);
                console.log("ITEM COST:     " + currencyFormatter.format(res[0].price, {
                    code: 'USD'
                }));
                console.log("ITEM QUANTITY: " + selection.count);
                console.log("TOTAL COST:    " + currencyFormatter.format(cost, {
                    code: 'USD'
                }));
                console.log("+++++++++++++++++++++++++++++++++++\n");
                orderTotal = orderTotal + parseFloat(cost);
                var currentOrder = [res[0].product_id,
                    res[0].product_name,
                    currencyFormatter.format(res[0].price, {
                        code: 'USD'
                    }),
                    selection.count,
                    currencyFormatter.format(cost, {
                        code: 'USD'
                    }),
                    currencyFormatter.format(orderTotal, {
                        code: 'USD'
                    })
                ];
                orderTable.push(currentOrder);
                console.log(orderTable.toString());

                let stock_quantity_update =
                    parseInt(res[0].stock_quantity) - parseInt(selection.count);
                productQuery = 'update bamazon_db.product_t' +
                    ' set stock_quantity = ' + stock_quantity_update +
                    ' , product_sales = ' + product_sales_updated +
                    ' where product_id = ' + res[0].product_id;
                connection.query(productQuery,
                    function (err, res) {
                        if (err) {
                            throw err;
                            console.log(err);
                        }
                        inquireMoreShopping();
                    });
            } else {
                console.log("-----------------------------------");
                console.log(" ");
                console.log("    Insufficient Quantity! ");
                console.log(" ");
                console.log("-----------------------------------");

                inquireMoreShopping();
            }
        });
}

//--------------------------------------------------//
// Ask the user if they want to keep shopping
// or exit the application
//--------------------------------------------------//
function inquireMoreShopping() {
    inquirer.prompt([{
        type: "confirm",
        name: "shopMore",
        message: "Do you want to continue shopping??",
        default: true
    }]).then(function (answer) {
        if (answer.shopMore) {
            continueShopping();
        } else {
            console.log("-----------------------------------");
            console.log(" ");
            console.log("Thank you for shopping at bamazon!!");
            console.log(" ");
            console.log("-----------------------------------");
            connection.end();
            process.exit();
        }
    });

}


/********************************************/
// main process - kick off the application
/********************************************/

beginShopping();