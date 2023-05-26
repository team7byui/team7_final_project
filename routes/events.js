const routes = require('express').Router();
const eventsController = require('../controllers/events');
const {
  idParamRequired,
  reportValidationErrors,
  eventValidationRules,
  userValidationRules,
} = require('../middleware/validate');

routes.get('/', eventsController.getAll);

routes.get('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  eventsController.getSingle);

routes.post('/',
  eventValidationRules(),
  reportValidationErrors(),
  eventsController.createEvent);

routes.put('/:id',
  idParamRequired('id'),
  userValidationRules(),
  reportValidationErrors(),
  eventsController.updateEvent);

routes.delete('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  eventsController.deleteEvent);

module.exports = routes;
