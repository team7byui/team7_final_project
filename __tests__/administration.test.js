const administrationController = require('../controllers/administration');
const { createControllerTests, getAllTest} = require('./test');

administrationController.toString = () => 'AdministrationController';

// Administration Controller Tests
describe('Administration Controller', () => {
  createControllerTests(administrationController.findAllAdmin);
  getAllTest(administrationController, administrationController.findAllAdmin);
  createControllerTests(administrationController.getSingle);
  createControllerTests(administrationController.createAdministration);
  createControllerTests(administrationController.updateAdministration);
  createControllerTests(administrationController.deleteAdministration);
});
