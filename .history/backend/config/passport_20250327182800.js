const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const promisePool = require('../db/dbconfig');  // Assuming promisePool is set up correctly
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8081/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, name, photos } = profile;
  const email = emails[0].value;
  const baseUsername = `${name.givenName}${name.familyName.slice(0, 2)}`; // Base username from email

  // Function to generate a unique username
  const generateUniqueUsername = async (baseUsername) => {
    const checkUsernameQuery = "SELECT COUNT(*) as count FROM users WHERE username = ?";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generate a random 4-digit number
    const newUsername = `${baseUsername}${randomSuffix}`;

    try {
      const [results] = await promisePool.query(checkUsernameQuery, [newUsername]);
      if (results[0].count > 0) {
        // If the generated username exists, try again
        return await generateUniqueUsername(baseUsername);
      } else {
        // If the generated username is unique, return it
        return newUsername;
      }
    } catch (err) {
      throw new Error("Error checking username availability: " + err);
    }
  };

  try {
    // Check if user exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    const [results] = await promisePool.query(checkUserQuery, [email]);

    if (results.length > 0) {
      // User exists
      return done(null, results[0]);
    } else {
      // New user - Generate a unique username
      const uniqueUsername = await generateUniqueUsername(baseUsername);

      // Insert new user into the database
      const insertUserQuery = "INSERT INTO users (username, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?)";
      const [insertResult] = await promisePool.query(insertUserQuery, [uniqueUsername, name.givenName, name.familyName, email, 'user']);

      // Fetch the newly inserted user
      const [newUser] = await promisePool.query(checkUserQuery, [email]);
      return done(null, newUser[0]);
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const getUserQuery = "SELECT * FROM users WHERE user_id = ?";
    const [results] = await promisePool.query(getUserQuery, [id]);
    done(null, results[0]);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
