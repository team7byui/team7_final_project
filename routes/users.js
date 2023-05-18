const routes = require('express').Router();

const usersController = require('../controllers/users');

routes.put('/:username', usersController.updateUser);
routes.delete('/:username', usersController.deleteUser);


module.exports = routes; 