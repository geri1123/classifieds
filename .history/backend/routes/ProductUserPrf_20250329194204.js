const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");

// Get products by user with optional category filter
router.get("/user-products", verifyToken, async (req, res) => {
    const userId = req.userId; // User ID from token
    const { category } = req.query; // Optional category parameter
  
    try {
      let query = `
        SELECT 
          p.*,
          c.name as category_name,
          sc.name as subcategory_name,
          sci.name as subcategory_item_name,
          GROUP_CONCAT(DISTINCT pi.image_url) as images
        FROM 
          products p
        LEFT JOIN 
          categories c ON p.category_id = c.id
        LEFT JOIN 
          subcategories sc ON p.subcategory_id = sc.id
        LEFT JOIN 
          subcategories_items sci ON p.subcategories_items_id = sci.id
        LEFT JOIN 
          product_images pi ON p.id = pi.product_id
        WHERE 
          p.user_id = ?
      `;
  
      const queryParams = [userId];
  
      // Add category filter if provided
      if (category && category !== 'All') {
        query += ` AND c.name = ?`;
        queryParams.push(category);
      }
  
      // Group by product ID to handle multiple images
      query += ` GROUP BY p.id ORDER BY p.created_at DESC`;
  
      const [results] = await promisePool.query(query, queryParams);
  
      // Process the results to convert comma-separated images to an array
      const processedResults = results.map((product) => {
        return {
          ...product,
          images: product.images 
            ? product.images.split(',').map((url) => `http://localhost:8081${url}`) // Ensure image URLs are full URLs
            : []
        };
      });
  
      res.status(200).json({
        success: true,
        count: processedResults.length,
        products: processedResults
      });
    } catch (error) {
      console.error("Error fetching user products:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching products",
        error: error.message
      });
    }
  });

// Get all products with optional category filter (public route)
router.get("/products", async (req, res) => {
  const { category, userId } = req.query;
  
  try {
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        sc.name as subcategory_name,
        sci.name as subcategory_item_name,
        GROUP_CONCAT(DISTINCT pi.image_url) as images,
        u.username as seller_username,
        u.profile_img as seller_profile_img
      FROM 
        products p
      LEFT JOIN 
        categories c ON p.category_id = c.id
      LEFT JOIN 
        subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN 
        subcategories_items sci ON p.subcategories_items_id = sci.id
      LEFT JOIN 
        product_images pi ON p.id = pi.product_id
      LEFT JOIN
        users u ON p.user_id = u.user_id
      WHERE 1=1
    `;

    const queryParams = [];

    // Add category filter if provided
    if (category) {
      query += ` AND c.name = ?`;
      queryParams.push(category);
    }

    // Add user filter if provided
    if (userId) {
      query += ` AND p.user_id = ?`;
      queryParams.push(userId);
    }

    // Group by product ID to handle multiple images
    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [results] = await promisePool.query(query, queryParams);

    // Process the results to convert comma-separated images to an array
    const processedResults = results.map(product => {
        return {
          ...product,
          images: product.images 
            ? product.images.split(',').map(url => `http://localhost:8081${url}`)  // Adjust the base URL as needed
            : []
        };
      });

    res.status(200).json({
      success: true,
      count: processedResults.length,
      products: processedResults
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
});

// Get product details by ID
router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  
  try {
    // Get product details
    const [product] = await promisePool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        sc.name as subcategory_name,
        sci.name as subcategory_item_name,
        u.username as seller_username,
        u.profile_img as seller_profile_img,
        u.phone as seller_phone,
        u.email as seller_email
      FROM 
        products p
      LEFT JOIN 
        categories c ON p.category_id = c.id
      LEFT JOIN 
        subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN 
        subcategories_items sci ON p.subcategories_items_id = sci.id
      LEFT JOIN
        users u ON p.user_id = u.user_id
      WHERE 
        p.id = ?
    `, [productId]);

    if (!product || product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get product images
    const [images] = await promisePool.query(`
      SELECT image_url FROM product_images WHERE product_id = ?
    `, [productId]);

    // Get product attributes
    const [attributes] = await promisePool.query(`
      SELECT 
        a.name as attribute_name,
        pa.value 
      FROM 
        product_attributes pa
      JOIN 
        attributes a ON pa.attribute_id = a.id
      WHERE 
        pa.product_id = ?
    `, [productId]);

    const productDetails = {
      ...product[0],
      images: images.map(img => img.image_url),
      attributes: attributes.reduce((acc, attr) => {
        acc[attr.attribute_name] = attr.value;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      product: productDetails
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message
    });
  }
});

module.exports = router;