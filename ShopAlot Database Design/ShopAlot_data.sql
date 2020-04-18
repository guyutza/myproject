DROP DATABASE IF EXISTS ShopAlot;
CREATE DATABASE ShopAlot;
USE ShopAlot;


-- Vehicles
CREATE TABLE Vehicles (
state CHAR(2),
license_plate VARCHAR(7),
year CHAR(4),
model VARCHAR(20),
make VARCHAR(20) NOT NULL,
color VARCHAR(20) NOT NULL,
PRIMARY KEY(state, license_plate)
);


-- Users
CREATE TABLE User(
email VARCHAR(40) NOT NULL,
user_id INTEGER,
first_name VARCHAR(40) NOT NULL,
last_name VARCHAR(40) NOT NULL,
PRIMARY KEY(user_id)
);

-- phone
CREATE TABLE Phone(
user_id INTEGER,
type ENUM("home","work","mobile") NOT NULL,
number VARCHAR(40) NOT NULL,
PRIMARY KEY(user_id, type, number),
FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Shoppers
CREATE TABLE Shoppers(
user_id INTEGER,
capacity INTEGER,
PRIMARY KEY(user_id),
FOREIGN KEY(user_id) REFERENCES User(user_id)
);

-- Customers
CREATE TABLE Customers(
user_id INTEGER,
PRIMARY KEY(user_id),
FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Stores
CREATE TABLE Stores(
store_id INTEGER,
name VARCHAR(40) NOT NULL,
phone VARCHAR(40) NOT NULL,
address_city VARCHAR(40) NOT NULL,
address_street VARCHAR(40) NOT NULL,
address_zip_code VARCHAR(10) NOT NULL,
PRIMARY KEY(store_id)
);

-- Stores Categories
CREATE TABLE Categories(
store_id INTEGER,
category VARCHAR(20) NOT NULL,
PRIMARY KEY(store_id),
FOREIGN KEY(store_id) REFERENCES Stores(store_id) ON DELETE CASCADE
);

-- Products
CREATE TABLE Products(
product_id INTEGER,
category VARCHAR(20) NOT NULL,
name VARCHAR(40) NOT NULL,
description VARCHAR(200) NOT NULL,
list_price VARCHAR(20) NOT NULL,
PRIMARY KEY(product_id)
);

-- Orders
CREATE TABLE Orders(
order_id INTEGER,
total_price VARCHAR(20),
PRIMARY KEY(order_id)
);

-- OrderItems
CREATE TABLE OrderItems(
item_id INTEGER,
qty INTEGER NOT NULL,
selling_price VARCHAR(20) NOT NULL,
order_id INTEGER NOT NULL,
PRIMARY KEY(item_id),
FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

--
-- Relations
--

-- CUSTOMERS OWN VEHICLES
CREATE TABLE Own(
state CHAR(2),
license_plate VARCHAR(7),
user_id INTEGER,
PRIMARY KEY(user_id, state, license_plate),
FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
FOREIGN KEY(state, license_plate) REFERENCES Vehicles(state, license_plate) ON DELETE CASCADE
);

-- Shoppers Work For Stores
CREATE TABLE Work_for(
user_id INTEGER,
store_id INTEGER,
PRIMARY KEY(user_id, store_id),
FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
FOREIGN KEY(store_id) REFERENCES Stores(store_id) ON DELETE CASCADE
);

-- Products Stocked By Stores
CREATE TABLE Stocked_by(
product_id INTEGER,
store_id INTEGER,
qty INTEGER NOT NULL,
PRIMARY KEY(product_id, store_id),
FOREIGN KEY(product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
FOREIGN KEY(store_id) REFERENCES Stores(store_id) ON DELETE CASCADE
);

-- Products associated OrderItems
CREATE TABLE OrderItems_Associated(
product_id INTEGER NOT NULL,
item_id INTEGER,
PRIMARY KEY(item_id),
FOREIGN KEY(product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
FOREIGN KEY(item_id) REFERENCES OrderItems(item_id) ON DELETE CASCADE
);

-- Orders Contain OrderItems
CREATE TABLE Contain(
order_id INTEGER NOT NULL,
item_id INTEGER,
PRIMARY KEY(item_id),
FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
FOREIGN KEY(item_id) REFERENCES OrderItems(item_id) ON DELETE CASCADE
);

-- Orders For Stores
CREATE TABLE For_stores(
order_id INTEGER,
store_id INTEGER NOT NULL,
PRIMARY KEY(store_id), 
FOREIGN KEY(store_id) REFERENCES Stores(store_id) ON DELETE CASCADE,
FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- Vehicles Associated Orders
CREATE TABLE Vehicles_Associated(
state CHAR(2) NOT NULL,
license_plate VARCHAR(7) NOT NULL,
order_id INTEGER, 
PRIMARY KEY(order_id),
FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
FOREIGN KEY(state,license_plate) REFERENCES Vehicles(state,license_plate) ON DELETE CASCADE
);

-- Shoppers fulfill orders
CREATE TABLE Fulfill(
user_id INTEGER NOT NULL,
order_id INTEGER,
timestamp DATETIME NOT NULL,
PRIMARY KEY(order_id),
FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE,
FOREIGN KEY(order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- Customers place orders
CREATE TABLE Place(
user_id INTEGER NOT NULL,
order_id INTEGER,
time_placed DATETIME NOT NULL,
pickup_time DATETIME,
PRIMARY KEY(order_id),
FOREIGN KEY(user_id) REFERENCES Customers(user_id) ON DELETE CASCADE
);

-- Customers can be friends with customers
CREATE TABLE Friends_with(
user_id INTEGER,
user_id2 INTEGER,
PRIMARY KEY(user_id), 
FOREIGN KEY(user_id) REFERENCES Customers(user_id) ON DELETE CASCADE,
FOREIGN KEY(user_id2) REFERENCES Customers(user_id) ON DELETE CASCADE
);
