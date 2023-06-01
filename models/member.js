const { isEmail } = require('is-email-validation');
const mongoose = require('mongoose');

const Member = mongoose.model(
  'Member',
  new mongoose.Schema({
    firstName: {
      type: String,
      required: true,
      description: 'A given name',
      example: 'Samantha',
    },
    lastName: {
      type: String,
      required: true,
      description: 'A family name',
      example: 'Smith',
    },
    address: {
      type: String,
      required: true,
      description: 'A physical address',
      example: '4865 S Frontier Street, Tempe, AZ 85281',
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /\d{10}/.test(value),
        message: (props) =>
          `'${props.value}': Phone number must be 10 digits only.`,
      },
      description: '10-digit phone number',
      example: '1234567890'
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: isEmail,
        message: (props) =>
          `'${props.value}': Not a recognized email format.`,
      },
      description: 'An email address',
      example: 'sammy@example.com'
    },
    birthday: {
      type: String,
      required: true,
      description: 'A birthday a standard date format',
      example: 'February 28, 1984',
    },
    allFamilyMembers: {
      type: String,
      required: true,
      description: 'A comma separated list of first names',
      example: 'Derick, Samantha, Eric, Savannah',
    },
  })
);

module.exports = Member;
