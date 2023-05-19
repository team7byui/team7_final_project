const routes = require('express').Router();

const usersController = require('../controllers/users');

routes.get('/:id', usersController.getSingle);
routes.get('/:username', usersController.getByUsername);
routes.post('/', usersController.createUsers);
routes.put('/:username', usersController.updateUser);
routes.delete('/:username', usersController.deleteUser);

module.exports = routes;
