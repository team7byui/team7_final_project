const { isEmail } = require('is-email-validation');
const isUrl = require('is-url');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    description: 'The user name'
  },
  password: {
    type: String,
    select: false,
    description: 'Password hash (not included in default view)'
  },
  googleId: {
    type: String,
    immutable: true,
    select: false,
    sparse: true,
    description: 'Google identifier (not included in default view)'
  },
  email: {
    type: String,
    lowercase: true,
    validate: {
      validator: isEmail,
      message: (props) =>
        `'${props.value}': Not a recognized email format.`,
    },
    description: 'An email address',
  },
  displayName: {
    type: String,
    select: false,
    description: 'The user name for display purposes.'
  },
  firstName: {
    type: String,
    select: false,
    description: 'A given name'
  },
  lastName: {
    type: String,
    select: false,
    description: 'A family name'
  },
  image: {
    type: String,
    select: false,
    validator: {
      validate: isUrl,
      message: (props) =>
        `'${props.value}': Not a recognized URL format.`,
    },
    description: 'URL to photo resource',
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
