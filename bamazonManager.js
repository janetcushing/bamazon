//-------------------------------------------------------------------//
// bamazonManager.js application which the manager can use to 
// manage inventory for sale in bamazonCustomer.js
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
    head: ['PRODUCT ID', 'PRODUCT NAME', 'PRODUCT PRICE', 'STOCK QUANTITY'],
    colWidths: [15, 30, 15, 20]
});

var AddInventoryTable = new Table({
    head: ['PRODUCT ID', 'PRODUCT NAME', 'OLD STOCK QTY', 'NEW STOCK QTY'],
    colWidths: [15, 30, 20, 20]
});

var AddProductTable = new Table({
    head: ['PRODUCT ID', 'PRODUCT NAME', 'PRODUCT PRICE', 'STOCK QTY',
        'PRODUCT SALES', 'DEPT NUM', 'DEPT NAME'
    ],
    colWidths: [12, 20, 15, 12, 15, 12, 20]
});

var queryText = "";
var departments = [];
var items = [];

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
// It calls inquireManagerOption.
//-------------------------------------------//
function manageInventory() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        inquireManagerOption();
    });
}


//--------------------------------------------------//
// this function
// Asks the user what they want to do
//--------------------------------------------------//
function inquireManagerOption() {
    inquirer.prompt([{
        type: "rawlist",
        name: "option",
        message: "What would you like to do???",
        choices: ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }]).then(function (selection) {
        if (selection.option === "View Products for Sale") {
            displayProductsForSale();
        } else if (selection.option === "View Low Inventory") {
            displayLowInventory();
        } else if (selection.option === "Add to Inventory") {
            addToInventory();
        } else if (selection.option === "Add New Product") {
            addNewProduct();
        }
    });

}



//-----------------------------------------------//
// this function displays the products for sale.
//-----------------------------------------------//
function displayProductsForSale() {
    queryText = "SELECT * FROM bamazon_db.product_t ORDER BY product_id";
    connection.query(queryText,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            console.log(" ");
            console.log(" ");
            productTable.length = 0;
            for (let i = 0; i < res.length; i++) {
                productTable.push(
                    [res[i].product_id,
                        res[i].product_name,
                        currencyFormatter.format(res[i].price, {
                            code: 'USD'
                        }),
                        res[i].stock_quantity
                    ]
                );
            }
            console.log(productTable.toString());
            console.log(" ");
            console.log(" ");
            inquireForMoreManaging();
        });
}

//------------------------------------------------------------------//
// this function displays the products with low inventory for sale.
//------------------------------------------------------------------//
function displayLowInventory() {
    queryText = "SELECT * FROM bamazon_db.product_t " +
        " WHERE stock_quantity < 5 ORDER BY product_id";
    connection.query(queryText,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            console.log(" ");
            console.log(" ");
            productTable.length = 0;
            for (let i = 0; i < res.length; i++) {
                productTable.push(
                    [res[i].product_id,
                        res[i].product_name,
                        currencyFormatter.format(res[i].price, {
                            code: 'USD'
                        }),
                        res[i].stock_quantity
                    ]
                );
            }
            console.log(productTable.toString());
            console.log(" ");
            console.log(" ");
            inquireForMoreManaging();
        });
}


//-----------------------------------------------------//
// this function adds to the stock quantity
// for the product and amount that the manager selects
//-----------------------------------------------------//
function addToInventory() {
    queryText = "SELECT product_id FROM bamazon_db.product_t ORDER BY product_id";
    connection.query(queryText,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            console.log(" ");
            console.log(" ");
            items.length = 0;
            for (let i = 0; i < res.length; i++) {
                items.push(res[i].product_id);
            }

            inquirer.prompt([{
                    type: "input",
                    name: "product_id",
                    message: "What is the PRODUCT ID of the item you would you like to add inventory to??",
                    validate: function (value) {
                        if (items.includes(parseInt(value))) {
                            return true;
                        } else {
                            return false || 'Please enter a valid product id';
                        }
                    }
                },
                {
                    type: "input",
                    name: "count",
                    message: "How Many would you like to add??",
                    validate: function (value) {
                        let valid = !isNaN(parseFloat(value));
                        return valid || 'Please enter a number';
                    }
                }
            ]).then(function (selection) {
                updateStockQuantity(selection);
            });
        });

}


