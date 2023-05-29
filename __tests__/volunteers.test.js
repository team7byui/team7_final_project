const volunteersController = require('../controllers/volunteers');
const { createControllerTests, getAllTest } = require('./test');

volunteersController.toString = () => 'VolunteersController';

// Volunteers Controller Tests
describe('Volunteers Controller', () => {
  createControllerTests(volunteersController.getAll);
  getAllTest(volunteersController, volunteersController.getAll);
  createControllerTests(volunteersController.getSingle);
  createControllerTests(volunteersController.createVolunteer);
  createControllerTests(volunteersController.updateVolunteer);
  createControllerTests(volunteersController.deleteVolunteer);
});