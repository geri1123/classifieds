const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Category
router.post("/category", async (req, res) => {
    const { name, parent_id } = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO categories (name, parent_id) VALUES (?, ?)",
            [name, parent_id || null]
        );
        res.json({ success: true, categoryId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Subcategory
router.post("/subcategory", async (req, res) => {
    const { name, category_id } = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
            [name, category_id]
        );
        res.json({ success: true, subcategoryId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Categories with Subcategories
router.get("/categories", async (req, res) => {
    try {
        const [categories] = await db.execute(
            "SELECT c.id, c.name, s.id AS subcategory_id, s.name AS subcategory_name FROM categories c LEFT JOIN subcategories s ON c.id = s.category_id"
        );
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
