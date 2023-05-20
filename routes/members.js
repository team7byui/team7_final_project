const routes = require('express').Router();

const membersController = require('../controllers/members');

routes.get('/', membersController.getAll);
routes.get('/:memberId', membersController.getSingle);
routes.post('/', membersController.createMembers);
routes.put('/:memberId', membersController.updateMember);
routes.delete('/:memberId', membersController.deleteMember);

module.exports = routes;
