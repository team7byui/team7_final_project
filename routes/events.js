const routes = require('express').Router();

const eventsController = require('../controllers/events');

routes.put('/:eventName', eventsController.updateEvent);
routes.delete('/:eventName', eventsController.deleteEvent);


module.exports = routes; 