const routes = require('express').Router();

const volunteersController = require('../controllers/volunteers');

routes.get('/', volunteersController.getAll);
routes.get('/:id', volunteersController.getSingle);
routes.post('/', volunteersController.createVolunteer);
routes.put('/:username', volunteersController.updateVolunteer);
routes.delete('/:username', volunteersController.deleteVolunteer);

module.exports = routes;
