const express = require("express");
const db = require("../db/dbconfig");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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
router.get("/user-info", verifyToken, (req, res) => {
    const userId = req.userId;

    const getUserQuery = "SELECT * FROM `users` WHERE id = ?";
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
           user.profile_img = `${process.env.SERVER_URL}/${user.profile_img}`;
      }
      res.json({ success: true, user });
    });
});

module.exports = router;  