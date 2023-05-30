const routes = require('express').Router();
const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/authenticate');
const {
  idParamRequired,
  reportValidationErrors,
  userValidationRules,
  ensureUniqueUser,
} = require('../middleware/validate');
const {User} = require('../models');

routes.get('/:id',
  isAuthenticated,
  idParamRequired('id'),
  reportValidationErrors(),
  usersController.getSingle);

routes.post('/',
  isAuthenticated,
  userValidationRules(),
  ensureUniqueUser(User),
  reportValidationErrors(),
  usersController.createUsers);

routes.put('/:id',
  isAuthenticated,
  idParamRequired('id'),
  userValidationRules(),
  ensureUniqueUser(User),
  reportValidationErrors(),
  usersController.updateUser);

routes.delete('/:id',
  isAuthenticated,
  idParamRequired('id'),
  reportValidationErrors(),
  usersController.deleteUser);

routes.get('/exists/:username',
  usersController.checkUserExists);

module.exports = routes;
