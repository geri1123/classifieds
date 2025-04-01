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
 // Route to fetch notifications
router.get("/notifications", verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      const [notifications] = await promisePool.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
  
      res.json({ notifications });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Error fetching notifications" });
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
