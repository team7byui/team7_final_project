const routes = require('express').Router();

const membersController = require('../controllers/members');

routes.get('/', membersController.getAll);
routes.get('/:id', membersController.getSingle);
routes.post('/', membersController.createMembers);
routes.put('/:id', membersController.updateMember);
routes.delete('/:id', membersController.deleteMember);

module.exports = routes;
