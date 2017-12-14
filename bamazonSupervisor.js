//-------------------------------------------------------------------//
// bamazonSupervisor.js application which the supervisor can use to 
// manage the store's departments
//-------------------------------------------------------------------//

//------------------------------------------//
// global variables including npm packages
// and mySQL database connection
//------------------------------------------//
var inquirer = require("inquirer");
var mysql = require("mysql");
var currencyFormatter = require('currency-formatter');
var Table = require('cli-table');

var deptTable = new Table({
    head: ['DEPARTMENT ID', 'DEPARTMENT NAME', 'OVER HEAD COSTS', 'PRODUCT SALES', 'TOTAL PROFIT'],
    colWidths: [15, 25, 15, 20, 20]
});

var deptQuery = "";

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
// It calls inquireSupervisorOption.
//-------------------------------------------//
function manageDepartments() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        inquireSupervisorOption();
    });
}


//--------------------------------------------------//
// this function
// Asks the user what they want to do
//--------------------------------------------------//
function inquireSupervisorOption() {
    inquirer.prompt([{
        type: "rawlist",
        name: "option",
        message: "What would you like to do???",
        choices: ["View Product Sales by Department",
                  "Create New Department"]
    }]).then(function (selection) {
        if (selection.option === "View Product Sales by Department") {
            displayProductSales();
        } else if (selection.option === "Create New Department") {
            addNewDepartment();
        }
    });

}


//-----------------------------------------------//
// this function displays the products for sale.
//-----------------------------------------------//
function displayProductSales() {
    deptQuery = "SELECT "  +
    "dept.department_id " +
  ", dept.department_name " +
  ", dept.over_head_costs  " +
  ", SUM(prd.product_sales) as dept_sales" + 
  " FROM bamazon_db.department_t dept " + 
  " LEFT OUTER JOIN  bamazon_db.product_t prd " +
  " ON dept.department_id = prd.department_id " +
  " GROUP BY dept.department_id, dept.department_name, dept.over_head_costs";
  console.log(deptQuery);
    connection.query(deptQuery,
        function (err, res) {
            if (err) {
                throw err;
                console.log(err);
            }
            console.log(" ");
            console.log(" ");
            deptTable.length = 0;
            for (i = 0; i < res.length; i++){
                let total_profit = res[i].dept_sales - res[i].over_head_costs;
                deptTable.push(
                    [res[i].department_id,
                     res[i].department_name,
                    currencyFormatter.format(res[i].over_head_costs, {code: 'USD'}),
                    currencyFormatter.format(res[i].dept_sales, {code: 'USD'}),
                        currencyFormatter.format(total_profit, {code: 'USD'})]
                );
            }
            console.log(deptTable.toString());
            console.log(" ");
            console.log(" ");
            inquireForMoreSupervising();
        });
}


function addNewDepartment() {
    inquirer.prompt([{
            type: "input",
            name: "dept_name",
            message: "What is the NAME of the department you would like to add??",
        },
        {
            type: "input",
            name: "over_head_costs",
            message: "What are the OVER HEAD COSTS of the department??",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(function (newDept) {
        deptQuery = "INSERT INTO bamazon_db.department_t " +
            "(department_name, over_head_costs)" +
            " VALUES ( '" + newDept.dept_name + "'," +
            newDept.over_head_costs + ")";
            console.log(deptQuery);
        connection.query(deptQuery,
            function (err, res) {
                if (err) {
                    throw err;
                    console.log(err);
                }
                console.log(JSON.stringify(res));
                console.log("-----------------------------------------------------");
                console.log(" ");
                console.log("New Department Added ");
                console.log(" ");
                console.log("-----------------------------------------------------");
                inquireForMoreSupervising();
            });
    });

}

//--------------------------------------------------//
// Ask the user if they want to keep shopping
// or exit the application
//--------------------------------------------------//
function inquireForMoreSupervising() {
    inquirer.prompt([{
        type: "confirm",
        name: "shopMore",
        message: "Do you want to continue with supervising tasks??",
        default: true
    }]).then(function (answer) {
        if (answer.shopMore) {
            inquireSupervisorOption();
        } else {
            console.log("------------------------------------------------");
            console.log(" ");
            console.log("Thank you for Supervising Bamazon Departments!! ");
            console.log(" ");
            console.log("------------------------------------------------");
            connection.end();
            process.exit();
        }
    });

}


/********************************************/
// main process - kick off the application
/********************************************/

manageDepartments();