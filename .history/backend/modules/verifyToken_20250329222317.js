// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(200).json({ message: "Token not found, please login" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.error("Token verification failed:", err);
//       return res.status(200).json({ message: "Invalid or expired token, please login again" });
//     }

//     req.userId = decoded.userId;
//     next();
//   });
// };

// modules/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Check for token in cookies (client-side requests)
  let token = req.cookies.authToken;
  
  // If not in cookies, check Authorization header (server-side requests)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    
    // Extract token from "Bearer <token>"
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

module.exports = verifyToken;