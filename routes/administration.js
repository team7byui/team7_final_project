const routes = require('express').Router();
const administrationController = require('../controllers/administration');
const {
  idParamRequired,
  personValidationRules,
  reportValidationErrors,
} = require('../middleware/validate');

routes.get('/', administrationController.findAllAdmin);

routes.get('/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  administrationController.getSingle
);

routes.post(
  '/',
  personValidationRules(),
  reportValidationErrors(),
  administrationController.createAdministration
);

routes.put(
  '/:id',
  idParamRequired('id'),
  personValidationRules(),
  reportValidationErrors(),
  administrationController.updateAdministration
);

routes.delete(
  '/:id',
  idParamRequired('id'),
  reportValidationErrors(),
  administrationController.deleteAdministration
);

module.exports = routes;
