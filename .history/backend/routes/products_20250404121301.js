const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");
router.get("/products", async (req, res) => {
  const { category } = req.query;

  try {
    // Base query to get products and related info
    let query = `
      SELECT
        p.*,
        c.name AS category_name,
        sc.name AS subcategory_name,
        sci.name AS subcategory_item_name,
        GROUP_CONCAT(DISTINCT pi.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE 1=1
    `;

    const queryParams = [];

    if (category && category !== 'All') {
      query += ` AND c.name = ?`;
      queryParams.push(category);
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [results] = await promisePool.query(query, queryParams);

    // Now fetch all attributes per product
    const processedResults = await Promise.all(results.map(async (product) => {
      const baseImageUrl = "http://localhost:8081";

      // Handle image splitting and fallback
      let images = (product.images?.split(',') || []).slice(0, 2).map((url) => `${baseImageUrl}${url}`);
      if (images.length === 0) {
        images = ["https://via.placeholder.com/300x200?text=No+Image"];
      }

      // Get all attributes for the subcategory, with any value if exists
      const [attributes] = await promisePool.query(`
        SELECT 
          a.id,
          a.name,
          a.type,
          pa.value
        FROM attributes a
        LEFT JOIN product_attributes pa 
          ON a.id = pa.attribute_id AND pa.product_id = ?
        WHERE a.subcategory_id = ?
      `, [product.id, product.subcategory_id]);
      console.log(`Attributes for product ID ${id}:`, attributes);
      return {
        ...product,
        images,
        attributes,
      };
    }));

    res.status(200).json({
      success: true,
      count: processedResults.length,
      products: processedResults,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// router.get("/products", async (req, res) => {
//   const { category } = req.query;

//   try {
//     let query = `
//       SELECT 
//         p.*,
//         c.name as category_name,
//         sc.name as subcategory_name,
//         sci.name as subcategory_item_name,
//         GROUP_CONCAT(DISTINCT pi.image_url) as images
//       FROM 
//         products p
//       LEFT JOIN 
//         categories c ON p.category_id = c.id
//       LEFT JOIN 
//         subcategories sc ON p.subcategory_id = sc.id
//       LEFT JOIN 
//         subcategories_items sci ON p.subcategories_items_id = sci.id
//       LEFT JOIN 
//         product_images pi ON p.id = pi.product_id
//       WHERE 
//         1 = 1
//     `;

//     const queryParams = [];

//     // Add category filter if provided
//     if (category && category !== 'All') {
//       query += ` AND c.name = ?`;
//       queryParams.push(category);
//     }

//     query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

//     const [results] = await promisePool.query(query, queryParams);

//     // Process each product to get its attributes
//     const processedResults = await Promise.all(results.map(async (product) => {
//       const baseImageUrl = "http://localhost:8081";
//       let images = [];

//       if (product.images) {
//         images = product.images
//           .split(',')
//           .slice(0, 2) // Only keep first 2 images
//           .map((url) => `${baseImageUrl}${url}`);
//       }

//       // If no images found, use placeholders
//       if (images.length === 0) {
//         images = [
//           "https://via.placeholder.com/300x200?text=No+Image"
//         ];
//       }

//       // Get all attributes for this product's subcategory
//       const [subcategoryAttributes] = await promisePool.query(`
//         SELECT id, name, type FROM attributes 
//         WHERE subcategory_id = ?
//       `, [product.subcategory_id]);

//       // Get attribute values for this product
//       const [productAttributeValues] = await promisePool.query(`
//         SELECT attribute_id, value FROM product_attributes
//         WHERE product_id = ?
//       `, [product.id]);
      
//       // Create a map of attribute values by attribute_id
//       const attributeValuesMap = {};
//       productAttributeValues.forEach(item => {
//         attributeValuesMap[item.attribute_id] = item.value;
//       });
      
//       // Combine attributes with their values
//       const attributes = subcategoryAttributes.map(attr => {
//         return {
//           id: attr.id,
//           name: attr.name,
//           type: attr.type,
//           value: attributeValuesMap[attr.id] || null
//         };
//       });

//       return {
//         ...product,
//         images,
//         attributes
//       };
//     }));

//     res.status(200).json({
//       success: true,
//       count: processedResults.length,
//       products: processedResults
//     });
//   } catch (error) {
//     console.error("Error fetching all products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: error.message
//     });
//   }
// });


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