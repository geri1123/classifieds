const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const promisePool = require("../db/dbconfig"); // Assuming you have the promisePool set up
const verifyToken = require("../modules/verifyToken.js");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png/;
      const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = allowedTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed"));
      }
    },
});

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
    const { title , currency , price , description} = body;

    if (!title ) {
        return { error: "Title is required." };
    }
    if (!currency ) {
        return { error: "Currency is required." };
    }
    if (!price ) {
        return { error: "Price is required." };
    }
    if (!description ) {
        return { error: "Description is required." };
    }
    return { title , currency , price , description};
};
router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
    const userId = req.userId;
    console.log("Uploaded Files:", req.files);

    // Process category and product data
    const categoryData = processCategoryData(req.body);
    const productData = processProductData(req.body);

    if (categoryData.error || productData.error) {
        return res.status(400).json({ error: categoryData.error || productData.error });
    }

    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction(); // Start a transaction

        // Insert product data first
        const query = `
            INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await connection.query(query, [
            userId,
            categoryData.category_id,
            categoryData.subcategory_id,
            categoryData.subcategoryItemId,
            productData.title,
            productData.currency,
            productData.price,
            productData.description
        ]);

        const productId = result.insertId; // Get the newly created product ID

        // Check if files are uploaded
        if (req.files && req.files.length > 0) {
            // Map image URLs
            const productImages = req.files.map(file => [productId, userId, `/uploads/${file.filename}`]);

            // Insert multiple images into the database
            const imageInsertQuery = "INSERT INTO product_images (product_id, user_id, image_url) VALUES ?";

            await connection.query(imageInsertQuery, [productImages]);
        }

        // Commit transaction
        await connection.commit();
        res.status(201).json({ success: true, productId });
    } catch (err) {
        // If any error occurs, rollback transaction
        await connection.rollback();
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Error adding product to the database", details: err.message });
    } finally {
        connection.release(); // Always release the connection
    }
});

// router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
//     const userId = req.userId;
//     console.log("Uploaded Files:", req.files);

//     // Process category and product data
//     const categoryData = processCategoryData(req.body);
//     const productData = processProductData(req.body);

//     if (categoryData.error || productData.error) {
//         return res.status(400).json({ error: categoryData.error || productData.error });
//     }

//     try {
//         // Insert product data first
//         const query = `
//             INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, description) 
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
        
//         const [result] = await promisePool.query(query, [
//             userId,
//             categoryData.category_id,
//             categoryData.subcategory_id,
//             categoryData.subcategoryItemId,
//             productData.title,
//             productData.currency,
//             productData.price,
//             productData.description
//         ]);

//         const productId = result.insertId; // Get the newly created product ID

//         // Check if files are uploaded
//         if (req.files && req.files.length > 0) {
//             // Map image URLs
//             const productImages = req.files.map(file => [productId, userId, `/uploads/${file.filename}`]);

//             // Insert multiple images into the database
//             const imageInsertQuery = "INSERT INTO product_images (product_id, user_id, image_url) VALUES ?";
            
//             await promisePool.query(imageInsertQuery, [productImages]);

//             res.status(201).json({ success: true, productId });
//         } else {
//             res.status(201).json({ success: true, productId });
//         }
//     } catch (err) {
//         console.error("Error adding product:", err);
//         return res.status(500).json({ error: "Error adding product to the database", details: err.message });
//     }
// });

module.exports = router;

// router.post("/add-product", verifyToken, async (req, res) => {
//     const userId = req.userId;

//     // Process category, subcategory, and subcategory item
//     const categoryData = processCategoryData(req.body);
//     if (categoryData.error) {
//         return res.status(400).json({ error: categoryData.error });
//     }

//     // Process product title
//     const productData = processProductData(req.body);
//     if (productData.error) {
//         return res.status(400).json({ error: productData.error });
//     }

//     const query = `
//         INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title , currency ,price , description) 
//         VALUES (?, ?, ?, ?, ?,? ,? , ?)
//     `;

//     db.query(query, [userId, categoryData.category_id, categoryData.subcategory_id, categoryData.subcategoryItemId, productData.title , productData.currency , productData.price , productData.description], (err, result) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ error: "Error adding product to the database" });
//         }
//         res.status(201).json({ message: "Product added successfully", product_id: result.insertId });
//     });
// });

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
