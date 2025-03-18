const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Attribute for Subcategory without parent_id
router.post("/attribute", async (req, res) => {
    const { name, subcategory_id } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Attribute name is required' });
    }

    const selectattr = "SELECT * FROM attributes WHERE name = ?";

    // Check if attribute already exists
    db.query(selectattr, [name], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Attribute already exists' });
        }

        // If attribute doesn't exist, insert it
        const dbAttribute = "INSERT INTO attributes (name, subcategory_id) VALUES (?, ?)";

        db.query(dbAttribute, [name, subcategory_id || null], (err, result) => {
            if (err) {
                console.error("Error adding attribute:", err);
                return res.status(500).json({ error: 'Error adding attribute' });
            }

            res.status(201).json({ 
                message: 'Attribute added successfully', 
                attributeId: result.insertId 
            });
        });
    });
});

module.exports = router;
