const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({ message: "Token not found, please login" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(200).json({ message: "Invalid or expired token, please login again" });
    }

    req.userId = decoded.userId;
    next();
  });
};


