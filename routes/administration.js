const routes = require('express').Router();

const administrationController = require('../controllers/administration');

routes.put('/:administrationId', administrationController.updateAdministration);
routes.delete('/:administrationId', administrationController.deleteAdministration);

module.exports = routes;
