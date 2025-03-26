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
    const { name, category_id} = req.body;

    if (!name || (!category_id && !parent_id)) {
        return res.status(400).json({ error: "Subcategory name and either category or parent subcategory are required" });
    }

    // Check if subcategory already exists
    const checkQuery = "SELECT * FROM subcategories WHERE name = ? AND category_id = ? ";
    db.query(checkQuery, [name, category_id], (err, result) => {
        if (err) {
            console.error("Error checking subcategory:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: "Subcategory already exists" });
        }

        // Insert new subcategory
        const insertQuery = "INSERT INTO subcategories (name, category_id) VALUES (?, ?)";
        db.query(insertQuery, [name, category_id, parent_id], (err, result) => {
            if (err) {
                console.error("Error adding subcategory:", err);
                return res.status(500).json({ error: "Error adding subcategory" });
            }
            res.status(201).json({
                message: "Subcategory added successfully",
                subcategoryId: result.insertId,
            });
        });
    });
});

router.get("/subcategories", async (req, res) => {
    const query = "SELECT * FROM subcategories";

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error fetching subcategories" });
        }
        res.json(result);
    });
});


// Get Subcategories by Category
router.get("/categories/:category_id/subcategories", async (req, res) => {
    const { category_id } = req.params;
    const query = "SELECT id, name, parent_id FROM subcategories WHERE category_id = ? OR parent_id IS NOT NULL";
    
    db.query(query, [category_id], (err, result) => {
        if (err) {
            console.error("Error fetching subcategories:", err);
            return res.status(500).json({ error: "Error fetching subcategories" });
        }
        res.json(result);
    });
});

module.exports = router;
