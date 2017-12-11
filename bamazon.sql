-- Drops the database if it already exists --
DROP DATABASE IF EXISTS bamazonDB;
-- Create a database  --
CREATE DATABASE bamazonDB;

-- Use this db for the following statements --
use bamazonDB;

-- Create a table to hold products' data
CREATE TABLE product_t (
    item_ID INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_ID INTEGER(18) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(18 , 2 ),
   --  stock_quantity INTEGER(18),
    PRIMARY KEY (item_id)
);

-- CREATE TABLE department_t (
--     department_ID INTEGER NOT NULL,
--     department_name VARCHAR(100) NOT NULL,
--     over_head_costs DECIMAL(18 , 2 ),
--     stock_quantity INTEGER(18),
--     PRIMARY KEY (department_id)
-- );

-- alter TABLE department_t
-- add column product_sales decimal (18,2) DEFAULT 0;
-- 
-- alter table product_t
-- add constraint fk_dept_id foreign key (department_id) 
-- REFERENCES department_t(department_ID);



