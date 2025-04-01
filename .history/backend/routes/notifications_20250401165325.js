const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig"); 
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


module.exports = router;