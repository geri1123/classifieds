const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db/dbconfig');  // Your database configuration
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8081/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, name, photos } = profile;
  const email = emails[0].value;
  const baseUsername = `${name.givenName}${name.familyName.slice(0, 2)}`;// Base username from email

  // Function to generate a unique username
  const generateUniqueUsername = (baseUsername, callback) => {
    const checkUsernameQuery = "SELECT COUNT(*) as count FROM users WHERE username = ?";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    const newUsername = `${baseUsername}${randomSuffix}`;

    db.query(checkUsernameQuery, [newUsername], (err, results) => {
      if (err) return callback(err);

      if (results[0].count > 0) {
        // If the generated username exists, try again
        generateUniqueUsername(baseUsername, callback);
      } else {
        // If the generated username is unique, return it
        callback(null, newUsername);
      }
    });
  };

  // Check if user exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) return done(err);

    if (results.length > 0) {
      // User exists
      return done(null, results[0]);
    } else {
      // New user - Generate a unique username
      generateUniqueUsername(baseUsername, (err, uniqueUsername) => {
        if (err) return done(err);

        // Insert new user into the database
        const insertUserQuery = "INSERT INTO users (username, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?)";
        db.query(insertUserQuery, [uniqueUsername, name.givenName, name.familyName, email, 'user'], (err, result) => {
          if (err) return done(err);

          // Fetch the newly inserted user
          db.query(checkUserQuery, [email], (err, results) => {
            if (err) return done(err);
            return done(null, results[0]);
          });
        });
      });
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  const getUserQuery = "SELECT * FROM users WHERE user_id = ?";
  db.query(getUserQuery, [id], (err, results) => {
    if (err) return done(err);
    done(null, results[0]);
  });
});

module.exports = passport;