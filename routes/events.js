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
  idParamRequired('id'),
  reportValidationErrors(),
  eventsController.getSingle);

routes.post('/',
  isAuthenticated,
  eventValidationRules(),
  reportValidationErrors(),
  eventsController.createEvent);

routes.put('/:id',
  isAuthenticated,
  idParamRequired('id'),
  eventValidationRules(),
  reportValidationErrors(),
  eventsController.updateEvent);

routes.delete('/:id',
  isAuthenticated,
  idParamRequired('id'),
  reportValidationErrors(),
  eventsController.deleteEvent);

module.exports = routes;
