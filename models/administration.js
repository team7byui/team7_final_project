const mongoose = require('mongoose');

const Administration = mongoose.model(
  'Administration',
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    phoneNumber: String,
    email: String,
    position: String
  }, {
    collation: 'administration'
  })
);

module.exports = Administration;
