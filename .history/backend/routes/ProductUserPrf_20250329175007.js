const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const promisePool = require("../db/dbconfig");
const verifyToken = require("../modules/verifyToken.js");





module.exports = router;