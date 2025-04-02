const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig"); // Assuming promisePool is set up correctly
router.get("/attributes/:subcategory_id", async (req, res) => {
    const { subcategory_id } = req.params;
    const query = "SELECT * FROM attributes WHERE subcategory_id = ?";

    try {
        const [result] = await promisePool.query(query, [subcategory_id]);
        res.json(result);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Error fetching attributes" });
    }
});


router.post('/AddAttributes', async (req, res) => {
    const { name,type, subcategory_id } = req.body;

    console.log("Received request to add attribute with subcategory_id:", subcategory_id);

    if (!name || !subcategory_id) {
        return res.status(400).json({ error: "Missing name or subcategory_id" });
    }

    const insertAttributeQuery = "INSERT INTO attributes (name, subcategory_id) VALUES (?, ?)";

    try {
        const [result] = await promisePool.query(insertAttributeQuery, [name, subcategory_id]);
        res.status(201).json({ 
            message: 'Attribute added successfully', 
            attributeId: result.insertId 
        });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Error adding attribute' });
    }
});

module.exports = router;
