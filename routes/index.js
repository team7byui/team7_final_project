const router = require('express').Router();

router.get('/', (request, response) => {
  response.redirect('/api-docs');
});

router.use('/administration', require('./administration'));
router.use('/users', require('./users'));
router.use('/members', require('./members'));
router.use('/events', require('./events'));
router.use('/volunteers', require('./volunteers'));
router.use('/', require('./swagger'));

module.exports = router;
