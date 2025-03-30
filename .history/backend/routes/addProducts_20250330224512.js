

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const promisePool = require("../db/dbconfig");
// const verifyToken = require("../modules/verifyToken.js");

// // Create the uploads directory if it doesn't exist
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer to store files in memory temporarily instead of disk
// // This way we can validate before saving to disk
// const memoryStorage = multer.memoryStorage();
// const upload = multer({
//   storage: memoryStorage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(
//       path.extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed"));
//     }
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   }
// });

// // Validation functions
// const processCategoryData = (body) => {
//   const { category_id, subcategory_id, subcategory_item_id } = body;
//   const errors = {};

//   if (!category_id) errors.category = "Category is required.";
//   if (!subcategory_id) errors.subcategory = "Subcategory is required.";

//   const subcategoryItemId = subcategory_item_id && subcategory_item_id !== "" ? subcategory_item_id : null;

//   return { errors, category_id, subcategory_id, subcategoryItemId };
// };

// const processProductData = (body) => {
//   const { title, currency, price, description } = body;
//   const errors = {};

//   if (!title) errors.title = "Title is required.";
//   if (!currency) errors.currency = "Currency is required.";
//   if (!price) errors.price = "Price is required.";
//   if (!description) errors.description = "Description is required.";

//   return { errors, title, currency, price, description };
// };

// const processProductAddress = (body) => {
//   const { country, city, address } = body;
//   const errors = {};

//   if (!country) errors.country = "Country is required.";
//   if (!city) errors.city = "City is required.";

//   return { errors, country, city, address };
// };

// const processUserInfo = (body) => {
//   const { user_firstname, user_lastname, user_email, user_phone } = body;
//   const errors = {};

//   if (!user_firstname) errors.firstName = "First name is required.";
//   if (!user_lastname) errors.lastName = "Last name is required.";
//   if (!user_email) errors.email = "Email is required.";
//   if (!user_phone) errors.phone = "Phone is required.";
  
//   return { errors, user_firstname, user_lastname, user_email, user_phone };
// };

// // Use Multer to parse the multipart form data, but keep files in memory
// router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
//   const userId = req.userId;
  
//   // Now validate after parsing the form data
//   const categoryData = processCategoryData(req.body);
//   const productData = processProductData(req.body);
//   const productAddress = processProductAddress(req.body);
//   const userInfo = processUserInfo(req.body);
  
//   const allErrors = {
//     ...categoryData.errors,
//     ...productData.errors,
//     ...productAddress.errors,
//     ...userInfo.errors
//   };

//   // If validation fails, return errors
//   if (Object.keys(allErrors).length > 0) {
//     return res.status(400).json({ errors: allErrors });
//   }

//   const connection = await promisePool.getConnection();
//   try {
//     await connection.beginTransaction(); // Start a transaction

//     // Insert product data
//     const query = `
//       INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, 
//       description, country, city, address, user_firstname, user_lastname, user_email, user_phone)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
    
//     const [result] = await connection.query(query, [
//       userId,
//       categoryData.category_id,
//       categoryData.subcategory_id,
//       categoryData.subcategoryItemId,
//       productData.title,
//       productData.currency,
//       productData.price,
//       productData.description,
//       productAddress.country,
//       productAddress.city,
//       productAddress.address,
//       userInfo.user_firstname,
//       userInfo.user_lastname,
//       userInfo.user_email,
//       userInfo.user_phone
//     ]);
    
//     const productId = result.insertId; // Get the newly created product ID

//     // Now save the files to disk and record in database
//     const savedFiles = [];
//     if (req.files && req.files.length > 0) {
//       // Save each file to disk
//       for (const file of req.files) {
//         const filename = `${Date.now()}-${file.originalname}`;
//         const filepath = path.join(uploadDir, filename);
        
//         // Write file to disk
//         await fs.promises.writeFile(filepath, file.buffer);
//         savedFiles.push({
//           originalname: file.originalname,
//           filename: filename,
//           path: filepath,
//           url: `/uploads/${filename}`
//         });
//       }

//       // Insert file records into database
//       const productImages = savedFiles.map(file => [productId, userId, file.url]);
//       const imageInsertQuery = "INSERT INTO product_images (product_id, user_id, image_url) VALUES ?";
//       await connection.query(imageInsertQuery, [productImages]);
//     }

//     // Add product attributes
//     if (req.body.attributes && typeof req.body.attributes === 'object') {
//       const attributes = Object.entries(req.body.attributes).map(([attribute_id, value]) => [
//         productId,
//         attribute_id,
//         value,
//       ]);
      
//       if (attributes.length > 0) {
//         const attributeQuery = `
//           INSERT INTO product_attributes (product_id, attribute_id, value)
//           VALUES ?
//         `;
//         await connection.query(attributeQuery, [attributes]);
//       }
//     }
    
