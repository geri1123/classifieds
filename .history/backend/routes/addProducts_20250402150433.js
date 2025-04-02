
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");

Create the uploads directory and subdirectories if they don't exist
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
  // if (!user_phone) errors.phone = "Phone is required.";
  
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


router.post("/add-product", verifyToken, upload.array("product_img", 20), async (req, res) => {
  const userId = req.userId;
  const io = req.app.get("socketio"); // Get Socket.io instance

  // Validate form data
  const categoryData = processCategoryData(req.body);
  const productData = processProductData(req.body);
  const productAddress = processProductAddress(req.body);
  const userInfo = processUserInfo(req.body);

  const allErrors = {
    ...categoryData.errors,
    ...productData.errors,
    ...productAddress.errors,
    ...userInfo.errors,
  };

  if (Object.keys(allErrors).length > 0) {
    return res.status(400).json({ errors: allErrors });
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction(); // Start a transaction

    // Determine product status
    const statusType = req.body.status_type || "published";

    // Insert product data
    const query = `
      INSERT INTO products (user_id, category_id, subcategory_id, subcategories_items_id, title, currency, price, 
      description, country, city, address, user_firstname, user_lastname, user_email, user_phone, status_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      statusType,
    ]);

    const productId = result.insertId; // Get the newly created product ID

    // Save files to disk and record in database
    const savedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const { type, directory } = getFileTypeAndDestination(file);
        const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
        const filepath = path.join(directory, filename);
        await fs.promises.writeFile(filepath, file.buffer);
        const fileUrl = `/uploads/${type === "document" ? "documents" : "images"}/${filename}`;

        savedFiles.push({ originalname: file.originalname, filename, path: filepath, url: fileUrl, type });

        // Insert file into database
        await connection.query("INSERT INTO product_images (product_id, user_id, image_url) VALUES (?, ?, ?)", [
          productId,
          userId,
          fileUrl,
        ]);
      }
    }

    // Add product attributes
    if (req.body.attributes && typeof req.body.attributes === "object") {
      const attributes = Object.entries(req.body.attributes).map(([attribute_id, value]) => [
        productId,
        attribute_id,
        value,
      ]);

      if (attributes.length > 0) {
        await connection.query(
          "INSERT INTO product_attributes (product_id, attribute_id, value) VALUES ?",
          [attributes]
        );
      }
    }

    await connection.commit(); // Commit transaction

    // Notification message
    const notificationMessage =
      statusType === "published"
        ? `You successfully added a product: ${productData.title}.`
        : `Your product '${productData.title}' is in draft.`;

    // Insert notification into database
    setTimeout(async () => {
      try {
        // Insert notification into database
        await promisePool.query(
          "INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())",
          [userId, notificationMessage]
        );

        // Emit real-time notification via Socket.io
        io.to(`user_${userId}`).emit("notification", {
          message: notificationMessage,
          type: statusType === "published" ? "product_added" : "product_draft",
        });

        console.log("Product notification sent via Socket.io after delay.");
      } catch (error) {
        console.error("Error in delayed notification:", error);
      }
    }, 5000); // 5000ms = 5 seconds delay

    res.status(201).json({
      success: true,
      productId,
      message: notificationMessage,
      files: savedFiles.map((file) => ({ url: file.url, type: file.type, name: file.originalname })),
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error adding product:", err);
    return res.status(500).json({ error: "Error adding product to the database", details: err.message });
  } finally {
    connection.release();
  }
});

//update status type


router.put("/update-product-status/:id", verifyToken, async (req, res) => {
  const productId = req.params.id;
  const { status_type } = req.body;
  const userId = req.userId;

  // Ensure the status_type is either "published" or "draft"
  if (!["published", "draft"].includes(status_type)) {
    return res.status(400).json({ error: "Invalid status type" });
  }

  try {
    // Update the product status only if the product belongs to the logged-in user
    const updateQuery = `
      UPDATE products 
      SET status_type = ? 
      WHERE id = ? AND user_id = ?
    `;
    const [result] = await promisePool.query(updateQuery, [status_type, productId, userId]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Unauthorized or product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      newStatus: status_type
    });

  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ error: "Failed to update product status" });
  }
});




router.delete("/delete-product/:id", verifyToken, async (req, res) => {
  const productId = req.params.id;
  const userId = req.userId;

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction(); // Start transaction

    // 1. Fetch product files (images and documents)
    const [files] = await connection.query(
      "SELECT image_url FROM product_images WHERE product_id = ?",
      [productId]
    );

    // 2. Delete files from the filesystem
    for (const file of files) {
      const filePath = path.join(__dirname, "../", file.image_url); // Resolve full path

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    }

    // 3. Delete product images/documents from the database
    await connection.query("DELETE FROM product_images WHERE product_id = ?", [productId]);

    // 4. Delete product attributes (if any exist)
    await connection.query("DELETE FROM product_attributes WHERE product_id = ?", [productId]);

    // 5. Delete the product itself (ensure user owns it)
    const [result] = await connection.query(
      "DELETE FROM products WHERE id = ? AND user_id = ?",
      [productId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Unauthorized or product not found");
    }

    await connection.commit(); // Commit transaction

    res.status(200).json({
      success: true,
      message: "Product and all associated files deleted successfully",
    });
  } catch (error) {
    await connection.rollback(); // Rollback transaction if anything fails
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  } finally {
    connection.release(); // Release the connection
  }
});

module.exports = router;