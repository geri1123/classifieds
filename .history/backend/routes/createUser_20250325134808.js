const express = require("express");
const db = require("../db/dbconfig");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/signup-user", (req, res) => {
    const { username, first_name, last_name, email, password, repeatpassword, termsAccepted } = req.body;
    let errors = {};
  
    if (!username) errors.username = "Please fill the username field.";
    else if (username.length < 4) errors.username = "Username must be more than 4 characters.";
  
    if (!first_name) errors.first_name = "Please fill the first name field.";
    if (!last_name) errors.last_name = "Please fill the last name field.";
    if (!email) errors.email = "Please fill the email field.";
    if (!password) errors.password = "Please fill the password field.";  // Change `user_password` to `password`
    else if (password.length < 8) errors.password = "Password must be at least 8 characters long.";  // Change `user_password` to `password`
    if (repeatpassword !== password) errors.repeatpassword = "Passwords do not match";  // Change `user_password` to `password`
    if (!termsAccepted) {
      errors.terms = "You must accept the terms and conditions.";
    }

    // If there are any validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
  
    // Check if email already exists
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        console.error("Error checking user email:", err);
        return res.status(500).json({ error: "Server error" });
      }
      if (results.length > 0) {
        return res.status(422).json({ errors: { email: "Email already in use" } });
      }
  
      // Check if username already exists
      const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
      db.query(checkUsernameQuery, [username], (err, results) => {
        if (err) {
          console.error("Error checking username:", err);
          return res.status(500).json({ error: "Server error" });
        }
        if (results.length > 0) {
          return res.status(422).json({ errors: { username: "Username already in use" } });
        }
  
        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ error: "Server error" });
          }

          // Insert user into the database
          const insertQuery =
            "INSERT INTO users (username, first_name, last_name, email,  password) VALUES (?, ?, ?, ?, ?)";
          db.query(insertQuery, [username.trim(), first_name, last_name, email, hashedPassword], (err, result) => {
            if (err) {
              console.error("Error inserting user:", err);
              return res.status(500).json({ error: "Server error" });
            }
                
            res.json({ success: true, message: "User registered successfully", username });
          });
        });
      });
    });
});

module.exports = router;