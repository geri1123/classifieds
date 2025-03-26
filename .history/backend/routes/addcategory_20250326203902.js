const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Category
router.post("/category", async (req, res) => {
    const { name } = req.body;

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
        const dbCategory = "INSERT INTO categories (name) VALUES (?)";  // Only inserting name

        db.query(dbCategory, [name], (err, result) => {
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
        return res.status(400).json({ error: "Subcategory name and category are required !  " });
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
        db.query(insertQuery, [name, category_id], (err, result) => {
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

router.post("/subcategory-item", async (req, res) => {
    const { name, subcategory_id } = req.body;

    if (!name || !subcategory_id) {
        return res.status(400).json({ error: "Subcategory item name and subcategory are required!" });
    }

    // Check if the item already exists
    const checkQuery = "SELECT * FROM subcategories_items WHERE name = ? AND subcategory_id = ?";
    db.query(checkQuery, [name, subcategory_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length > 0) {
            return res.status(400).json({ error: "Subcategory item already exists" });
        }

        // Insert new subcategory item
        const insertQuery = "INSERT INTO subcategories_items (name, subcategory_id) VALUES (?, ?)";
        db.query(insertQuery, [name, subcategory_id], (err, result) => {
            if (err) {
                console.error("Error adding subcategory item:", err);
                return res.status(500).json({ error: "Error adding subcategory item" });
            }
            res.status(201).json({
                message: "Subcategory item added successfully",
                subcategoryItemId: result.insertId,
            });
        });
    });
});

// Fetch all subcategory items
router.get("/subcategory-items", async (req, res) => {
    const query = "SELECT * FROM subcategories_items";

    db.query(query, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error fetching subcategory items" });
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
