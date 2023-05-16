const router = require('express').Router();

router.get('/', (request, response) => {
  response.send('Index page.');
});

module.exports = router;
