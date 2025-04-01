// socket.js
const { Server } = require('socket.io');

let io;  // Declare io here

function initSocket(server) {
  // Initialize the socket server with the provided HTTP server
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinRoom", (userId) => {
      socket.join(`user_${userId}`); // Join user-specific room
      console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;  // Return the io object
}

module.exports = { initSocket };