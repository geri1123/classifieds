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
        const [categories] = await db.execute("SELECT id, name FROM categories");
        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/categories/:category_id/subcategories", async (req, res) => {
    const { category_id } = req.params;
    try {
        const [subcategories] = await db.execute(
            "SELECT id, name FROM subcategories WHERE category_id = ?",
            [category_id]
        );
        res.json(subcategories);
    } catch (err) {
        console.error("Error fetching subcategories:", err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
