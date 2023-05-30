const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    select: false
  },
  googleId: {
    type: String,
    immutable: true,
    select: false,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  displayName: String,
  firstName: String,
  lastName: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
