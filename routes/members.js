const routes = require('express').Router();

const membersController = require('../controllers/members');

routes.put('/:memberId', membersController.updateMember);
routes.delete('/:memberId', membersController.deleteMember);


module.exports = routes; 