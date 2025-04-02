const express = require("express");
const db = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const { sendResetEmail } = require("../services/emailService");

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Ju lutem shkruani emailin." });
  }

  // Check if email exists in the database
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Emaili nuk egzison." });
    }

    const user = results[0];
  
    const token =jwt.sign({userId:user.user_id} , process.env.SECRET_RESET, {expiresIn:"5m"});
   
    sendResetEmail(email, token);
    const expirationTime = Date.now() + 5 * 60 * 1000; 

    res.json({ 
      message: "Kemi dërguar me email link-un për rivendosjen e fjalëkalimit tuaj!", 
      expiresAt: expirationTime 
    });
  });
});

router.post("/reset-password", (req, res) => {
  const { token, newPassword , repeatPassword} = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "Plotësoni fjalëkalimin e ri." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Fjalëkalimmi duhet të përmbaje te paktën 8 karaktere." });
  }
  if(!repeatPassword){
    return res.status(400).json({ error: "Plotësoni fushën 'Përsërit fjalëkalimin'" });
  }
  if(newPassword !==repeatPassword){
    return res.status(400).json({ error: "Fjalëkalimi i përsëritur nuk përputhet me fjalëkalimin e ri" });
  }
  // jwt.verify(token, "secret_reset", (err, decoded) =>
  jwt.verify(token,process.env.SECRET_RESET  , (err, decoded) =>{
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(400).json({ error: "The reset code is invalid or has expired." });
    }

    const userId = decoded.userId;
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Server error" });
      }

      // Update the password in the database
      const updateQuery = "UPDATE users SET user_password = ? WHERE user_id = ?";
      db.query(updateQuery, [hashedPassword, userId], (err, result) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ error: "Server error" });
        }

        res.json({ message: "Fjalëkalimmi është përditësuar me sukses." });
      });
    });
  });
});

module.exports = router;