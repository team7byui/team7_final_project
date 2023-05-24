const volunteersController = require('../controllers/volunteers');
const { createControllerTests } = require('./test');
const { MongoClient } = require('mongodb');

// Volunteers Controller Tests
describe('Volunteers Controller', () => {
  createControllerTests(volunteersController.getAll);
  createControllerTests(volunteersController.getSingle);
  createControllerTests(volunteersController.createVolunteer);
  createControllerTests(volunteersController.updateVolunteer);
  createControllerTests(volunteersController.deleteVolunteer);
});