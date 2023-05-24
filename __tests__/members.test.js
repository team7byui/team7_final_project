const membersController = require('../controllers/members');
const { createControllerTests } = require('./test');
const { MongoClient } = require('mongodb');

// Members Controller Tests
describe('Members Controller', () => {
  createControllerTests(membersController.getAll);
  createControllerTests(membersController.getSingle);
  createControllerTests(membersController.createMembers);
  createControllerTests(membersController.updateMember);
  createControllerTests(membersController.deleteMember);
});