const routes = require('express').Router();

const administrationController = require('../controllers/administration');

routes.get('/:id', administrationController.getSingle);
routes.post('/', administrationController.createAdministration);
routes.put('/:administrationId', administrationController.updateAdministration);
routes.delete(
  '/:administrationId',
  administrationController.deleteAdministration
);

module.exports = routes;
