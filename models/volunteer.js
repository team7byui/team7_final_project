const mongoose = require('mongoose');

const Volunteer = mongoose.model(
  'Volunteer',
  new mongoose.Schema({
    event: String,
    opportunity: String,
    name: String
  })
);

module.exports = Volunteer;
