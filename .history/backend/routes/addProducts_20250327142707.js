const express = require("express");
const router = express.Router();
const db = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");

const processCategoryData = (body) => {
    const { category_id, subcategory_id, subcategory_item_id } = body;

    if (!category_id || !subcategory_id) {
        return { error: "Category and Subcategory are required." };
    }

    // Convert empty subcategory_item_id to NULL
    const subcategoryItemId = subcategory_item_id && subcategory_item_id !== "" ? subcategory_item_id : null;

    return { category_id, subcategory_id, subcategoryItemId };
};

// Function to process product data
const processProductData = (body) => {
    const { title } = body;

    if (!title) {
        return { error: "Title is required." };
    }

    return { title };
};

router.post("/add-product", verifyToken, async (req, res) => {
    const userId = req.userId;

    // Process category, subcategory, and subcategory item
    const categoryData = processCategoryData(req.body);
    if (categoryData.error) {
        return res.status(400).json({ error: categoryData.error });
    }

    // Process product title
    const productData = processProductData(req.body);
    if (productData.error) {
        return res.status(400).json({ error: productData.error });
    }

    const query = `
        INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title , currency) 
        VALUES (?, ?, ?, ?, ?,?)
    `;

    db.query(query, [userId, categoryData.category_id, categoryData.subcategory_id, categoryData.subcategoryItemId, productData.title], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Error adding product to the database" });
        }
        res.status(201).json({ message: "Product added successfully", product_id: result.insertId });
    });
});



module.exports = router;



// router.post("/add-product", verifyToken, async (req, res) => {
//     const userId = req.userId;

//     const { category_id, subcategory_id, subcategory_item_id , title } = req.body;

//     if (!category_id || !subcategory_id || !title) {
//         return res.status(400).json({ error: "All fields are required." });
//     }
//     const subcategoryItemId = subcategory_item_id && subcategory_item_id !== "" ? subcategory_item_id : null;
//     const query = `
//         INSERT INTO products (user_id,category_id, subcategory_id, subcategories_items_id , title) 
//         VALUES (?, ?, ?, ?,?)
//     `;

//     db.query(query, [userId,category_id, subcategory_id, subcategoryItemId, title], (err, result) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ error: "Error adding product to the database" });
//         }
//         res.status(201).json({ message: "Product added successfully", product_id: result.insertId });
//     });
// });
