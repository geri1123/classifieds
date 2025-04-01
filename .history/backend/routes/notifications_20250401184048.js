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
module.exports = router;
