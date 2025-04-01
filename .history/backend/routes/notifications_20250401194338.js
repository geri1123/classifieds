// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");


  router.put("/notifications/:id/read", verifyToken, async (req, res) => {
    const userId = req.userId;
    const notificationId = req.params.id;
    
    try {
      // Update notification status
      await promisePool.query(
        "UPDATE notifications SET status = 'read' WHERE id = ? AND user_id = ?",
        [notificationId, userId]
      );
      
      // Get the updated unread count
      const [unreadCountResult] = await promisePool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
      
      // Emit updated count to the user's room
      const io = req.app.get('socketio');
      io.to(`user_${userId}`).emit("notificationCount", unreadCount);
      
      res.json({ message: "Notification marked as read", unreadCount });
    } catch (err) {
      console.error("Error updating notification:", err);
      res.status(500).json({ error: "Error updating notification" });
    }
  });
  router.post("/notifications", verifyToken, async (req, res) => {
    const userId = req.userId;
    const { message, status = "unread" } = req.body;
    
    try {
      const [result] = await promisePool.query(
        "INSERT INTO notifications (user_id, message, status) VALUES (?, ?, ?)",
        [userId, message, status]
      );
      
      // Get the updated unread count
      const [unreadCountResult] = await promisePool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
      
      // Get io instance from the request
      const io = req.app.get('socketio');
      // Emit to the specific user's room
      io.to(`user_${userId}`).emit("notificationCount", unreadCount);
      
      res.status(201).json({ message: "Notification created" });
    } catch (err) {
      console.error("Error creating notification:", err);
      res.status(500).json({ error: "Error creating notification" });
    }
  });


  // Route to fetch unread notification count
router.get("/notifications/count", verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      const [unreadCountResult] = await promisePool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
  
      res.json({ unreadCount });
    } catch (err) {
      console.error("Error fetching unread count:", err);
      res.status(500).json({ error: "Error fetching unread notification count" });
    }
  });
  
module.exports = router;
