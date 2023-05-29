const usersController = require('../controllers/users');
const { createControllerTests } = require('./test');

usersController.toString = () => 'UsersController';

// Users Controller Tests
describe('Users Controller', () => {
  createControllerTests(usersController.getSingle);
  createControllerTests(usersController.createUsers);
  createControllerTests(usersController.updateUser);
  createControllerTests(usersController.deleteUser);
});