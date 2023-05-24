const eventsController = require('../controllers/events');
const { createControllerTests, getAllTest} = require('./test');
const { MongoClient } = require('mongodb');

// Events Controller Tests
describe('Events Controller', () => {
  createControllerTests(eventsController.getAll);
  getAllTest(eventsController, eventsController.getAll)
  createControllerTests(eventsController.getSingle);
  createControllerTests(eventsController.createEvent);
  createControllerTests(eventsController.updateEvent);
  createControllerTests(eventsController.deleteEvent);
});