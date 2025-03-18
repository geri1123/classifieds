const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Category
router.post("/category", async (req, res) => {
    const { name, parent_id } = req.body;
if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
}

 const dbCategory="INSERT INTO categories (name, parent_id) VALUES (?, ?)";
 db.query(dbCategory, [name, parent_id || null], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error adding category' });
        }
        res.status(201).json({ message: 'Category added successfully', categoryId: result.insertId });
    });
});

// Add Subcategory
router.post("/subcategory", async (req, res) => {
    const { name, category_id } = req.body;
    try {
        const [result] = await db.query(
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
        const [categories] = await db.query("SELECT id, name FROM categories");
        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get Subcategories by Category
router.get("/categories/:category_id/subcategories", async (req, res) => {
    const { category_id } = req.params;
    try {
        const [subcategories] = await db.query(
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
