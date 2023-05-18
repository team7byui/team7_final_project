const mongoose = require('mongoose');

const Member = mongoose.model(
  'Member',
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    phoneNumber: String,
    email: String,
    birthday: String,
    allFamilyMembers: String
  })
);

module.exports = Member;
