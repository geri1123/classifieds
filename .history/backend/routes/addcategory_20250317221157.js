const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

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
