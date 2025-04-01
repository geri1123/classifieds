// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");
// Add this to your notifications.js route file
router.get("/notifications/count", verifyToken, async (req, res) => {
    const userId = req.userId;
    
    try {
      const [result] = await promisePool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
      );
      
      res.json({ unreadCount: result[0].unreadCount });
    } catch (err) {
      console.error("Error fetching notification count:", err);
      res.status(500).json({ error: "Error fetching notification count" });
    }
  });
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  NEXT_PUBLIC_SERVER_URL=http://localhost:8081


module.exports = router;
