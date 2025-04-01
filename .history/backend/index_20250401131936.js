require('dotenv').config();
const express = require("express");
const cors = require("cors");
const passport = require('passport');
const cookieParser = require("cookie-parser");
const path = require('path');
const jwt = require('jsonwebtoken');
require('./config/passport');
const addCategory = require("./routes/addcategory.js");
const addAttributes = require("./routes/addAttributes.js");
const userRouter = require("./routes/userRouter.js");
const addProducts = require("./routes/addProducts.js");
const productUserPrf = require("./routes/ProductUserPrf.js");
const addCountries=require("./routes/addCountries.js")
const app = express();
const PORT = process.env.PORT || 1000;
const server = require('http').createServer(app);

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["POST", "GET", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize()); // Initialize Passport

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", userRouter);
app.use("/api", addCategory);
app.use("/api", addAttributes);
app.use("/api", addProducts);
app.use("/api", productUserPrf);
// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.clearCookie("token");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
      sameSite: "Strict",
    });

    res.redirect(process.env.CORS_ORIGIN || 'http://localhost:3000');
  });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
