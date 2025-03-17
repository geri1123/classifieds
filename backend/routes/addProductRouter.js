const express = require("express");
const db = require("../db/dbconfig"); // Import database connection

const router = express.Router();
router.post('/add-category', (req, res) => {
    console.log("Received body:", req.body);  // Log the request body to see what data is coming through
    const { name, parent_id } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const query = `INSERT INTO categories (name, parent_id) VALUES (?, ?)`;
    
    db.query(query, [name, parent_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding category' });
        }
        res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
    });
});

router.post('/add-subcategory', (req, res) => {
    const { category_id, name } = req.body;

    const query = `INSERT INTO subcategories (category_id, name) VALUES (?, ?)`;

    db.query(query, [category_id, name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding subcategory' });
        }
        res.status(201).json({ message: 'Subcategory added successfully', subcategoryId: result.insertId });
    });
});
router.post('/add-attribute', (req, res) => {
    const { name, category_id, subcategory_id } = req.body;

    const query = `INSERT INTO attributes (name, category_id, subcategory_id) VALUES (?, ?, ?)`;

    db.query(query, [name, category_id, subcategory_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding attribute' });
        }
        res.status(201).json({ message: 'Attribute added successfully', attributeId: result.insertId });
    });
});
router.post('/add-product', (req, res) => {
    const { user_id, category_id, subcategory_id, title, description, price } = req.body;

    const query = `INSERT INTO products (user_id, category_id, subcategory_id, title, description, price) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [user_id, category_id, subcategory_id, title, description, price], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding product' });
        }

        const productId = result.insertId;

        // Insert product attributes like "Blue Seats" and other features
        const attributeValues = [
            [productId, 1, 'Blue Seats'],  // Assuming attribute ID 1 is "Seats" 
            [productId, 2, '4']  // Assuming attribute ID 2 is "Seats Count"
        ];

        const attributeQuery = `INSERT INTO product_attributes (product_id, attribute_id, value) VALUES ?`;

        db.query(attributeQuery, [attributeValues], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error adding product attributes' });
            }
            res.status(201).json({ message: 'Product added successfully', productId });
        });
    });
});
module.exports = router;