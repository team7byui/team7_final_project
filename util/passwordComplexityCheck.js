const passwordComplexity = require('joi-password-complexity');
const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4
};

module.exports.passwordPass = (passwordToCheck) => {
  const result =  passwordComplexity(complexityOptions, 'Password').validate(passwordToCheck);
  if (result.error) {
    throw result.error;
  }
  return true;
};
