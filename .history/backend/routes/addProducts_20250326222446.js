const express = require("express");
const router = express.Router();
const db = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");
router.post("/add-product", verifyToken,async (req, res) => {
    const { category_id, subcategory_id, subcategory_item_id, title } = req.body;

    if (!category_id || !subcategory_id || !subcategory_item_id || !title) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        INSERT INTO products (category_id, subcategory_id, subcategory_item_id, title) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [category_id, subcategory_id, subcategory_item_id, title], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error adding product to the database" });
        }
        res.status(201).json({ message: "Product added successfully", product_id: result.insertId });
    });
});

module.exports = router;