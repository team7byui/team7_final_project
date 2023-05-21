const routes = require('express').Router();
const membersController = require('../controllers/members');
const {
  idParamRequired,
  personValidationRules,
  reportValidationErrors,
} = require('../middleware/validate');

routes.get('/', membersController.getAll);

routes.get('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  membersController.getSingle);

routes.post('/',
  personValidationRules(),
  reportValidationErrors(),
  membersController.createMembers);

routes.put('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  personValidationRules(),
  membersController.updateMember);

routes.delete('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  membersController.deleteMember);

module.exports = routes;
