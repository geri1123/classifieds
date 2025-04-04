const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");
router.get("/products", async (req, res) => {
  try {
    // Get all products with category, subcategory, and subcategory item information
    const [products] = await pool.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        s.name AS subcategory_name,
        si.name AS subcategory_item_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories s ON p.subcategory_id = s.id
      LEFT JOIN subcategories_items si ON p.subcategories_items_id = si.id
      ORDER BY p.id
    `);
    
    if (products.length === 0) {
      return res.json([]);
    }
    
    // Get all product IDs
    const productIds = products.map(product => product.id);
    
    // Get only the first 2 images for all products
    const [allImages] = await pool.query(`
      SELECT product_id, image_url 
      FROM product_images 
      WHERE product_id IN (?)
      ORDER BY product_id, id
    `, [productIds]);
    
    // Get attribute values for each product with attribute names
    // Join product_attributes with attributes to get the name and type
    const [attributeValues] = await pool.query(`
      SELECT 
        pa.product_id,
        pa.attribute_id,
        pa.value,
        a.name AS attribute_name,
        a.type AS attribute_type
      FROM product_attributes pa
      JOIN attributes a ON pa.attribute_id = a.id
      WHERE pa.product_id IN (?)
    `, [productIds]);
    
    // Create maps for images by product_id, limit to the first 2 images
    const imagesByProductId = {};
    allImages.forEach(image => {
      if (!imagesByProductId[image.product_id]) {
        imagesByProductId[image.product_id] = [];
      }
      if (imagesByProductId[image.product_id].length < 2) {
        imagesByProductId[image.product_id].push({
          url: image.image_url
        });
      }
    });
    
    // Group attribute values by product_id
    const attributesByProductId = {};
    attributeValues.forEach(attr => {
      if (!attributesByProductId[attr.product_id]) {
        attributesByProductId[attr.product_id] = [];
      }
      
      attributesByProductId[attr.product_id].push({
        id: attr.attribute_id,
        name: attr.attribute_name,
        type: attr.attribute_type,
        value: attr.value
      });
    });
    
    // Combine everything into complete product objects
    const completeProducts = products.map(product => {
      const productAttributes = attributesByProductId[product.id] || [];
      
      const productObj = {
        ...product,
        images: imagesByProductId[product.id] || [],
        attributes: productAttributes,
        topAttributes: productAttributes.slice(0, 3)
      };
      
      // Create a cleaner attributes object for easier frontend access
      productObj.attributesObject = {};
      productAttributes.forEach(attr => {
        productObj.attributesObject[attr.name] = attr.value;
      });
      
      return productObj;
    });
    
    res.json(completeProducts);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error fetching products with complete details" });
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