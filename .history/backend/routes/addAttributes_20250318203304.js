const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

router.post('/AddAttributes', (req, res) => {
    const { name, subcategory_id } = req.body;

    console.log("Received request to add attribute with subcategory_id:", subcategory_id);

    if (!name || !subcategory_id) {
        return res.status(400).json({ error: "Missing name or subcategory_id" });
    }

    const checkSubcategoryQuery = "SELECT * FROM subcategories WHERE id = ?";

    db.query(checkSubcategoryQuery, [subcategory_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Error checking subcategory' });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: 'Subcategory not found' });
        }

        const insertAttributeQuery = "INSERT INTO attributes (name, subcategory_id) VALUES (?, ?)";
        
        db.query(insertAttributeQuery, [name, subcategory_id], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: 'Error adding attribute' });
            }
            res.status(201).json({ 
                message: 'Attribute added successfully', 
                attributeId: result.insertId 
            });
        });
    );
});

module.exports = router;
