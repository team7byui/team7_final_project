const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(401).send('Access denied.');
});

// @desc   Auth with Google
// @route  GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect:'/api-docs'
  }));

router.get('/login',
  passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/api-docs'
  }));

// @desc Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
  req.logout(null, (err) => {
    if (err) {
      if (err instanceof Error) throw err;
      throw new Error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
