const express = require("express");
const db = require("../db/dbconfig");

const router = express.Router();

// Add Attribute for Subcategory without parent_id
router.post('AddAttributes' , (req, res)=>{
    const {name, subcategory_id} = req.body;

    const query = `INSERT INTO attributes (name, subcategory_id) VALUES (?, ?)`;

    db.query(query, [name, subcategory_id], (err, result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({error: 'Error adding attribute'});
        }
        res.status(201).json({message: 'Attribute added successfully'});
    })
})

module.exports = router;
