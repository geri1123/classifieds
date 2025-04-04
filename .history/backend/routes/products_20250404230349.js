const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");

router.get("/all-products", async (req, res) => {
  const { category } = req.query;

  try {
    // First query: Get the products
    let productsQuery = `
      SELECT 
        p.*,
        c.name AS category_name,
        sc.name AS subcategory_name,
        sci.name AS subcategory_item_name,
        GROUP_CONCAT(DISTINCT pi.image_url) AS images
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
      productsQuery += ` AND c.name = ?`;
      queryParams.push(category);
    }

    productsQuery += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [products] = await pool.query(productsQuery, queryParams);

    if (products.length === 0) {
      return res.json({
        success: true,
        count: 0,
        products: []
      });
    }

    const productIds = products.map(product => product.id);
    
    // Second query: Get all products with their attributes in a flattened structure
    const [productAttributes] = await pool.query(`
      SELECT 
        pa.product_id,
        a.id AS attribute_id,
        a.name AS attribute_name,
        a.type AS attribute_type,
        pa.value
      FROM 
        product_attributes pa
      JOIN 
        attributes a ON pa.attribute_id = a.id
      WHERE 
        pa.product_id IN (?)
    `, [productIds]);

    // Debugging: Log the products and product attributes
    console.log('Products:', products);
    console.log('Product Attributes:', productAttributes);
    
    // Process products and their attributes together
    const processedResults = products.map((product) => {
      const baseImageUrl = "http://localhost:8081";
      let images = [];

      if (product.images) {
        images = product.images
          .split(',')
          .slice(0, 2) // Only keep first 2 images
          .map((url) => `${baseImageUrl}${url}`);
      }

      // If no images found, use placeholders
      if (images.length === 0) {
        images = [
        
        ];
      }
      
      // Filter attributes for just this product
      const attributes = productAttributes
        .filter(attr => attr.product_id === product.id)
       .slice(0, 3) .map(attr => ({
          id: attr.attribute_id,
          name: attr.attribute_name,
          type: attr.attribute_type,
          value: attr.value
        }));
      
      return {
        ...product,
        images,
        attributes
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

module.exports = router;