const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const promisePool = require("../db/dbconfig"); // Ensure this is the correct path to your MySQL database connection

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8081/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, name, photos } = profile;
      const email = emails[0].value;
      const baseUsername = `${name.givenName}${name.familyName.slice(0, 2)}`;

      try {
        // Check if the user already exists
        const checkUserQuery = "SELECT * FROM users WHERE email = ?";
        const [results] = await promisePool.query(checkUserQuery, [email]);

        if (results.length > 0) {
          return done(null, results[0]);
        } else {
          // Insert new user
          const insertUserQuery =
            "INSERT INTO users (username, first_name, last_name, email, role) VALUES (?, ?, ?, ?, ?)";
          await promisePool.query(insertUserQuery, [
            baseUsername,
            name.givenName,
            name.familyName,
            email,
            "user",
          ]);

          const [newUser] = await promisePool.query(checkUserQuery, [email]);
          return done(null, newUser[0]);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

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