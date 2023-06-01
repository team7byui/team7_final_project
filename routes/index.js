const router = require('express').Router();

router.get('/', /* #swagger.ignore = true */(req, res) => res.redirect('/api-docs'));

router.use('/api-docs', /* #swagger.ignore=true */ require('./swagger'));
router.use('/auth',     /* #swagger.ignore=true */ require('./auth'));

router.use('/administration', /* #swagger.tags = ['Administration'] */ require('./administration'));
router.use('/users',          /* #swagger.tags = ['Users'] */          require('./users'));
router.use('/members',        /* #swagger.tags = ['Members'] */        require('./members'));
router.use('/events',         /* #swagger.tags = ['Events'] */         require('./events'));
router.use('/volunteers',     /* #swagger.tags = ['Volunteers'] */     require('./volunteers'));


module.exports = router;
