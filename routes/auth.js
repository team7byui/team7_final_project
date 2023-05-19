const express = require('express');
const passport = require('passport');
const router = express.Router();
const app = express();

router.get('/auth/google', (req, res) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      res.send(err);
    } else if (user) {
      res.redirect('https://team7-final-project-jsuddsjr.onrender.com/api-docs/');
    } else {
      res.redirect('https://team7-final-project-jsuddsjr.onrender.com/');
    }
  });
});

router.get('/auth/facebook', (req, res) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      res.send(err);
    } else if (user) {
      res.redirect('https://team7-final-project-jsuddsjr.onrender.com/api-docs/');
    } else {
      res.redirect('https://team7-final-project-jsuddsjr.onrender.com/');
    }
  });
});

app.use('/auth', router);

exports.router = router;
