const { body, validationResult, param, oneOf } = require('express-validator');
const { Model } = require('mongoose');
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
    .custom((value, meta) => {
      var test = new Date(value);
      if (isNaN(test)) {
        throw new Error(`${meta.path}: '${value}' couldn't be parsed as a date.`);
      }
      return true;
    });

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

module.exports = {
  /**
   * Ensures route parameter is a valid 'ObjectId'
   * @param {string} field The object property to validate
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  idParamRequired: (field) => param(field).exists().custom(isValidObjectId),

  /**
   * Prevent submitting duplicate email.
   * @param {import('mongoose').Model} model The model to query
   * @param {string} [email] Name of email field in body, optional
   * @param {string} [id] Name of the id parameter, optional
   * @returns {import('express-validator').ValidationChain} A validation rule
   */
  ensureUniqueEmail: (model, email='email', id='id') =>
    body(email).custom(async (value, meta) => {
      const myId = isValidObjectId(meta.req.params[id])
        ? meta.req.params[id]
        : undefined;
      const query = {
        '_id': {$ne: myId},
        [email]: value
      };
      const result = await model.findOne(query);
      if (result) {
        throw new Error('E100: Specified email already in use.');
      }
    }),

  /**
   * Prevent submitting either duplicate username or googleId.
   * @param {Model} model The model to query
   * @param {string} username Name of username field, optional
   * @param {string} googleId Name of googleId field, optional
   * @param {string} id Name of id parameter, optional
   * @returns {import('express-validator').ValidationChain} A validation rule
   */
  ensureUniqueUser: (model, username='username', googleId='googleId', id='id') =>
    oneOf([
      body(username).notEmpty().custom(async (value, meta) => {
        const myId = isValidObjectId(meta.req.params[id])
          ? meta.req.params[id]
          : undefined;
        const query = {
          '_id': {$ne: myId},
          [username]: value
        };
        const result = await model.findOne(query);
        if (result) {
          throw new Error('E100: Specified username already in use.');
        }
      })
    ],
    [
      body(googleId).notEmpty(),
      body(googleId).custom(async (value, meta) => {
        const myId = isValidObjectId(meta.req.params[id])
          ? meta.req.params[id]
          : undefined;
        const query = {
          '_id': {$ne: myId},
          [googleId]: value
        };
        const result = await model.findOne(query);
        if (result) {
          throw new Error('E100: Specified Google ID already in use.');
        }
      })
    ]),

  /**
   * Applies rules for username and password.
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  userValidationRules: () => [
    // username must be an email
    requiredBodyChain('username'),
    // validate against complexity rules
    body('password')
      .isLength({min: 8, max:26})
      .withMessage('Password must be at least 8 characters, and no more than 26 characters long.')
      .isStrongPassword()
      .withMessage(
        'Password must contain at 1 lowercase, 1 uppercase, 1 number, and 1 symbol character.'
      ),
  ],

  /**
   * Applies rules for firstName, lastName, phoneNumber, and email.
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  personValidationRules: () => [
    requiredBodyChain('firstName'),
    requiredBodyChain('lastName'),
    phoneChain(),
    emailChain(),
    dateChain('birthday').optional()
  ],

  /**
   * Applies rules for title, date, time, and location.
   * @returns {Array<import('express-validator').ValidationChain>} A list of validation rules
   */
  eventValidationRules: () => [
    requiredBodyChain('title'),
    requiredBodyChain('location'),
    oneOf([
      [
        body('startDate').notEmpty().isISO8601(),
        body('endDate').notEmpty().isISO8601()
      ],
      [
        body('startDate').notEmpty().isISO8601(),
        body('duration').notEmpty().matches(/^PT\d+H(\d{2}M)?/).withMessage((value, meta) =>
          `${meta.path}: '${value}' doesn't match format PTnH or PTnHnM`
        )
      ],
      [
        dateChain('date'),
        body('time').notEmpty()
      ]
    ]),
  ],

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