//     // Commit transaction
//     await connection.commit();
//     res.status(201).json({ success: true, productId });
//   } catch (err) {
//     // If any error occurs, rollback transaction
//     await connection.rollback();
//     console.error("Error adding product:", err);
    
//     // No need to delete files as they weren't saved to disk yet
//     return res.status(500).json({ error: "Error adding product to the database", details: err.message });
//   } finally {
//     connection.release(); // Always release the connection
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");

// Create the uploads directory and subdirectories if they don't exist
const uploadDir = "uploads/";
const imagesDir = path.join(uploadDir, "images");
const documentsDir = path.join(uploadDir, "documents");

// Ensure directories exist
[uploadDir, imagesDir, documentsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer to store files in memory temporarily instead of disk
// This way we can validate before saving to disk
const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    // Updated to allow PDF files as well as images
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG) and PDF documents are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (increased to accommodate PDF files)
  }
});

// Validation functions
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

  if (!user_firstname) errors.firstName = "First name is required.";
  if (!user_lastname) errors.lastName = "Last name is required.";
  if (!user_email) errors.email = "Email is required.";
  if (!user_phone) errors.phone = "Phone is required.";
  
  return { errors, user_firstname, user_lastname, user_email, user_phone };
};

// Helper function to determine file type and destination
const getFileTypeAndDestination = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (extension === '.pdf') {
    return {
      type: 'document',
      directory: documentsDir
    };
  } else {
    return {
      type: 'image',
      directory: imagesDir
    };
  }
};

// Use Multer to parse the multipart form data, but keep files in memory
router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
  const userId = req.userId;
  
  // Now validate after parsing the form data
  const categoryData = processCategoryData(req.body);
  const productData = processProductData(req.body);
  const productAddress = processProductAddress(req.body);
  const userInfo = processUserInfo(req.body);
  
  const allErrors = {
    ...categoryData.errors,
    ...productData.errors,
    ...productAddress.errors,
    ...userInfo.errors
  };

  // If validation fails, return errors
  if (Object.keys(allErrors).length > 0) {
    return res.status(400).json({ errors: allErrors });
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction(); // Start a transaction

    // Insert product data
    const query = `
      INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, 
      description, country, city, address, user_firstname, user_lastname, user_email, user_phone , status_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
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
      userInfo.user_phone,
        req.body.status_type || 'published'
    ]);
    
    const productId = result.insertId; // Get the newly created product ID

    // Now save the files to disk and record in database
    const savedFiles = [];
    if (req.files && req.files.length > 0) {
      // Save each file to disk
      for (const file of req.files) {
        // Determine file type and destination directory
        const { type, directory } = getFileTypeAndDestination(file);
        
        // Create a safe filename with timestamp to avoid collisions
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        const filepath = path.join(directory, filename);
        
        // Write file to disk
        await fs.promises.writeFile(filepath, file.buffer);
        
        // URL format will include the file type for easier frontend handling
        const relativePath = path.join(type === 'document' ? 'documents' : 'images', filename);
        const fileUrl = `/uploads/${relativePath}`;
        
        savedFiles.push({
          originalname: file.originalname,
          filename: filename,
          path: filepath,
          url: fileUrl,
          type: type
        });
      }

      // Insert file records into database - still using the existing product_images table
      const productFiles = savedFiles.map(file => [productId, userId, file.url]);
      const fileInsertQuery = "INSERT INTO product_images (product_id, user_id, image_url) VALUES ?";
      await connection.query(fileInsertQuery, [productFiles]);
    }

    // Add product attributes
    if (req.body.attributes && typeof req.body.attributes === 'object') {
      const attributes = Object.entries(req.body.attributes).map(([attribute_id, value]) => [
        productId,
        attribute_id,
        value,
      ]);
      
      if (attributes.length > 0) {
        const attributeQuery = `
          INSERT INTO product_attributes (product_id, attribute_id, value)
          VALUES ?
        `;
        await connection.query(attributeQuery, [attributes]);
      }
    }
    
    // Commit transaction
    await connection.commit();
    
    // Return a detailed response with file types for frontend handling
    const fileDetails = savedFiles.map(file => ({
      url: file.url,
      type: file.type,
      name: file.originalname
    }));
    
    res.status(201).json({ 
      success: true, 
      productId,
      files: fileDetails
    });
  } catch (err) {
    // If any error occurs, rollback transaction
    await connection.rollback();
    console.error("Error adding product:", err);
    
    // No need to delete files as they weren't saved to disk yet (they're in memory)
    return res.status(500).json({ error: "Error adding product to the database", details: err.message });
  } finally {
    connection.release(); // Always release the connection
  }
});

module.exports = router;