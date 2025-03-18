const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Attribute for Subcategory without parent_id
router.post("/subcategory/:subcategory_id/attribute", async (req, res) => {
    const { subcategory_id } = req.params;
    const { name, value } = req.body;

    if (!name || !value) {
        return res.status(400).json({ error: 'Attribute name and value are required' });
    }

    // First, check if the subcategory has a NULL parent_id
    const checkSubcategoryQuery = "SELECT * FROM subcategories WHERE id = ? AND parent_id IS NULL";
    
    db.query(checkSubcategoryQuery, [subcategory_id], (err, result) => {
        if (err) {
            console.error("Error checking subcategory:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: "Subcategory must not have a parent_id" });
        }

        // Now insert the attribute for this subcategory
        const insertAttributeQuery = "INSERT INTO attributes (subcategory_id, name, value) VALUES (?, ?, ?)";
        db.query(insertAttributeQuery, [subcategory_id, name, value], (err, result) => {
            if (err) {
                console.error("Error adding attribute:", err);
                return res.status(500).json({ error: "Error adding attribute" });
            }

            res.status(201).json({
                message: "Attribute added successfully",
                attributeId: result.insertId,
            });
        });
    });
});


module.exports = router;
