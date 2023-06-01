const mongoose = require('mongoose');
const { isEmail } = require('is-email-validation');

const Administration = mongoose.model(
  'Administration',
  new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        description: 'First name',
        example: 'Jane',
      },
      lastName: {
        type: String,
        required: true,
        description: 'Last name',
        example: 'Seymour',
      },
      address: {
        type: String,
        required: true,
        description: 'Home address',
        example: '847 Pimpernel Street, Marquette, MI 49855',
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
        example: 'jane@somewhere.com'
      },
      position: {
        type: String,
        required: true,
        description: 'Admin\'s role in the organization',
        example: 'Diva'
      },
    },
    {
      collection: 'administration',
    }
  )
);

module.exports = Administration;
