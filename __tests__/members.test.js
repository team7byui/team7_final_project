const membersController = require('../controllers/members');
const { createControllerTests, getAllTest } = require('./test');

membersController.toString = () => 'MembersController';

// Members Controller Tests
describe('Members Controller', () => {
  createControllerTests(membersController.getAll);
  getAllTest(membersController, membersController.getAll);
  createControllerTests(membersController.getSingle);
  createControllerTests(membersController.createMembers);
  createControllerTests(membersController.updateMember);
  createControllerTests(membersController.deleteMember);
});