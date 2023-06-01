const { Model } = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const {
  body,
  oneOf,
  param,
  validationResult,
} = require('express-validator');
const { runAllChains } = require('express-validator/src/utils');

const isValidObjectId = (id) =>
  ObjectId.isValid(id) && String(new ObjectId(id)) === id;

const emailChain = () =>
  body('email')
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
    .custom((value, meta) => {
      var test = new Date(value);
      if (isNaN(test)) {
        throw new Error(`${meta.path}: '${value}' couldn't be parsed as a date.`);
      }
      return true;
    });

const isoDateChain = (field) =>
  body(field)
    .notEmpty()
    .isISO8601()
    .withMessage('Not a valid ISO8601 date format.');

// const timeChain = (field) =>
//   body(field)
//     .trim()
//     .isTime()
//     .withMessage(
//       (value, meta) => `${meta.path}: '${value}' doesn't appear to be a time in HH:MM format.`
//     );

const requiredBodyChain = (field) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage((value, meta) => `${meta.path} is required.`);

/**
 * Prevent submitting duplicate email.
 * @param {import('mongoose').Model} model The model to query
 * @param {string} [email] Name of email field in body, optional
 * @param {string} [id] Name of the id parameter, optional
 * @returns {import('express-validator').ValidationChain} Validation chain
 */
const ensureUniqueEmail = (model, email = 'email', id = 'id') =>
  body(email).optional().isEmail().bail().custom(async (value, meta) => {
    const myId = isValidObjectId(meta.req.params[id])
      ? meta.req.params[id]
      : undefined;
    const query = {
      '_id': { $ne: myId },
      [email]: value
    };
    const result = await model.findOne(query);
    if (result) {
      throw new Error('E100: Specified email already in use.');
    }
  });

/**
 * Prevent submitting either duplicate username or googleId.
 * @param {Model} model The model to query
 * @param {string} username Name of username field, optional
 * @param {string} id Name of id parameter, optional
 * @returns {import('express-validator').ValidationChain} Validation chain
 */
const ensureUniqueUser = (model, username = 'username', id = 'id') =>
  body(username).notEmpty().bail().custom(async (value, meta) => {
    const myId = isValidObjectId(meta.req.params[id])
      ? meta.req.params[id]
      : undefined;
    const query = {
      '_id': { $ne: myId },
      [username]: value
    };
    const result = await model.findOne(query);
    if (result) {
      throw new Error('E100: Specified username already in use.');
    }
  });

module.exports = {
  /**
   * Ensures route parameter is a valid 'ObjectId'
   * @param {string} [id] The object property to validate
   * @returns {import('express-validator').ValidationChain} Validation chain
   */
  idParamRequired: (id='id') => param(id).exists().custom(isValidObjectId),

  ensureUniqueEmail,
  ensureUniqueUser,

  /**
   * Applies rules for username and password.
   * @returns {import('express-validator/src/chain').ContextRunner} Validation chain
   */
  userValidationRules: () => oneOf([
    [
      body('password')
        .isLength({min: 8, max:26})
        .withMessage('Password must be at least 8 characters, and no more than 26 characters long.')
        .isStrongPassword()
        .withMessage(
          'Password must contain at 1 lowercase, 1 uppercase, 1 number, and 1 symbol character.'
        )
    ],
    [
      body('password').isEmpty(),
      body('email').notEmpty()
    ],
  ], {
    errorType: 'least_errored'
  }),

  /**
   * Applies rules for firstName, lastName, phoneNumber, and email.
   * @returns {import('express-validator').ValidationChain} Validation chain
   */
  personValidationRules: () => [
    requiredBodyChain(['firstName', 'lastName']),
    phoneChain(),
    emailChain(),
    dateChain('birthday').optional()
  ],

  /**
   * Applies rules for title, date, time, and location.
   * @returns {import('express-validator').ValidationChain} Validation chain
   */
  eventValidationRules: () =>
    requiredBodyChain(['title','location','details']).if(oneOf([
      [
        isoDateChain('startDate'),
        isoDateChain('endDate')
      ],
      [
        isoDateChain('startDate'),
        body('duration').matches(/^PT\d+H(\d{2}M)?/).withMessage((value, meta) =>
          `${meta.path}: '${value}' doesn't match format PTnH or PTnHnM`
        )
      ],
      [
        dateChain('date'),
        body('time').notEmpty()
      ]
    ], {
      message: 'Could not determine when the event would start and end.',
      errorType: 'least_errored'
    })),

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
   * @param {import('express-validator').ValidationChain} chains One or more validation chains
   * @returns {RouteHandler} Intercept validation errors
   */
  reportValidationErrors: (...chains) => async (req, res, next) => {

    if (chains) {
      // TODO: Report this issue to the developer.
      // The "oneOf" middleware doesn't have a builder, so runAllChains barfs.
      const fakeBuilder = { build: () => ({}) };
      const safeChains = chains.map(ch => {
        if (Array.isArray(ch)) {
          ch = oneOf([ch]);
        }
        if (!ch.builder) {
          ch.builder = fakeBuilder;
        }
        return ch;
      });
      // END HACK

      await runAllChains(req, safeChains);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json(errors);
  },
};
