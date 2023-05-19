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
      (value, meta) => `${meta.path}: '${value}' doesn't appear to be a date.`
    );

const timeChain = (field) =>
  body(field)
    .trim()
    .isTime()
    .withMessage(
      (value, meta) => `${meta.path}: '${value}' doesn't appear to be a time.`
    );

const requiredChain = (field) =>
  body(field)
    .trim()
    .exists({ values: 'falsy' })
    .withMessage((value, meta) => `${meta.path} is required.`);

module.exports = {
  /**
   * Ensures route parameter is a valid 'ObjectId'
   * @param {string} field
   */
  idParamRequired: (field) => {
    return [param(field).custom(isValidObjectId)];
  },

  /**
   * Applies rules for username and password.
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
   */
  eventValidationRules: () => {
    return [
      requiredChain('title'),
      dateChain('date'),
      timeChain('time'),
      requiredChain('location'),
    ];
  },

  /**
   * Default handler for validation errors.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns Handler function for route
   */
  reportValidationErrors: () => (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json(errors);
  },
};
