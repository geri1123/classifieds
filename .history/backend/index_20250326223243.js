require('dotenv').config();

const express = require("express");
const cors = require("cors");


const cookieParser = require("cookie-parser");

const path = require('path');

const jwt = require('jsonwebtoken');
const addCategory = require("./routes/addcategory.js"); // Fix typo: `addcayegory` → `addcategory`
const addAttributes = require("./routes/addAttributes.js"); // Fix typo: `addAtributes` → `addAttributes`
const userRouter=require("./routes/userRouter.js");
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 8081;

const server = require('http').createServer(app);

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/add", addProductRouter);


app.use("/api", userRouter);
app.use("/api",addCategory);
app.use("/api",addAttributes);
app.get("/", (req, res) => {
  res.send(`Welcome to the server on port ${PORT}`);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.clearCookie("token");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Secure cookie in production
      maxAge: 3600000, // 1 hour
      sameSite: "Strict",
    });

    res.redirect(process.env.CORS_ORIGIN || 'http://localhost:3000');
  });


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});