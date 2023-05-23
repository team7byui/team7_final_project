const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc   Auth with Google
// @route  GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/api-docs/');
});

// @desc   Auth with Facebook
// @route  GET /auth/facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['profile'] }));

module.exports = router;
