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
    PRIMARY KEY (item_id)
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

select * from bamazon_db.product_t order by department_id, item_id;
select department_id, department_name, count(*) from bamazon_db.product_t group by department_id, department_name;

-- Create a table to hold departments' data
-- CREATE TABLE department_t (
--     department_id INTEGER NOT NULL,
--     department_name VARCHAR(100) NOT NULL,
--     over_head_costs DECIMAL(18 , 2 ),
--     stock_quantity INTEGER(18),
--     PRIMARY KEY (department_id)
-- );

-- alter the department table add a column
-- alter TABLE department_t
-- add column product_sales decimal (18,2) DEFAULT 0;

-- alter the department table add a column
-- alter TABLE department_t
-- add column product_sales decimal (18,2) DEFAULT 0;
-- 
-- Add a foreign key for referential integrity between department and product tables
-- alter table product_t
-- add constraint fk_dept_id foreign key (department_id) 
-- REFERENCES department_t(department_id);



