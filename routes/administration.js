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
  reportValidationErrors(idParamRequired('id')),
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
  personValidationRules(),
  reportValidationErrors(idParamRequired('id')),
  administrationController.updateAdministration
);

routes.delete(
  '/:id',
  isAuthenticated,
  reportValidationErrors(idParamRequired('id')),
  administrationController.deleteAdministration
);

module.exports = routes;
