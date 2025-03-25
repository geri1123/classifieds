const express = require("express");
const db = require("../db/dbconfig");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../modules/verifyToken.js");
const multer = require("multer");
const path=require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
});


router.post("/signin", async (req, res) => {
    const { identifier, user_password } = req.body;
  
    if (!identifier || !user_password) {
      return res.status(400).json({ errors: "Please fill in all fields." });
    }
   
    const checkUserQuery = "SELECT * FROM `users` WHERE username = ? OR email = ?";
    db.query(checkUserQuery, [identifier, identifier], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ errors: "User not found." });
      }
  
      const user = results[0];
  
      if (!(await bcrypt.compare(user_password, user.password))) {
        return res.status(401).json({ errors: "Invalid  password." });
      }
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      // const token = jwt.sign({ userId: user.user_id }, "secret_user", { expiresIn: "1h" });
  
      res.clearCookie("token"); // Ensure old token is cleared if any
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000, // 1 hour
        sameSite: "Strict",
      });
  
      res.json({ success: true });
    });
  });

  router.get("/check-auth", verifyToken, (req, res) => {
    if (!req.userId) {
      return res.status(401).json({ isAuthenticated: false }); // Explicit failure
    }
    res.json({ isAuthenticated: true, userId: req.userId });
  });

module.exports = router;  