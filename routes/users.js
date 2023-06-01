const routes = require('express').Router();
const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  idParamRequired,
  reportValidationErrors,
  userValidationRules,
  ensureUniqueUser
} = require('../middleware/validate');
const {User} = require('../models');

routes.get('/:id',
  isAuthenticated,
  reportValidationErrors(
    idParamRequired('id')
  ),
  usersController.getSingle);

routes.post('/',
  isAuthenticated,
  userValidationRules(),
  ensureUniqueUser(User),
  reportValidationErrors(),
  usersController.createUsers);

routes.put('/:id',
  isAuthenticated,
  userValidationRules(),
  ensureUniqueUser(User),
  reportValidationErrors(idParamRequired('id')),
  usersController.updateUser);

routes.delete('/:id',
  isAuthenticated,
  reportValidationErrors(
    idParamRequired('id')
  ),
  usersController.deleteUser);

routes.get('/exists/:username',
  usersController.checkUserExists);

module.exports = routes;
