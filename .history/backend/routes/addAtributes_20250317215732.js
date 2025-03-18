const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Attribute
router.post("/attribute", async (req, res) => {
    const { name, subcategory_id, type, unit, is_required, options } = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO attributes (name, subcategory_id, type, unit, is_required, options) VALUES (?, ?, ?, ?, ?, ?)",
            [name, subcategory_id || null, type, unit, is_required, options || null]
        );
        res.json({ success: true, attributeId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Attributes for a Subcategory
router.get("/attributes/:subcategory_id", async (req, res) => {
    const { subcategory_id } = req.params;
    try {
        const [attributes] = await db.execute(
            "SELECT * FROM attributes WHERE subcategory_id = ?",
            [subcategory_id]
        );
        res.json(attributes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
