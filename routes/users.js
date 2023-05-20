const routes = require('express').Router();

const usersController = require('../controllers/users');

routes.get('/:id', usersController.getSingle);
routes.post('/', usersController.createUsers);
routes.put('/:id', usersController.updateUser);
routes.delete('/:id', usersController.deleteUser);

module.exports = routes;
