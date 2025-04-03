const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");
router.get('/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Pagination Parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Extract filter parameters
    const category = req.query.category;
    const subcategory = req.query.subcategory;
    const subcategoryItem = req.query.subcategory_items;
    
    // Build WHERE clause dynamically
    let whereConditions = ['p.status_type = "published"'];
    let queryParams = [];
    
    if (category) {
      whereConditions.push('c.name = ?');
      queryParams.push(category);
    }
    
    if (subcategory) {
      whereConditions.push('sc.name = ?');
      queryParams.push(subcategory);
    }
    
    if (subcategoryItem) {
      whereConditions.push('sci.name = ?');
      queryParams.push(subcategoryItem);
    }
    
    // Handle attribute filters
    const attributeFilters = {};
    
    // Extract attribute filters from query params
    Object.keys(req.query).forEach(key => {
      // Check if it's an attribute filter (not one of our standard filters)
      if (!['page', 'limit', 'category', 'subcategory', 'subcategory_items'].includes(key)) {
        attributeFilters[key] = req.query[key];
      }
    });
    
    // Query to get paginated products
    let productsQuery = `
      SELECT p.*,
             c.name AS category_name,
             sc.name AS subcategory_name,
             sci.name AS subcategory_item_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
      WHERE ${whereConditions.join(' AND ')}
    `;
    
    // Add attribute join and filters if needed
    if (Object.keys(attributeFilters).length > 0) {
      let attributeJoins = [];
      
      Object.keys(attributeFilters).forEach((attrName, index) => {
        const tableAlias = `pa${index}`;
        const attrAlias = `a${index}`;
        
        productsQuery += `
          JOIN product_attributes ${tableAlias} ON p.id = ${tableAlias}.product_id
          JOIN attributes ${attrAlias} ON ${tableAlias}.attribute_id = ${attrAlias}.id AND ${attrAlias}.name = ?
        `;
        queryParams.push(attrName);
        
        whereConditions.push(`${tableAlias}.value = ?`);
        queryParams.push(attributeFilters[attrName]);
        
        // Reapply the WHERE clause after joins
        productsQuery = productsQuery.replace(/WHERE .*/, `WHERE ${whereConditions.join(' AND ')}`);
      });
    }
    
    // Add ORDER BY, LIMIT clauses
    productsQuery += ` ORDER BY p.created_at DESC LIMIT ?, ?`;
    queryParams.push(offset, limit);
    
    // Execute the query
    const [products] = await connection.query(productsQuery, queryParams);
    
    // Build count query with same filters
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) AS total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN subcategories_items sci ON p.subcategories_items_id = sci.id
    `;
    
    // Add attribute joins for count query if needed
    if (Object.keys(attributeFilters).length > 0) {
      Object.keys(attributeFilters).forEach((attrName, index) => {
        const tableAlias = `pa${index}`;
        const attrAlias = `a${index}`;
        
        countQuery += `
          JOIN product_attributes ${tableAlias} ON p.id = ${tableAlias}.product_id
          JOIN attributes ${attrAlias} ON ${tableAlias}.attribute_id = ${attrAlias}.id AND ${attrAlias}.name = ?
        `;
      });
    }
    
    countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    
    // Remove offset and limit from the params for count query
    const countParams = queryParams.slice(0, -2);
    
    // Get total count
    const [[{ total }]] = await connection.query(countQuery, countParams);
    
    // Get the first image for each product
    for (let product of products) {
      const [images] = await connection.query(
        'SELECT image_url FROM product_images WHERE product_id = ? LIMIT 1',
        [product.id]
      );
      
      if (images.length > 0) {
        product.product_images = [{
          url: `http://localhost:8081${images[0].image_url}`,
          alt: "Product image"
        }];
      } else {
        product.product_images = [{
          url: "/placeholder.jpg",
          alt: "Placeholder image"
        }];
      }
    }
    
    connection.release();
    res.json({ 
      success: true, 
      total, 
      page, 
      limit, 
      products,
      filters: {
        category,
        subcategory,
        subcategoryItem,
        attributes: attributeFilters
      } 
    });
    
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