const { body, validationResult } = require('express-validator');

const emailChain = () => body('email').trim().isEmail();
const nameChain = (field) => body(field).trim().isAlpha();
const dateChain = (field) => body(field).trim().isDate({});

const userValidationRules = () => {
  return [
    // username must be an email
    body('username').isAlphanumeric(),
    // password must be at least 5 chars long
    // body('password').isLength({ min: 5 })
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

module.exports = {
  userValidationRules,
  validate
};
