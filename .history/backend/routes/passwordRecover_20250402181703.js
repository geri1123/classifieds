const express = require("express");
const promisePool = require("../db/dbconfig"); // Using promise-based pool
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../services/emailService");

const router = express.Router();

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Please enter the email!" });
  }

  try {
    // Check if email exists
    const [users] = await promisePool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ error: "Email does not exist!" });
    }

    const user = users[0];

    // Generate Reset Token (valid for 5 minutes)
    const token = jwt.sign({ userId: user.user_id }, process.env.SECRET_RESET, { expiresIn: "5m" });

    await sendResetEmail(email, token); // Send reset email

    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 min expiry timestamp

    // res.json({ message: "We have emailed the link to reset your password in !", expiresAt: expirationTime });
    res.json({ message: "We have emailed the link to reset your password in !", expiresAt: expirationTime });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  const { token, newPassword, repeatPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters!" });
  }

  if (!repeatPassword || newPassword !== repeatPassword) {
    return res.status(400).json({ error: "Passwords do not match!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_RESET);

    const userId = decoded.userId;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update Password
    await promisePool.query("UPDATE users SET password = ? WHERE user_id = ?", [hashedPassword, userId]);

    res.json({ message: "The password has been successfully updated!" });
  } catch (error) {
    console.error("Token verification or password update failed:", error);
    res.status(400).json({ error: "Invalid or expired reset token." });
  }
});

module.exports = router;
