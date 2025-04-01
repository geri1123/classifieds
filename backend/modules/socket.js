// // socket.js
// const { Server } = require('socket.io');

// let io;  // Declare io here

// function initSocket(server) {
//   // Initialize the socket server with the provided HTTP server
//   io = new Server(server, {
//     cors: {
//       origin: process.env.CORS_ORIGIN || "http://localhost:3000",
//       methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//       credentials: true,
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("A user connected");

//     socket.on("joinRoom", (userId) => {
//       socket.join(`user_${userId}`); // Join user-specific room
//       console.log(`User ${userId} joined room`);
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected");
//     });
//   });

//   return io;  // Return the io object
// }

// module.exports = { initSocket };
// backend/modules/socket.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }
  });

  io.use((socket, next) => {
    // Get cookies from handshake
    const cookies = cookie.parse(socket.handshake.headers.cookie || '');
    
    if (!cookies.token) {
      return next(new Error('Authentication error'));
    }
    
    // Verify JWT token
    jwt.verify(cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      
      // Store user ID in socket object
      socket.userId = decoded.userId;
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.userId} connected`);
    
    // Automatically join user to their room using userId from the JWT
    socket.join(`user_${socket.userId}`);
    
    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
    });
  });

  return io;
}

module.exports = { initSocket };