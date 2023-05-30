const routes = require('express').Router();
const administrationController = require('../controllers/administration');
const { isAuthenticated } = require('../middleware/authenticate');
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

routes.post('/',
  isAuthenticated,
  personValidationRules(),
  reportValidationErrors(),
  administrationController.createAdministration
);

routes.put(
  '/:id',
  isAuthenticated,
  idParamRequired('id'),
  personValidationRules(),
  reportValidationErrors(),
  administrationController.updateAdministration
);

routes.delete(
  '/:id',
  isAuthenticated,
  idParamRequired('id'),
  reportValidationErrors(),
  administrationController.deleteAdministration
);

module.exports = routes;
