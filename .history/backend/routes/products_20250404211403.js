const express = require("express");
const router = express.Router();
const pool = require("../db/dbconfig");

router.get("/products", async (req, res) => {
  const { category } = req.query;

  try {
    let query = `
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
      query += ` AND c.name = ?`;
      queryParams.push(category);
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [products] = await pool.query(query, queryParams);

    if (products.length === 0) {
      return res.json([]);
    }

    const productIds = products.map(product => product.id);

    // Fetch attribute values with join to attribute_values for option types
    const [allAttributesValues] = await pool.query(`
      SELECT 
        pa.product_id,
        pa.attribute_id,
        pa.value,
        a.name AS attribute_name,
        a.type AS attribute_type,
        av.name AS option_display_value
      FROM 
        product_attributes pa
      JOIN 
        attributes a ON pa.attribute_id = a.id
      LEFT JOIN 
        attribute_values av ON (a.type = 'option' OR a.type = 'checkbox') AND FIND_IN_SET(av.id, pa.value)
      WHERE 
        pa.product_id IN (?)
    `, [productIds]);
    
    // Process attributes by product_id, handling option types properly
    const attributesByProductId = {};
    
    allAttributesValues.forEach(attr => {
      if (!attributesByProductId[attr.product_id]) {
        attributesByProductId[attr.product_id] = [];
      }

      // Check if this attribute already exists in the array
      const existingAttr = attributesByProductId[attr.product_id].find(a => a.id === attr.attribute_id);
      
      if (existingAttr) {
        // For checkbox type, collect all values
        if (attr.attribute_type === 'checkbox' && attr.option_display_value) {
          if (!existingAttr.display_values) {
            existingAttr.display_values = [];
          }
          existingAttr.display_values.push(attr.option_display_value);
        }
      } else {
        // Create new attribute entry
        const attrObject = {
          id: attr.attribute_id,
          name: attr.attribute_name,
          type: attr.attribute_type,
          value: attr.value
        };
        
        // For option type, use the display value from attribute_values
        if ((attr.attribute_type === 'option' || attr.attribute_type === 'checkbox') && attr.option_display_value) {
          if (attr.attribute_type === 'checkbox') {
            attrObject.display_values = [attr.option_display_value];
          } else {
            attrObject.display_value = attr.option_display_value;
          }
        }
        
        attributesByProductId[attr.product_id].push(attrObject);
      }
    });

    // Second pass to format checkbox values as comma-separated string
    Object.keys(attributesByProductId).forEach(productId => {
      attributesByProductId[productId].forEach(attr => {
        if (attr.type === 'checkbox' && attr.display_values) {
          attr.display_value = attr.display_values.join(', ');
          delete attr.display_values;
        }
      });
    });

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
          "https://via.placeholder.com/300x200?text=No+Image"
        ];
      }

      return {
        ...product,
        images,
        attributes: attributesByProductId[product.id] || []
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