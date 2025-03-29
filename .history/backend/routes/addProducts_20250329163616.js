// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const promisePool = require("../db/dbconfig"); // Assuming you have the promisePool set up
// const verifyToken = require("../modules/verifyToken.js");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads/"); 
//     },
//     filename: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const upload = multer({
//     storage,
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = /jpeg|jpg|png/;
//       const extname = allowedTypes.test(
//         path.extname(file.originalname).toLowerCase()
//       );
//       const mimetype = allowedTypes.test(file.mimetype);
  
//       if (extname && mimetype) {
//         cb(null, true);
//       } else {
//         cb(new Error("Only images are allowed"));
//       }
//     },
// });



// // Function to process product data
// const processCategoryData = (body) => {
//     const { category_id, subcategory_id, subcategory_item_id } = body;
//     const errors = {};

//     if (!category_id) errors.category = "Category is required.";
//     if (!subcategory_id) errors.subcategory = "Subcategory is required.";

//     const subcategoryItemId = subcategory_item_id && subcategory_item_id !== "" ? subcategory_item_id : null;

//     return { errors, category_id, subcategory_id, subcategoryItemId };
// };

// const processProductData = (body) => {
//     const { title, currency, price, description } = body;
//     const errors = {};

//     if (!title) errors.title = "Title is required.";
//     if (!currency) errors.currency = "Currency is required.";
//     if (!price) errors.price = "Price is required.";
//     if (!description) errors.description = "Description is required.";

//     return { errors, title, currency, price, description };
// };

// const processProductAddress = (body) => {
//     const { country, city, address } = body;
//     const errors = {};

//     if (!country) errors.country = "Country is required.";
//     if (!city) errors.city = "City is required.";

//     return { errors, country, city, address };
// };

// const processUserInfo = (body) => {
//     const { user_firstname, user_lastname, user_email, user_phone } = body;
//     const errors = {};

//     if (!user_firstname) errors.country = "First name is required.";
//     if (!user_lastname) errors.city = "Last name is required.";
//     if (!user_email) errors.city = "Email is required.";
//     if (!user_phone) errors.city = "Phone is required.";
//     return { user_firstname, user_lastname, user_email, user_phone };
// };

// router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
//     const userId = req.userId;
//     console.log("Uploaded Files:", req.files);

//     // Process category and product data
//     const categoryData = processCategoryData(req.body);
//     const productData = processProductData(req.body);
//     const productAddress = processProductAddress(req.body);
//     const userInfo = processUserInfo(req.body);
//     const allErrors = {
//         ...categoryData.errors,
//         ...productData.errors,
//         ...productAddress.errors
//     };

//     if (Object.keys(allErrors).length > 0) {
//         return res.status(400).json({ errors: allErrors });
//     }

//     const connection = await promisePool.getConnection();
//     try {
//         await connection.beginTransaction(); // Start a transaction

//         // Insert product data first
//         const query = `
//             INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, 
//             description,country , city , address,user_firstname ,user_lastname, user_email ,user_phone)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ? , ? , ? ,?,?,?,?,? )
//         `;
        
//         const [result] = await connection.query(query, [
//             userId,
//             categoryData.category_id,
//             categoryData.subcategory_id,
//             categoryData.subcategoryItemId,
//             productData.title,
//             productData.currency,
//             productData.price,
//             productData.description,
//             productAddress.country,
//             productAddress.city,
//             productAddress.address,
//             userInfo.user_firstname,
//             userInfo.user_lastname,
//             userInfo.user_email,
//             userInfo.user_phone
//         ]);
//         console.log(req.body);
//         const productId = result.insertId; // Get the newly created product ID

//         // Handle product images if any
//         if (req.files && req.files.length > 0) {
//             const productImages = req.files.map(file => [productId, userId, `/uploads/${file.filename}`]);

//             // Insert multiple images into the database
//             const imageInsertQuery = "INSERT INTO product_images (product_id, user_id, image_url) VALUES ?";

//             await connection.query(imageInsertQuery, [productImages]);
//         }

//         // Add product attributes (assuming attributes are sent in req.body.attributes)
        
//         if (req.body.attributes && typeof req.body.attributes === 'object') {
//             const attributes = Object.entries(req.body.attributes).map(([attribute_id, value]) => [
//                 productId,
//                 attribute_id,
//                 value,
//             ]);
            
