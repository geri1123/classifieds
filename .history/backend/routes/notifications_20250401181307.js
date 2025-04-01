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
  
      // Get socket.io instance from app
      const io = req.app.get('socketio');
      
      // Emit the unread count to the specific user (if you have user-specific rooms)
      // Or emit to all clients if that's your requirement
      io.emit("notificationCount", unreadCount);
  
      res.status(201).json({ message: "Notification created" });
    } catch (err) {
      console.error("Error creating notification:", err);
      res.status(500).json({ error: "Error creating notification" });
    }
  });
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
