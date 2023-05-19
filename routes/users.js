const routes = require('express').Router();

const usersController = require('../controllers/users');

routes.get('/:username', usersController.getByUsername);
routes.post('/', usersController.createUsers);
routes.put('/:id', usersController.updateUser);
routes.delete('/:id', usersController.deleteUser);

module.exports = routes;
