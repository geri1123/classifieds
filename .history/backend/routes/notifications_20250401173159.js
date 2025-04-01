const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");
const io = require('./server').io; 
router.get("/notifications", verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      const [notifications] = await promisePool.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      res.json(notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Error fetching notifications" });
    }
  });
  
  // Route to create a new notification
  router.post("/notifications", verifyToken, async (req, res) => {
    const userId = req.userId;
    const { message, status = "unread" } = req.body; // Assuming body contains message and status
  
    try {
      const [result] = await promisePool.query(
        "INSERT INTO notifications (user_id, message, status) VALUES (?, ?, ?)",
        [userId, message, status]
      );
  
      // Emit updated notification count to clients
      const [unreadCountResult] = await promisePool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
  
      // Emit the notification count to all connected clients
      io.emit("notificationCount", unreadCount);
  
      res.status(201).json({ message: "Notification created" });
    } catch (err) {
      console.error("Error creating notification:", err);
      res.status(500).json({ error: "Error creating notification" });
    }
  });
  

module.exports = router;