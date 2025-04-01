const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");

router.get('/addCountries' , (req, res)=>{
    const query = "SELECT * FROM countries";
    promisePool.query(query)
    .then((result)=>{
        res.json(result[0])
    })
    .catch((err)=>{
        console.log(err)
    })
})

router.get('/cities/:country_id', async (req, res) => {
    const { country_id } = req.params;  // Get country_id from request params

    const query = "SELECT * FROM cities WHERE country_id = ?";
    
    try {
        const [rows] = await promisePool.query(query, [country_id]);  // Execute query with parameter
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


module.exports = router;