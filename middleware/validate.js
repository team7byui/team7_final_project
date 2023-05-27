const { body, validationResult, param } = require('express-validator');
const { passwordPass } = require('../util/passwordComplexityCheck');
const ObjectId = require('mongoose').Types.ObjectId;

const isValidObjectId = (id) =>
  ObjectId.isValid(id) && String(new ObjectId(id)) === id;

const emailChain = () =>
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('The email format is unrecognized.');

const phoneChain = () =>
  body('phoneNumber')
    .whitelist('0123456789')
    .isLength({ min: 10, max: 10 })
    .withMessage('Please use a 10 digit phone number.');

const dateChain = (field) =>
  body(field)
    .trim()
    .isDate()
    .withMessage(
      (value, meta) => `${meta.path}: '${value}' doesn't appear to be a date in YYYY/MM/DD format.`
    );

const timeChain = (field) =>
  body(field)
    .trim()
    .isTime()
    .withMessage(
      (value, meta) => `${meta.path}: '${value}' doesn't appear to be a time in HH:MM format.`
    );

const requiredChain = (field) =>
  body(field)
    .trim()
    .exists({ values: 'falsy' })
    .withMessage((value, meta) => `${meta.path} is required.`);

module.exports = {
  /**
   * Ensures route parameter is a valid 'ObjectId'
   * @param {string} field The object property to validate
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  idParamRequired: (field) => {
    return [param(field).custom(isValidObjectId)];
  },

  /**
   * Applies rules for username and password.
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  userValidationRules: () => {
    return [
      // username must be an email
      requiredChain('username'),
      // validate against complexity rules
      body('password').custom(passwordPass),
    ];
  },

  /**
   * Applies rules for firstName, lastName, phoneNumber, and email.
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  personValidationRules: () => {
    return [
      requiredChain('firstName'),
      requiredChain('lastName'),
      phoneChain(),
      emailChain(),
      dateChain('birthday').optional()
    ];
  },

  /**
   * Applies rules for title, date, time, and location.
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  eventValidationRules: () => {
    return [
      requiredChain('title'),
      //dateChain('date'),
      //timeChain('time'),
      requiredChain('location'),
    ];
  },

  /**
   * @typedef {import('express').Request} Request
   * @typedef {import('express').Response} Response
   * @typedef {import('express').NextFunction} NextFunction
   * @callback RouteHandler
   * @param {Request} req The request
   * @param {Response} res The response
   * @param {NextFunction} next The next handler
   */

  /**
   * Returns route handler for validation errors.
   * @returns {RouteHandler} Intercept validation errors
   */
  reportValidationErrors: () => (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json(errors);
  },
};
