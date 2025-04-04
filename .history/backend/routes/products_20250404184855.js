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

    // Get only the first 2 images for all products (limit 2 per product)
    const [allImages] = await pool.query(`
      SELECT product_id, image_url 
      FROM product_images 
      WHERE product_id IN (?) 
      ORDER BY product_id, id
    `, [productIds]);

    // Get all attributes for all products
    const [allAttributes] = await pool.query(`
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

    // Create map for attributes by product_id
    const attributesByProductId = {};
    allAttributes.forEach(attr => {
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
      const productObj = {
        ...product,
        images: imagesByProductId[product.id] || [],
        attributes: attributesByProductId[product.id] || [],
        topAttributes: (attributesByProductId[product.id] || []).slice(0, 3)
      };

      productObj.attributesObject = {};
      (attributesByProductId[product.id] || []).forEach(attr => {
        productObj.attributesObject[attr.name] = attr.value;
      });

      return productObj;
    });

    // Log the complete products for debugging
    console.log(JSON.stringify(completeProducts, null, 2));
    
    res.json(completeProducts);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Error fetching products with complete details" });
  }
});

// router.get("/products", async (req, res) => {
//   try {
//     // Get all products with category, subcategory and subcategory item information
//     const [products] = await promisePool.query(`
//       SELECT 
//         p.*,
//         c.name AS category_name,
//         s.name AS subcategory_name,
//         si.name AS subcategory_item_name
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN subcategories s ON p.subcategory_id = s.id
//       LEFT JOIN subcategories_items si ON p.subcategories_items_id = si.id
//       ORDER BY p.id
//     `);
    
//     if (products.length === 0) {
//       return res.json([]);
//     }
    
//     // Get all product IDs
//     const productIds = products.map(product => product.id);
    
//     // Get only the first 2 images for all products (limit 2 per product)
//     const [allImages] = await promisePool.query(`
//       SELECT product_id, image_url 
//       FROM product_images 
//       WHERE product_id IN (?) 
//       ORDER BY product_id, id
//     `, [productIds]);
    
//     // Get all attributes for all products
//     const [allAttributes] = await promisePool.query(`
//       SELECT 
//         pa.product_id, 
//         pa.attribute_id, 
//         pa.value, 
//         a.name AS attribute_name, 
//         a.type AS attribute_type
//       FROM product_attributes pa
//       JOIN attributes a ON pa.attribute_id = a.id
//       WHERE pa.product_id IN (?)
//     `, [productIds]);
    
//     // Create maps for images by product_id, limit to the first 2 images
//     const imagesByProductId = {};
//     allImages.forEach((image, index) => {
//       // Only store the first 2 images per product
//       if (!imagesByProductId[image.product_id]) {
//         imagesByProductId[image.product_id] = [];
//       }
//       if (imagesByProductId[image.product_id].length < 2) {
//         imagesByProductId[image.product_id].push({
//           url: image.image_url
//         });
//       }
//     });
    
//     // Create map for attributes by product_id
//     const attributesByProductId = {};
//     allAttributes.forEach(attr => {
//       if (!attributesByProductId[attr.product_id]) {
//         attributesByProductId[attr.product_id] = [];
//       }
      
//       let value = attr.value;
//       attributesByProductId[attr.product_id].push({
//         id: attr.attribute_id,
//         name: attr.attribute_name,
//         type: attr.attribute_type,
//         value: value
//       });
//     });
    
//     // Combine everything into complete product objects
//     const completeProducts = products.map(product => {
//       const productObj = {
//         ...product,
//         images: imagesByProductId[product.id] || [],
//         attributes: attributesByProductId[product.id] || [],
//         topAttributes: (attributesByProductId[product.id] || []).slice(0, 3) // pick top 3
//       };
    
//       productObj.attributesObject = {};
//       (attributesByProductId[product.id] || []).forEach(attr => {
//         productObj.attributesObject[attr.name] = attr.value;
//       });
    
//       return productObj;
//     });
    
//     res.json(completeProducts);
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Error fetching products with complete details" });
//   }
// });

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