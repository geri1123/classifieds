const mysql = require("mysql2");

const db = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD || "", 
   database: process.env.DB_NAME,
});

// Check connection
db.connect((err) => {
   if (err) {
       console.log("Error connecting to MySQL:", err);
   } else {
       console.log("Connected to MySQL database.");
   }
});

module.exports = db; 
//  module.exports=db;
//  USE marketplace;

// -- Users table
// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     first_name VARCHAR(100),
//     last_name VARCHAR(100),
//     password VARCHAR(100) NOT NULL
// );

// -- Categories table
// CREATE TABLE categories (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(50) NOT NULL UNIQUE,
//     parent_id INT DEFAULT NULL,
//     FOREIGN KEY (parent_id) REFERENCES categories(id)
// );

// -- Subcategories table
// CREATE TABLE subcategories (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     category_id INT,
//     name VARCHAR(50) NOT NULL,
//     FOREIGN KEY (category_id) REFERENCES categories(id)
// ALTER TABLE subcategories ADD COLUMN parent_id INT DEFAULT NULL;
// ALTER TABLE subcategories ADD FOREIGN KEY (parent_id) REFERENCES subcategories(id);
// );

// -- Products table
// CREATE TABLE products (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT,
//     category_id INT,
//     subcategory_id INT,
//     title VARCHAR(100) NOT NULL,
//     description TEXT,
//     price DECIMAL(10, 2),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (category_id) REFERENCES categories(id),
//     FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
// );

// -- Attributes table
// CREATE TABLE attributes (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(50) NOT NULL,
//     category_id INT,
//     subcategory_id INT,
//     FOREIGN KEY (category_id) REFERENCES categories(id),
//     FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
// );

// -- Product Attributes table (many-to-many relationship)
// CREATE TABLE product_attributes (
//     product_id INT,
//     attribute_id INT,
//     value VARCHAR(100),
//     PRIMARY KEY (product_id, attribute_id),
//     FOREIGN KEY (product_id) REFERENCES products(id),
//     FOREIGN KEY (attribute_id) REFERENCES attributes(id)
// );

// -- Populate categories
// INSERT INTO categories (name) VALUES ('Motors'), ('Property'), ('Services'), ('Jobs');

// -- Populate subcategories for Motors
// INSERT INTO categories (name, parent_id) VALUES ('Boats', 1), ('Cars', 1), ('Accessories', 1), ('Motorbike', 1), ('Trucks', 1);

// -- Populate subcategories for Cars
// INSERT INTO subcategories (category_id, name) VALUES (2, 'Sedan'), (2, 'SUV'), (2, 'Hatchback');

// -- Populate subcategories for Boats
// INSERT INTO subcategories (category_id, name) VALUES (1, 'Fishing Boat'), (1, 'House Boat');

// -- Populate subcategories for Jobs
// INSERT INTO categories (name, parent_id) VALUES ('Vacancies', 4);
// INSERT INTO subcategories (category_id, name) VALUES (7, 'Administrative Assistant'), (7, 'Receptionist'), (7, 'Data Entry Clerk'), (7, 'Office Manager'), (7, 'Executive Assistant');

// -- Populate subcategories for Property
// INSERT INTO categories (name, parent_id) VALUES ('Houses', 2), ('Commercial', 2), ('Land', 2);
// INSERT INTO subcategories (category_id, name) VALUES (8, 'Single Family'), (8, 'Multi Family');

// -- Populate attributes for each category and subcategory
// INSERT INTO attributes (name, category_id, subcategory_id) VALUES 
// ('Seats', 1, 2), -- Cars
// ('Color', 1, 2), -- Cars
// ('Fuel Type', 1, 2), -- Cars
// ('Build Year', 1, 2), -- Cars
// ('Rooms', 2, 8), -- Houses
// ('Bathrooms', 2, 8), -- Houses
// ('Build Year', 2, 8), -- Houses
// ('Square Footage', 2, 8), -- Houses
// ('Position', 4, 7), -- Jobs
// ('Salary', 4, 7); -- Jobs

// -- Example of product with attributes
// -- INSERT INTO products (user_id, category_id, subcategory_id, title, description, price) VALUES (1, 2, 8, 'Beautiful Family House', 'A lovely single-family home with 3 rooms and 2 bathrooms.', 250000);
// -- INSERT INTO product_attributes (product_id, attribu