const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig"); // Assuming promisePool is set up correctly

// Add Category
router.post("/category", async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const selectcat = "SELECT * FROM categories WHERE name = ?";
    
    try {
        const [result] = await promisePool.query(selectcat, [name]);

        if (result.length > 0) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        // If category doesn't exist, insert it
        const dbCategory = "INSERT INTO categories (name) VALUES (?)";  // Only inserting name
        const [insertResult] = await promisePool.query(dbCategory, [name]);

        res.status(201).json({ 
            message: 'Category added successfully', 
            categoryId: insertResult.insertId 
        });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Database error' });
    }
});

// Get all Categories
router.get("/categories", async (req, res) => {
    const query = "SELECT * FROM categories";

    try {
        const [result] = await promisePool.query(query);
        res.json(result);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error fetching categories" });
    }
});

// Add Subcategory
router.post("/subcategory", async (req, res) => {
    const { name, category_id } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({ error: "Subcategory name and category are required!" });
    }

    const checkQuery = "SELECT * FROM subcategories WHERE name = ? AND category_id = ?";

    try {
        const [result] = await promisePool.query(checkQuery, [name, category_id]);

        if (result.length > 0) {
            return res.status(400).json({ error: "Subcategory already exists" });
        }

        // Insert new subcategory
        const insertQuery = "INSERT INTO subcategories (name, category_id) VALUES (?, ?)";
        const [insertResult] = await promisePool.query(insertQuery, [name, category_id]);

        res.status(201).json({
            message: "Subcategory added successfully",
            subcategoryId: insertResult.insertId,
        });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error adding subcategory" });
    }
});

// Get all Subcategories
// router.get("/subcategories", async (req, res) => {
//     const query = "SELECT * FROM subcategories";

//     try {
//         const [result] = await promisePool.query(query);
//         res.json(result);
//     } catch (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ error: "Error fetching subcategories" });
//     }
// });
router.get("/subcategories", async (req, res) => {
    const { categoryId } = req.query;
    const query = "SELECT * FROM subcategories WHERE category_id = ?";
    
    try {
        const [result] = await promisePool.query(query, [categoryId]);
        res.json(result);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error fetching subcategories" });
    }
});
// Add Subcategory Item
router.post("/subcategory-item", async (req, res) => {
    const { name, subcategory_id } = req.body;

    if (!name || !subcategory_id) {
        return res.status(400).json({ error: "Subcategory item name and subcategory are required!" });
    }

    const checkQuery = "SELECT * FROM subcategories_items WHERE name = ? AND subcategory_id = ?";

    try {
        const [result] = await promisePool.query(checkQuery, [name, subcategory_id]);

        if (result.length > 0) {
            return res.status(400).json({ error: "Subcategory item already exists" });
        }

        // Insert new subcategory item
        const insertQuery = "INSERT INTO subcategories_items (name, subcategory_id) VALUES (?, ?)";
        const [insertResult] = await promisePool.query(insertQuery, [name, subcategory_id]);

        res.status(201).json({
            message: "Subcategory item added successfully",
            subcategoryItemId: insertResult.insertId,
        });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error adding subcategory item" });
    }
});

// Get all Subcategory Items
router.get("/subcategory-items", async (req, res) => {
    const query = "SELECT * FROM subcategories_items";

    try {
        const [result] = await promisePool.query(query);
        res.json(result);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error fetching subcategory items" });
    }
});

// Get Subcategory Items by Subcategory ID
router.get("/subcategory-items/:subcategory_id", async (req, res) => {
    const { subcategory_id } = req.params;
    const query = "SELECT * FROM subcategories_items WHERE subcategory_id = ?";

    try {
        const [result] = await promisePool.query(query, [subcategory_id]);
        res.json(result);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error fetching subcategory items" });
    }
});

module.exports = router;
