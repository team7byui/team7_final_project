const routes = require('express').Router();
const membersController = require('../controllers/members');
const Member = require('../models/member.js');
const {
  idParamRequired,
  personValidationRules,
  reportValidationErrors,
  ensureUniqueEmail,
} = require('../middleware/validate');

routes.get('/', membersController.getAll);

routes.get('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  membersController.getSingle);

routes.post('/',
  personValidationRules(),
  ensureUniqueEmail(Member),
  reportValidationErrors(),
  membersController.createMembers);

routes.put('/:id',
  idParamRequired('id'),
  personValidationRules(),
  ensureUniqueEmail(Member),
  reportValidationErrors(),
  membersController.updateMember);

routes.delete('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  membersController.deleteMember);

module.exports = routes;
