require('dotenv').config();

const express = require("express");
const cors = require("cors");
const createuser=require("./routes/createUser.js");
const addProductRouter = require("./routes/addProductRouter.js");
const cookieParser = require("cookie-parser");
const loginuser=require("./routes/loginuser.js");
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const addCategory = require("./routes/addcategory.js"); // Fix typo: `addcayegory` → `addcategory`
const addAttributes = require("./routes/addAttributes.js"); // Fix typo: `addAtributes` → `addAttributes`
const userinfo=require("./routes/userinfo.js");
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
app.use("/api", createuser);
app.use("/auth",loginuser);

app.use("/api",addCategory);
app.use("/api",addAttributes);
app.get("/", (req, res) => {
  res.send(`Welcome to the server on port ${PORT}`);
});




server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});