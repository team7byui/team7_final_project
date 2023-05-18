const router = require('express').Router();

router.get('/', (request, response) => {
  response.send('Index page.');
});
router.use('/administration', require('./administration'));
router.use('/users', require('./users'));
router.use('/members', require('./members'));
router.use('/events', require('./events'));
router.use('/volunteers', require('./volunteers'));
module.exports = router;
