const express = require("express");
const db = require("../db/dbconfig");
const router = express.Router();



router.get("/check-auth", verifyToken, (req, res) => {
    if (!req.userId) {
      return res.status(401).json({ isAuthenticated: false }); // Explicit failure
    }
    res.json({ isAuthenticated: true, userId: req.userId });
  });
  
  // Streamlined /user-info route
  router.get("/user-info", verifyToken, (req, res) => {
    const userId = req.userId;
  
    const getUserQuery = "SELECT * FROM `users` WHERE user_id = ?";
    db.query(getUserQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user info:", err);
        return res.status(500).json({ error: "Server error" });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const user = results[0];
      delete user.user_password; // Remove sensitive information
      if (user.profile_img) {
        // user.profile_img = `http://localhost:8081/${user.profile_img}`; // Adjust based on how the filename is stored in DB
           user.profile_img = `${process.env.SERVER_URL}/${user.profile_img}`;
      }
      res.json({ success: true, user });
    });
  });
  
  



