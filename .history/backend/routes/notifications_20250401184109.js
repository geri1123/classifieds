// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");
router.get("/notifications", verifyToken, async (req, res) => {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    try {
      // Get total count for pagination info
      const [countResult] = await promisePool.query(
        "SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?",
        [userId]
      );
      
      const [notifications] = await promisePool.query(
        "SELECT id, message, status, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [userId, limit, offset]
      );
      
      res.json({
        notifications,
        pagination: {
          total: countResult[0].total,
          page,
          limit,
          pages: Math.ceil(countResult[0].total / limit)
        }
      });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Error fetching notifications" });
    }
  });


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
module.exports = router;
