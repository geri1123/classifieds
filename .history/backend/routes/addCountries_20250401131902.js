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




module.exports = router;