const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
/**
 * @param {string} accessToken The access token
 * @param {string} [refreshToken] The refresh token
 * @param {import('passport-google-oauth20').Profile} profile The user profile
 * @param {import('passport-google-oauth20').VerifyCallback} done The verify callback
 */
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      done(null, user);
    } else {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails?.find(e => e.verified)?.value,
        image: profile.photos[0].value
      };
      user = await User.create(newUser);
      done(null, user);
    }
  } catch (err) {
    console.error(err);
    done(err, null); // Pass the error to done
  }
}));

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
},
/** @type {import('passport-local').VerifyFunction} */
async function(username, password, cb) {
  try {
    const model = await User.findOne({username},{password:1});

    if (!model) {
      // TODO: We just go ahead and add this user now.
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {username, password: hashedPassword};
      const result = await User.create(user);
      return cb(null, result);
    }

    const validPassword = await bcrypt.compare(password, model.password);
    if (validPassword === false)
      return cb('Wrong password.', false);

    return cb(null, model);
  } catch(error) {
    if (error) { return cb(error); }
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
