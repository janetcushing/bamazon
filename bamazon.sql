-- Drops the database if it already exists --
DROP DATABASE IF EXISTS bamazon_db;
-- Create a database  --
CREATE DATABASE bamazon_db;

-- Use this db for the following statements --
use bamazon_db;

-- Create a table to hold products' data
CREATE TABLE product_t (
    product_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_id INTEGER(18) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(18 , 2 ),
	stock_quantity INTEGER(18),
    PRIMARY KEY (product_id)
);

INSERT INTO `bamazon_db`.`product_t`
(`product_name`,`department_id`,`department_name`,`price`, `stock_quantity`)
VALUES
('banana',101,'grocery',.49, 10),
('orange',101,'grocery',1.00, 20),
('cocoa',101,'grocery',3.99,30),
('lawn chair',102,'housewares',15.99,40),
('hammer',103,'tools', 20.00,50),
('screwdriver',103,'tools',11.99,60),
('bandsaw',103,'tools',49.50,70),
('beach toys',104,'sundries',9.99,80),
('tupperware',102,'housewares',3.99,90),
('spaghetti',101,'grocery',1.59,100);


USE bamazon_db;

-- Create a table to hold departments' data
CREATE TABLE department_t (
    department_id INTEGER AUTO_INCREMENT  NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(18 , 2 ),
    PRIMARY KEY (department_id)
)
AUTO_INCREMENT = 101
;

INSERT INTO department_t ( department_name, over_head_costs) values ('grocery',10000);
INSERT INTO department_t ( department_name, over_head_costs) values ('housewares',20000);
INSERT INTO department_t ( department_name, over_head_costs) values ('tools',30000);
INSERT INTO department_t ( department_name, over_head_costs) values ('sundries',5000);

-- ALTER the product table add a column
ALTER TABLE product_t
ADD COLUMN product_sales DECIMAL (18,2) DEFAULT 0;

-- 
-- Add a foreign key for referential integrity between department and product tables
-- ALTER TABLE product_t
-- ADD CONSTRAINT fk_dept_id FOREIGN KEY (department_id) 
-- REFERENCES department_t(department_id);



