const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");
// router.get('/products', async (req, res) => {
//     try {
//       const connection = await pool.getConnection();
      
//       // Pagination Parameters
//       const page = parseInt(req.query.page) || 1; // Default to page 1
//       const limit = parseInt(req.query.limit) || 10; // Default limit 10 per page
//       const offset = (page - 1) * limit; // Calculate offset

//       // Query to get paginated products
//       const [products] = await connection.query(`
//         SELECT p.*, 
//                c.name AS category_name, 
//                sc.name AS subcategory_name,
//                sci.name AS subcategory_item_name
//         FROM products p
//         LEFT JOIN categories c ON p.category_id = c.id
//         LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
//         LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
//         WHERE p.status_type = 'published'
//         ORDER BY p.created_at DESC
//         LIMIT ? OFFSET ?
//       `, [limit, offset]);

//       // Get total product count (for frontend pagination controls)
//       const [[{ total }]] = await connection.query(`SELECT COUNT(*) AS total FROM products WHERE status_type = 'published'`);

//       // Get images for each product
//       for (let product of products) {
//         const [images] = await connection.query(
//           'SELECT * FROM product_images WHERE product_id = ?',
//           [product.id]
//         );
//         product.product_images = images.map(image => ({
//           url: `http://localhost:8081/${image.url}`,
//           alt: image.alt || "Product image"
//         }));
//       }

//       connection.release();
//       res.json({ success: true, total, page, limit, products });

//     } catch (error) {
//       console.error('Error fetching products:', error);
//       res.status(500).json({ error: 'Failed to fetch products' });
//     }
// });

router.get('/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Query to get all products with basic information
    const [products] = await connection.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        sc.name AS subcategory_name,
        sci.name AS subcategory_item_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
      WHERE p.status_type = 'published'
      ORDER BY p.created_at DESC
    `);
    
    // Fetch additional data for each product
    for (let product of products) {
      // Get all images for the product
      const [images] = await connection.query(`
        SELECT image_url
        FROM product_images
        WHERE product_id = ?
      `, [product.id]);
      
      product.product_images = images.map(img => ({
        url: `http://localhost:8081${img.image_url}`,
        alt: "Product image"
      }));
      
      // Get all attributes with their names and types for the product
      const [productAttributes] = await connection.query(`
        SELECT 
          pa.attribute_id,
          pa.value,
          a.name AS attribute_name,
          a.type AS attribute_type
        FROM product_attributes pa
        JOIN attributes a ON pa.attribute_id = a.id
        WHERE pa.product_id = ?
      `, [product.id]);
      
      // Process each attribute according to its type
      for (let attr of productAttributes) {
        switch (attr.attribute_type) {
          case 'option':
            // For option types, get the display name from attribute_values
            const [optionValue] = await connection.query(`
              SELECT value
              FROM attribute_values
              WHERE attribute_id = ? AND name = ?
            `, [attr.attribute_id, attr.value]);
            
            attr.display_value = optionValue.length > 0 ? optionValue[0].name : attr.value;
            break;
            
          case 'checkbox':
            // For checkboxes, convert to boolean for easier frontend handling
            attr.display_value = attr.value;
            break;
            
          case 'number':
            // For numbers, convert string to number
            attr.display_value = parseFloat(attr.value) || 0;
            break;
            
          case 'text':
          default:
            // For text and other types, use as is
            attr.display_value = attr.value;
        }
      }
      
      product.attributes = productAttributes;
    }
    
    connection.release();
    res.json(products);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
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