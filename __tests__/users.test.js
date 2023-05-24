const usersController = require('../controllers/users');
const { createControllerTests } = require('./test');
const { MongoClient } = require('mongodb');

// Users Controller Tests
describe('Users Controller', () => {
  createControllerTests(usersController.getSingle);
  createControllerTests(usersController.createUsers);
  createControllerTests(usersController.updateUser);
  createControllerTests(usersController.deleteUser);
});