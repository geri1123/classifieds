// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");
router.get("/notifications", verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      // Fetch all notifications
      const [notifications] = await promisePool.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
  
      // Fetch unread count
      const [unreadCountResult] = await promisePool.query(
        "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
        [userId]
      );
      const unreadCount = unreadCountResult[0].unreadCount;
  
      // Send both notifications and unread count together
      res.json({ notifications, unreadCount });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Error fetching notifications" });
    }
  });
// router.get("/notifications", verifyToken, async (req, res) => {
//   const userId = req.userId;

//   try {
//     const [notifications] = await promisePool.query(
//       "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
//       [userId]
//     );
//     res.json(notifications);
//   } catch (err) {
//     console.error("Error fetching notifications:", err);
//     res.status(500).json({ error: "Error fetching notifications" });
//   }
// });
// router.get("/notifications/count", verifyToken, async (req, res) => {
//     const userId = req.userId;
    
//     try {
//       const [result] = await promisePool.query(
//         "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
//         [userId]
//       );
      
//       res.json({ unreadCount: result[0].unreadCount });
//     } catch (err) {
//       console.error("Error fetching notification count:", err);
//       res.status(500).json({ error: "Error fetching notification count" });
//     }
//   });
// // Route to create a new notification
// router.post("/notifications", verifyToken, async (req, res) => {
//   const userId = req.userId;
//   const { message, status = "unread" } = req.body; // Assuming body contains message and status

//   try {
//     const [result] = await promisePool.query(
//       "INSERT INTO notifications (user_id, message, status) VALUES (?, ?, ?)",
//       [userId, message, status]
//     );

//     // Emit updated notification count to clients
//     const [unreadCountResult] = await promisePool.query(
//       "SELECT COUNT(*) AS unreadCount FROM notifications WHERE user_id = ? AND status = 'unread'",
//       [userId]
//     );
//     const unreadCount = unreadCountResult[0].unreadCount;

//     // Emit the notification count to all connected clients
//     const io = req.app.get('socketio');  // Access io from the Express app object
//     io.emit("notificationCount", unreadCount);  // This will broadcast to all clients connected to the server

//     res.status(201).json({ message: "Notification created" });
//   } catch (err) {
//     console.error("Error creating notification:", err);
//     res.status(500).json({ error: "Error creating notification" });
//   }
// });

module.exports = router;
