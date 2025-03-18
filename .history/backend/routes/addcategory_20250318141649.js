const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Category
router.post("/category", async (req, res) => {
    const { name, parent_id } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const selectcat = "SELECT * FROM categories WHERE name = ?";
    
    // Check if category already exists
    db.query(selectcat, [name], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.length > 0) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        // If category doesn't exist, insert it
        const dbCategory = "INSERT INTO categories (name, parent_id) VALUES (?, ?)";

        db.query(dbCategory, [name, parent_id || null], (err, result) => {
            if (err) {
                console.error("Error adding category:", err);
                return res.status(500).json({ error: 'Error adding category' });
            }

            res.status(201).json({ 
                message: 'Category added successfully', 
                categoryId: result.insertId 
            });
        });
    });
});
router.get("/categories", async (req, res) => {
    const query = "SELECT * FROM categories"; // Renamed from `db` to `query`

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error fetching categories" });
        }
        res.json(result);
    });
});

// Add Subcategory
router.post("/subcategory", async (req, res) => {
    const { name, category_id } = req.body;
   const dbsub=""INSERT INTO subcategories (name, category_id) VALUES (?, ?)";
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
