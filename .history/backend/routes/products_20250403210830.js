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
      
      // Query to get all products with their images
      const [products] = await connection.query(`
        SELECT p.*, 
               c.name AS category_name, 
               sc.name AS subcategory_name,
               sci.name AS subcategory_item_name
                 GROUP_CONCAT(DISTINCT pi.image_url) as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
        LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
        LEFT JOIN 
          product_images pi ON p.id = pi.product_id
        WHERE p.status_type = 'published'
        ORDER BY p.created_at DESC
      `);
      
      // Get images for each product
      // for (let product of products) {
      //   const [images] = await connection.query(
      //     'SELECT * FROM product_images WHERE product_id = ?',
      //     [product.id]
      //   );
      //   product.product_images = images;  // Assuming this already returns an array of image objects

      //   // Process the images (if needed)
      //   product.product_images = product.product_images.map(image => {
      //     return {
      //       url: `http://localhost:8081/${image.url}`,  // Assuming 'url' is the column with image paths
      //       alt: image.alt || "Product image"  // Add a default alt text if none exists
      //     };
      //   });
        
        // Get attributes for the product
        const [attributes] = await connection.query(`
          SELECT pa.*, a.name AS attribute_name, a.type AS attribute_type 
          FROM product_attributes pa
          JOIN attributes a ON pa.attribute_id = a.id
          WHERE pa.product_id = ?`, [product.id]);
        
        product.attributes = attributes;
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