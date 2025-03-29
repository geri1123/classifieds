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
      if (category) {
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