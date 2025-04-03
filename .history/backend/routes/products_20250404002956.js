const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");

router.get("/products", async (req, res) => {
  const { category } = req.query;

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
        1 = 1
    `;

    const queryParams = [];

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
          ? product.images.split(',').map((url) => `http://localhost:8081${url}`)
          : []
      };
    });

    res.status(200).json({
      success: true,
      count: processedResults.length,
      products: processedResults
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message
    });
  }
});




  // GET single product by ID
  router.get('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await pool.getConnection();
      
      // Query to get the product
      const [products] = await connection.query(`
        SELECT p.*, 
               c.name AS category_name, 
               sc.name AS subcategory_name,
               sci.name AS subcategory_item_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
        LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
        WHERE p.id = ?
      `, [id]);
      
      if (products.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const product = products[0];
      
      // Get images for the product
      const [images] = await connection.query(
        'SELECT * FROM product_images WHERE product_id = ?',
        [id]
      );
      product.product_images = images;
      
      // Get attributes for the product
      const [attributes] = await connection.query(`
        SELECT pa.*, a.name AS attribute_name, a.type AS attribute_type 
        FROM product_attributes pa
        JOIN attributes a ON pa.attribute_id = a.id
        WHERE pa.product_id = ?
      `, [id]);
      
      product.attributes = attributes;
      
      connection.release();
      res.json(product);
      
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });


module.exports = router;