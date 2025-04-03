const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");

router.get('/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Pagination Parameters (assuming page and limit are passed as query params)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Query to get paginated products
    const [products] = await connection.query(`
      SELECT p.*, 
             c.name AS category_name, 
             sc.name AS subcategory_name, 
             sci.name AS subcategory_item_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
      WHERE p.status_type = 'published'
      ORDER BY p.created_at DESC
      LIMIT ?, ?
    `, [offset, limit]);

    // Get total product count (for frontend pagination controls)
    const [[{ total }]] = await connection.query(`
      SELECT COUNT(*) AS total 
      FROM products 
      WHERE status_type = 'published'
    `);

    // Get only the first image for each product if available
    for (let product of products) {
      const [images] = await connection.query(
        'SELECT * FROM product_images WHERE product_id = ? LIMIT 1', // Only fetch one image (the first one)
        [product.id]
      );

      if (images.length > 0) {
        product.product_images = [{
          url: `http://localhost:8081/${images[0].url}`, // Return only the first image
          alt: images[0].alt || "Product image" // Use the alt text if available, otherwise default
        }];
      } else {
        product.product_images = [{
          url: "/placeholder.jpg", // Default image if no image is available
          alt: "Placeholder image"
        }];
      }
    }

    connection.release();
    res.json({ success: true, total, page, limit, products });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;

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