//--------------------------------------------------------------------//
// this function updates the database and adds to the stock quantity
// for the selected product
//--------------------------------------------------------------------//
function updateStockQuantity(selection) {
    queryText = "SELECT product_id, product_name, stock_quantity FROM bamazon_db.product_t" +
        " WHERE product_id = " + selection.product_id;
    connection.query(queryText,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            var updatedStockQuantity = parseInt(res[0].stock_quantity) + parseInt(selection.count);

            var currentItem = [
                res[0].product_id,
                res[0].product_name,
                res[0].stock_quantity,
                updatedStockQuantity
            ];
            AddInventoryTable.push(currentItem);
            queryText = "UPDATE bamazon_db.product_t " +
                " SET stock_quantity = " + updatedStockQuantity +
                " WHERE product_id = " + res[0].product_id;
            connection.query(queryText,
                function (err, res) {
                    if (err) {
                        throw err;
                        console.log(err);
                    }
                    console.log("-----------------------------------------------------");
                    console.log(" ");
                    console.log("Stock Quantity Updated ");
                    console.log(AddInventoryTable.toString());
                    console.log(" ");
                    console.log("-----------------------------------------------------");
                    inquireForMoreManaging();
                });
        });
}


//--------------------------------------------------------------------//
// this function updates the database and adds to a new product
//--------------------------------------------------------------------//
function addNewProduct() {
    queryText = "SELECT department_id, department_name FROM bamazon_db.department_t " +
        "ORDER BY department_id";
    connection.query(queryText,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            for (let i = 0; i < res.length; i++) {
                departments.push(res[i].department_id + " " + res[i].department_name);
            }
            inquirer.prompt([{
                    type: "input",
                    name: "product_name",
                    message: "What is the NAME of the product you would like to add??",
                    validate: function (value) {
                        if (value) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    name: "price",
                    message: "What is the PRICE of the product??",
                    validate: function (value) {
                        let valid = !isNaN(parseFloat(value));
                        return valid || 'Please enter a number';
                    }
                },
                {
                    type: "input",
                    name: "stock_quantity",
                    message: "What is the STOCK QUANTITY of the product??",
                    validate: function (value) {
                        let valid = !isNaN(parseFloat(value));
                        return valid || 'Please enter a number';
                    }
                },
                {
                    type: "list",
                    name: "department",
                    message: "What DEPARTMENT should this product be aligned to??",
                    choices: departments
                }
            ]).then(function (newProduct) {
                let dept_no = newProduct.department.substr(0, 3);
                let dept_name = newProduct.department.substr(4).toLowerCase();
                queryText = "INSERT INTO bamazon_db.product_t " +
                    "(product_name,department_id,department_name,price,stock_quantity)" +
                    " VALUES ( '" + newProduct.product_name + "'," +
                    dept_no + ",'" +
                    dept_name + "'," +
                    newProduct.price + "," +
                    newProduct.stock_quantity + ")";
                connection.query(queryText,
                    function (err, res) {
                        if (err) {
                            throw err;
                            console.log(err);
                        }
                        queryText = "SELECT * FROM bamazon_db.product_t " +
                            "WHERE product_name = '" + newProduct.product_name + "'";
                        connection.query(queryText,
                            function (err, res) {
                                if (err) {
                                    throw err;
                                    console.log(err);
                                }
                                console.log("-----------------------------------------------------");
                                console.log(" ");
                                console.log("New Product Added ");
                                var currentProduct = [
                                    res[0].product_id,
                                    res[0].product_name,
                                    currencyFormatter.format(res[0].price, {
                                        code: 'USD'
                                    }),
                                    res[0].stock_quantity,
                                    currencyFormatter.format(res[0].product_sales, {
                                        code: 'USD'
                                    }),
                                    res[0].department_id,
                                    res[0].department_name
                                ];
                                AddProductTable.push(currentProduct);
                                console.log(AddProductTable.toString());
                                console.log(" ");
                                console.log("-----------------------------------------------------");
                                inquireForMoreManaging();
                            });
                    });
            });
        });
}

//--------------------------------------------------//
// Ask the user if they want to keep shopping
// or exit the application
//--------------------------------------------------//
function inquireForMoreManaging() {
    inquirer.prompt([{
        type: "confirm",
        name: "shopMore",
        message: "Do you want to continue managing??",
        default: true
    }]).then(function (answer) {
        if (answer.shopMore) {
            inquireManagerOption();
        } else {
            console.log("-----------------------------------");
            console.log(" ");
            console.log("Thank you for Managing Bamazon!!");
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

manageInventory();