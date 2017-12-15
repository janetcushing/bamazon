# bamazon
An Amazon-like storefront application


This application consists of 3 functions which can be executed from the command line.  The 3 functions' commands are:

node bamazonCustomer.js

node bamazonManager.js

node bamazonSupervisor.js

You need node.js and some npm files loaded onto your computer in order to run this application. You also need mySQL and mySQL Workbench installed on your computer.  Please see instructions below for running the app.

To activate the application :

Download the application code from https://github.com/janetcushing/bamazon

In the terminal window, navigate to the directory where you have downloaded the bamazon code.

Type on the command line:

node -v 
        (this will confirm that you have node installed on your computer. It will show the version of node that you have.)

npm -v 
        (this will confirm that you have npm installed on your computer. It will show the version of npm that you have.)

npm install 
        (this will install all the node package manager (npm) files that you need to run this app)

You can load both mysql database and mysql workbench from www.mysql.com/products.

On the command line type:

mysql.server start  
       (this will start up your mysql server)

Go into MySQL Workbench.  check the server status and confirm that it is up and running.  Create a localhost connection.  Then execute the SQL statements in the file bamazon.sql.

Go back into the terminal window and confirm that you are in the directory where you have downloaded the code.

Type one of these commands on the command line, to access the application:

node bamazonCustomer.js
      (provides a customer view into the bamazon_db database with customer functionality)

node bamazonManager.js
      (provides a manager view into the bamazon_db database with tasks available to manage the store inventory)

node bamazonSupervisor.js
     (provides a supervisor view into the bamazon_db database with tasks available to check inventory and perform some analytics)
