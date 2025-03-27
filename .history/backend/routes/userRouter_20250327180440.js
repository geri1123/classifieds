

const express = require("express");
const db = require("../db/dbconfig");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

// const {sendPasswordchanged ,sendRegisteredEmail }=require("../services/emailService.js");
//
const passport = require('passport');
//
const multer = require("multer");
const path=require("path");
const { error } = require("console");
const verifyToken = require("../modules/verifyToken.js"); 

//
// Google Auth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/', session: false }), 
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    
    try {
      const token = jwt.sign({ userId: req.user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.clearCookie("token");

      // Set the new JWT token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  // Secure cookie in production
        maxAge: 3600000, // 1 hour
        sameSite: "Strict",
      });

      res.redirect(process.env.CORS_ORIGIN || 'http://localhost:3000');
    } catch (err) {
      console.error("Error generating token:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);
router.post("/signup-user", async (req, res) => {
  const { username, first_name, last_name, email, password, repeatpassword, termsAccepted } = req.body;
  let errors = {};

  // Validation checks
  if (!username) errors.username = "Please fill the username field.";
  else if (username.length < 4) errors.username = "Username must be more than 4 characters.";

  if (!first_name) errors.first_name = "Please fill the first name field.";
  if (!last_name) errors.last_name = "Please fill the last name field.";
  if (!email) errors.email = "Please fill the email field.";
  if (!password) errors.password = "Please fill the password field.";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters long.";
  if (repeatpassword !== password) errors.repeatpassword = "Passwords do not match";
  if (!termsAccepted) {
    errors.terms = "You must accept the terms and conditions.";
  }

  // If there are any validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if email already exists
    const [emailResults] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (emailResults.length > 0) {
      return res.status(422).json({ errors: { email: "Email already in use" } });
    }

    // Check if username already exists
    const [usernameResults] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (usernameResults.length > 0) {
      return res.status(422).json({ errors: { username: "Username already in use" } });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const insertQuery = "INSERT INTO users (username, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(insertQuery, [username.trim(), first_name, last_name, email, hashedPassword]);

    res.json({ success: true, message: "User registered successfully", username });
  } catch (err) {
    console.error("Error processing signup:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// router.post("/signin", async (req, res) => {
//     const { identifier, user_password } = req.body;
  
//     if (!identifier || !user_password) {
//       return res.status(400).json({ errors: "Please fill in all fields." });
//     }
   
//     const checkUserQuery = "SELECT * FROM `users` WHERE username = ? OR email = ?";
//     db.query(checkUserQuery, [identifier, identifier], async (err, results) => {
//       if (err || results.length === 0) {
//         return res.status(404).json({ errors: "User not found." });
//       }
  
//       const user = results[0];
  
//       if (!(await bcrypt.compare(user_password, user.password))) {
//         return res.status(401).json({ errors: "Invalid  password." });
//       }
//       const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//       // const token = jwt.sign({ userId: user.user_id }, "secret_user", { expiresIn: "1h" });
  
//       res.clearCookie("token"); // Ensure old token is cleared if any
      
//       res.cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         maxAge: 3600000, // 1 hour
//         sameSite: "Strict",
//       });
  
//       res.json({ success: true });
//     });
//   });
router.post("/signin", async (req, res) => {
  const { identifier, user_password } = req.body;

  if (!identifier || !user_password) {
    return res.status(400).json({ errors: "Please fill in all fields." });
  }

  try {
      // Use promisePool to query the database
      const [results] = await db.query("SELECT * FROM `users` WHERE username = ? OR email = ?", [identifier, identifier]);
      
      if (results.length === 0) {
          return res.status(404).json({ errors: "User not found." });
      }

      const user = results[0];

      // Compare password using bcrypt
      if (!(await bcrypt.compare(user_password, user.password))) {
          return res.status(401).json({ errors: "Invalid password." });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      
      // Clear any old token
      res.clearCookie("token");

      // Set the new token as a cookie
      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",  // Secure cookie in production
          maxAge: 3600000, // 1 hour
          sameSite: "Strict",
      });

      res.json({ success: true });

  } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Server error" });
  }
});


// router.get("/check-auth", verifyToken, (req, res) => {
//   if (!req.userId) {
//     return res.status(401).json({ isAuthenticated: false }); // Explicit failure
//   }
//   res.json({ isAuthenticated: true, userId: req.userId });
// });
router.get("/check-auth", verifyToken, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ isAuthenticated: false }); // Explicit failure if userId is missing
  }

  try {
    // Check if the user exists in the database
    const [results] = await db.query("SELECT * FROM users WHERE user_id = ?", [userId]);

    if (results.length === 0) {
      return res.status(401).json({ isAuthenticated: false }); // User not found, authentication failed
    }

    res.json({ isAuthenticated: true, userId: userId });
  } catch (err) {
    console.error("Error checking authentication:", err);
    return res.status(500).json({ error: "Server error" }); // Internal server error
  }
});
// Streamlined /user-info route
router.get("/user-info", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    // Use promisePool to query the database
    const [results] = await db.query("SELECT * FROM `users` WHERE user_id = ?", [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    delete user.user_password; // Remove sensitive information

    if (user.profile_img) {
      user.profile_img = `${process.env.SERVER_URL}/${user.profile_img}`;
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allowed file types
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
});

// updateProfileimg

router.post("/update-profileImg", verifyToken, upload.single("profile_img"), async (req, res) => {
  const userId = req.userId; // Extract user ID from token
  const newProfileImgPath = req.file ? `uploads/${req.file.filename}` : undefined;

  try {
    // Step 1: Fetch the current profile image path
    const [results] = await db.query("SELECT profile_img FROM `users` WHERE user_id = ?", [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentProfileImgPath = results[0].profile_img;

    // Step 2: Delete the current profile image if it exists
    if (currentProfileImgPath) {
      const fullCurrentProfileImgPath = path.resolve(__dirname, "..", currentProfileImgPath);
      fs.unlink(fullCurrentProfileImgPath, (fsErr) => {
        if (fsErr && fsErr.code !== "ENOENT") {
          console.error("Error deleting current profile image:", fsErr);
        } else {
          console.log("Current profile image deleted or did not exist:", fullCurrentProfileImgPath);
        }
      });
    }

    // Step 3: Update the user's profile image in the database
    await db.query("UPDATE `users` SET profile_img = ? WHERE user_id = ?", [newProfileImgPath, userId]);

    res.json({ success: true, profilePicture: newProfileImgPath });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// //change about me 
router.post("/update-about-me", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { about_me } = req.body;

  try {
    // Update the "about_me" field in the database
    const [result] = await db.query("UPDATE `users` SET about_me = ? WHERE user_id = ?", [about_me, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found or no changes made" });
    }

    res.json({ success: true, message: "About me updated successfully" });
  } catch (err) {
    console.error("Error updating user profile:", err);
    return res.status(500).json({ error: "Server error" });
  }
});



// //update email
router.post("/update-email", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please enter an email" });
  }

  try {
    // Check if the email already exists for another user
    const [results] = await db.query("SELECT * FROM `users` WHERE email = ? AND user_id != ?", [email, userId]);

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Update the email in the database
    const [updateResults] = await db.query("UPDATE `users` SET email = ? WHERE user_id=?", [email, userId]);

    res.json({ success: true, message: "User information updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// //Update phone nr
router.post("/update-phone", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Please enter a phone number" });
  }

  try {
    // Check if the phone number already exists for another user
    const [results] = await db.query("SELECT * FROM `users` WHERE phone = ? AND user_id != ?", [phone, userId]);

    if (results.length > 0) {
      return res.status(400).json({ error: "Phone number already exists." });
    }

    // Update the phone number in the database
    const [updateResults] = await db.query("UPDATE `users` SET phone = ? WHERE user_id=?", [phone, userId]);

    res.json({ success: true, message: "User information updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// //update last and first name
router.post("/update-firstnamelastName" , verifyToken  ,(req , res)=>{
  const userId=req.userId;
  const {first_name , last_name}=req.body;
  if(!first_name || !last_name){
    return res.status(400).json({error:"Please fill all fields"});
  }
  const updateNameDb="UPDATE `users` SET first_name = ? , last_name = ? WHERE user_id = ?";
  db.query(updateNameDb, [first_name ,last_name, userId] , (err, result)=>{
    if(err){
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json({ success: true, message: "User name and last name updated successfully." });
  });
})

// //updateUsername

router.post("/update-username", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { username } = req.body;

  if (!username || username.trim() === "") {
    return res.status(400).json({ error: "Username must not be empty." });
  }

  if (username.length < 4) {
    return res.status(400).json({ error: "Username must be at least 4 characters long." });
  }

  try {
  
    const io = req.app.get('socketio');

    setTimeout(() => {
      let notificationMessage = "";

      notificationMessage = "Emri juaj i përdoruesit është ndryshuar. Ju nuk mund ta ndryshoni emrin e përdoruesit për 10 ditët e ardhshme.";

      if (notificationMessage) {
        const notificationQuery = `
          INSERT INTO notifications (user_id, message)
          VALUES (?, ?)
        `;
        db.query(notificationQuery, [req.userId, notificationMessage], (notifErr) => {
          if (notifErr) {
            console.error("Error inserting notification:", notifErr.message);
          } else {
            io.emit('notification', { userId: req.userId, message: notificationMessage });
          }
        });
      }
    }, 10000);

    const getUserQuery = `
      SELECT username, last_username_update, next_username_update
      FROM \`users\`
      WHERE user_id = ?
    `;
    db.query(getUserQuery, [userId], (err, userResult) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ error: "Server error" });
      }

      const currentUser = userResult[0];
      const currentUsername = currentUser?.username;
      const lastUsernameUpdate = currentUser?.last_username_update;
      const nextUsernameUpdate = currentUser?.next_username_update;

      const currentDate = new Date();

      if (username !== currentUsername && nextUsernameUpdate && new Date(nextUsernameUpdate) > currentDate) {
        return res.status(400).json({
          error: `You cannot change your username until ${new Date(nextUsernameUpdate).toLocaleString()}.`,
        });
      }

      const checkUsernameQuery = `
        SELECT * FROM \`users\`
        WHERE username = ?
          AND user_id != ?
      `;
      db.query(checkUsernameQuery, [username, userId], (err, usernameResult) => {
        if (err) {
          console.error("Error checking username:", err);
          return res.status(500).json({ error: "Server error" });
        }

        if (usernameResult.length > 0) {
          return res.status(400).json({ error: "Username is already in use." });
        }

        // Determine the next username update block only if the username changes
        const tenDaysFromNow = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000);
        const updateUserQuery = `
          UPDATE \`users\`
          SET
            username = ?,
            last_username_update = ?,
            next_username_update = ?
          WHERE user_id = ?
        `;
        const updateValues = username === currentUsername
          ? [username, lastUsernameUpdate, nextUsernameUpdate, userId]
          : [username, currentDate, tenDaysFromNow, userId];

        db.query(updateUserQuery, updateValues, (err, updateResult) => {
          if (err) {
            console.error("Error updating user info:", err);
            return res.status(500).json({ error: "Server error" });
          }

          res.json({
            success: true,
            message: "Username updated successfully.",
            lastUsernameUpdate: username === currentUsername ? lastUsernameUpdate : currentDate,
            nextUsernameUpdate: username === currentUsername ? nextUsernameUpdate : tenDaysFromNow,
          });
        });
      });
    });
  } catch (err) {
    console.error("Error updating user info:", err);
    return res.status(500).json({ error: "Server error" });
  }
});










////////////////////////////////

// change password

router.post("/change-password", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters long." });
  }

  if (newPassword === currentPassword) {
    return res.status(400).json({ error: "New password must be different from the current password." });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: "New password and confirm password do not match." });
  }

  try {
    
    const getUserQuery = "SELECT email ,password , receive_notifications 	 FROM `users` WHERE user_id = ?";
    db.query(getUserQuery, [userId], async (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      const user = results[0];
      const { email, receive_notifications } = user;
      // Compare the current password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Current password is incorrect." });
      }

      
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

   
      const updatePasswordQuery = "UPDATE `users` SET password = ? WHERE user_id = ?";
      db.query(updatePasswordQuery, [hashedNewPassword, userId], (err, result) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ error: "Server error" });
        }
    //     if (receive_notifications){
    //       sendPasswordchanged(email);
    //   }
        res.json({ success: true, message: "Password updated successfully" });
      });
    });
  } catch (err) {
    console.error("Error checking user password:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/update-social-media", verifyToken, (req, res) => {
  const userId = req.userId;
  const { instagram, facebook, linkedin, fiver } = req.body; // "fiverr" in frontend, "fiver" in DB

  console.log("User ID:", userId);
  console.log("Received Data:", req.body);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user ID found" });
  }

  const updateQuery = `
    UPDATE users
    SET instagram = ?, facebook = ?, linkedin = ?, fiver = ?
    WHERE user_id = ?
  `;

  db.query(updateQuery, [instagram, facebook, linkedin, fiver, userId], (err, result) => {
    if (err) {
      console.error("Error updating social media:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json({ message: "Social media updated successfully" });
  });
});

// notifcation with email



router.post('/receiveNotification', verifyToken, (req, res) => {
  const userId = req.userId; 
  const { receive_notifications  } = req.body;

  if (typeof receive_notifications  !== 'boolean') {
    return res.status(400).json({ error: "receiveNotifications must be a boolean" });
  }

  const userdb = 'UPDATE `users` SET receive_notifications = ? WHERE user_id = ?';

  // Execute the query
  db.query(userdb, [receive_notifications , userId], (err, result) => {
    if (err) {
      console.error("Error updating notification:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: "Notification preference updated successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  });
});

// router.post("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.json({ success: true, message: "Logged out" });
// });

router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ success: true, message: "Logged out" });
});



module.exports = router;
