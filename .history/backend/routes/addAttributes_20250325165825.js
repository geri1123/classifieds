const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

router.post('/addCategoryAttribute', (req, res) => {
    const { attribute_name, category_id, attribute_type } = req.body;

    if (!attribute_name || !category_id || !attribute_type) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const insertAttributeQuery = `
        INSERT INTO category_attributes (attribute_name, category_id, attribute_type)
        VALUES (?, ?, ?)
    `;

    db.query(insertAttributeQuery, [attribute_name, category_id, attribute_type], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error adding category attribute" });
        }
        res.status(201).json({
            message: "Category attribute added successfully",
            attributeId: result.insertId,
        });
    });
});

module.exports = router;