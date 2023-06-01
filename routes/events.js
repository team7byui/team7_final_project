const routes = require('express').Router();
const eventsController = require('../controllers/events');
const { isAuthenticated } = require('../middleware/authenticate');
const intercept = require('../middleware/intercept.js');
const {
  idParamRequired,
  reportValidationErrors,
  eventValidationRules,
} = require('../middleware/validate');

// Custom middleware to interpret 'date' and 'time' fields.
routes.use(intercept.dateRequest);
routes.use(intercept.dateResponse);

routes.get('/', eventsController.getAll);

routes.get('/:id',
  reportValidationErrors(idParamRequired('id')),
  eventsController.getSingle);

routes.post('/',
  isAuthenticated,
  reportValidationErrors(eventValidationRules()),
  eventsController.createEvent);

routes.put('/:id',
  isAuthenticated,
  reportValidationErrors(idParamRequired('id'), eventValidationRules()),
  eventsController.updateEvent);

routes.delete('/:id',
  isAuthenticated,
  reportValidationErrors(idParamRequired('id')),
  eventsController.deleteEvent);

module.exports = routes;
