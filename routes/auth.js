const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(401).send('Access denied.');
});

// @desc   Auth with Google
// @route  GET /auth/google
router.get('/google', (req, res, next) => {
  // #swagger.tags=['Auth']
  // #swagger.summary=Start Google authorization flow.
  next();
}, passport.authenticate('google', { scope: ['profile'] }));

// @desc Google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', (req, res, next) => {
  // #swagger.tags=['Auth']
  // #swagger.summary=Finish Google authorization flow.
  next();
}, passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect:'/api-docs'
}));

router.get('/login', (req, res, next) => {
  /*
    #swagger.tags=['Auth']
    #swagger.summary=Start local authorization flow.
    #swagger.consumes = ['application/json']
    #swagger.parameters['username'] = {
      "in": "body",
      "required": true,
      "type": "string"
    }
    #swagger.parameters['password'] = {
      "in": "body",
      "required": true,
      "type": "string"
    }
  */
  next();
}, passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/api-docs'
}));

// @desc Logout user
// @route /auth/logout
router.get('/logout', (req, res) => {
  /*
    #swagger.tags=['Auth']
    #swagger.summary=Log out.
    #swagger.description=Remove user session variables.
    #swagger.responses[302] = {
      description: 'Successful logout.'
    }
  */
  req.logout(null, (err) => {
    if (err) {
      if (err instanceof Error) throw err;
      throw new Error(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