//             const attributeQuery = `
//                 INSERT INTO product_attributes (product_id, attribute_id, value)
//                 VALUES ?
//             `;
//             await connection.query(attributeQuery, [attributes]);
//         }
//         // Commit transaction
//         await connection.commit();
//         res.status(201).json({ success: true, productId });
//     } catch (err) {
//         // If any error occurs, rollback transaction
//         await connection.rollback();
//         console.error("Error adding product:", err);
//         return res.status(500).json({ error: "Error adding product to the database", details: err.message });
//     } finally {
//         connection.release(); // Always release the connection
//     }
// });





module.exports = router;
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



// Function to process product data
const processCategoryData = (body) => {
    const { category_id, subcategory_id, subcategory_item_id } = body;
    const errors = {};

    if (!category_id) errors.category = "Category is required.";
    if (!subcategory_id) errors.subcategory = "Subcategory is required.";

    const subcategoryItemId = subcategory_item_id && subcategory_item_id !== "" ? subcategory_item_id : null;

    return { errors, category_id, subcategory_id, subcategoryItemId };
};

const processProductData = (body) => {
    const { title, currency, price, description } = body;
    const errors = {};

    if (!title) errors.title = "Title is required.";
    if (!currency) errors.currency = "Currency is required.";
    if (!price) errors.price = "Price is required.";
    if (!description) errors.description = "Description is required.";

    return { errors, title, currency, price, description };
};

const processProductAddress = (body) => {
    const { country, city, address } = body;
    const errors = {};

    if (!country) errors.country = "Country is required.";
    if (!city) errors.city = "City is required.";

    return { errors, country, city, address };
};

const processUserInfo = (body) => {
    const { user_firstname, user_lastname, user_email, user_phone } = body;
    const errors = {};

    if (!user_firstname) errors.country = "First name is required.";
    if (!user_lastname) errors.city = "Last name is required.";
    if (!user_email) errors.city = "Email is required.";
    if (!user_phone) errors.city = "Phone is required.";
    return { user_firstname, user_lastname, user_email, user_phone };
};

router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
    const userId = req.userId;
    console.log("Uploaded Files:", req.files);

    // Process category and product data
    const categoryData = processCategoryData(req.body);
    const productData = processProductData(req.body);
    const productAddress = processProductAddress(req.body);
    const userInfo = processUserInfo(req.body);
    const allErrors = {
        ...categoryData.errors,
        ...productData.errors,
        ...productAddress.errors
    };

    if (Object.keys(allErrors).length > 0) {
        return res.status(400).json({ errors: allErrors });
    }

    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction(); // Start a transaction

        // Insert product data first
        const query = `
            INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, 
            description,country , city , address,user_firstname ,user_lastname, user_email ,user_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ? , ? , ? ,?,?,?,?,? )
        `;
        
        const [result] = await connection.query(query, [
            userId,
            categoryData.category_id,
            categoryData.subcategory_id,
            categoryData.subcategoryItemId,
            productData.title,
            productData.currency,
            productData.price,
            productData.description,
            productAddress.country,
            productAddress.city,
            productAddress.address,
            userInfo.user_firstname,
            userInfo.user_lastname,
            userInfo.user_email,
            userInfo.user_phone
        ]);
        console.log(req.body);
        const productId = result.insertId; // Get the newly created product ID

        // Handle product images if any
        if (req.files && req.files.length > 0) {
            const productImages = req.files.map(file => [productId, userId, `/uploads/${file.filename}`]);

            // Insert multiple images into the database
            const imageInsertQuery = "INSERT INTO product_images (product_id, user_id, image_url) VALUES ?";

            await connection.query(imageInsertQuery, [productImages]);
        }

        // Add product attributes (assuming attributes are sent in req.body.attributes)
        
        if (req.body.attributes && typeof req.body.attributes === 'object') {
            const attributes = Object.entries(req.body.attributes).map(([attribute_id, value]) => [
                productId,
                attribute_id,
                value,
            ]);
            
            const attributeQuery = `
                INSERT INTO product_attributes (product_id, attribute_id, value)
                VALUES ?
            `;
            await connection.query(attributeQuery, [attributes]);
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





module.exports = router;
