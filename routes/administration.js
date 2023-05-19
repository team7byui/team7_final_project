const routes = require("express").Router();
const administrationController = require("../controllers/administration");
const {
  idParamRequired,
  personValidationRules,
  reportValidationErrors,
} = require("../middleware/validate");

routes.get("/", administrationController.findAll);

routes.get("/:position", administrationController.findByPosition);

routes.post(
  "/",
  personValidationRules(),
  reportValidationErrors,
  administrationController.createAdministration
);

routes.put(
  "/:administrationId",
  personValidationRules(),
  idParamRequired("administrationId"),
  reportValidationErrors,
  administrationController.updateAdministration
);

routes.delete(
  "/:administrationId",
  idParamRequired("administrationId"),
  reportValidationErrors,
  administrationController.deleteAdministration
);

module.exports = routes;
