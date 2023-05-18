const routes = require('express').Router();

const volunteersController = require('../controllers/volunteers');

routes.put('/:username', volunteersController.updateVolunteer);
routes.delete('/:username', volunteersController.deleteVolunteer);


module.exports = routes; 