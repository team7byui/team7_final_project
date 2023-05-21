const routes = require('express').Router();
const usersController = require('../controllers/users');
const {
  idParamRequired,
  reportValidationErrors,
  userValidationRules,
} = require('../middleware/validate');

routes.get('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  usersController.getSingle);

routes.post('/',
  userValidationRules(),
  reportValidationErrors(),
  usersController.createUsers);

routes.put('/:id',
  idParamRequired('id'),
  userValidationRules(),
  reportValidationErrors(),
  usersController.updateUser);

routes.delete('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  usersController.deleteUser);

routes.get('/exists/:username',
  usersController.checkUserExists);

module.exports = routes;
