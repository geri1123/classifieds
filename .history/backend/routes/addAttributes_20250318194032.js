const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Attribute for Subcategory without parent_id
router.post('/AddAttributes', (req, res) => {
    const { name, subcategory_id } = req.body;

    // Step 1: Check if subcategory_id corresponds to a subcategory with parent_id = NULL
    const checkSubcategoryQuery = "SELECT * FROM subcategories WHERE id = ? AND parent_id IS NULL";

    db.query(checkSubcategoryQuery, [subcategory_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error checking subcategory' });
        }

        if (result.length === 0) {
            // If no subcategory is found with parent_id = NULL
            return res.status(400).json({ error: 'Subcategory not found or does not have a parent' });
        }

        // Step 2: Insert attribute for the subcategory
        const insertAttributeQuery = "INSERT INTO attributes (name, subcategory_id) VALUES (?, ?)";
        
        db.query(insertAttributeQuery, [name, subcategory_id], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error adding attribute' });
            }
            res.status(201).json({ message: 'Attribute added successfully' });
        });
    });
});


module.exports = router;
