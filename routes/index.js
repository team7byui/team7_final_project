const router = require('express').Router();

router.get('/', (request, response) => {
  response.send('Index page.');
});

router.use('/administration', require('./administration.js'));

module.exports = router;
