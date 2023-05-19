const routes = require('express').Router();

const volunteersController = require('../controllers/volunteers');

routes.get('/', volunteersController.getAll);
routes.get('/:event', volunteersController.getOneEvent);
routes.post('/', volunteersController.createVolunteer);
routes.put('/:id', volunteersController.updateVolunteer);
routes.delete('/:id', volunteersController.deleteVolunteer);

module.exports = routes;
