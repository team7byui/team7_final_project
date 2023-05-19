const routes = require('express').Router();

const eventsController = require('../controllers/events');

routes.get('/', eventsController.getAll);
routes.get('/:id', eventsController.getSingle);
routes.post('/', eventsController.createEvent);
routes.put('/:eventName', eventsController.updateEvent);
routes.delete('/:eventName', eventsController.deleteEvent);

module.exports = routes;
