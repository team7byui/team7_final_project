const mongoose = require('mongoose');

const Volunteer = mongoose.model(
  'Volunteer',
  new mongoose.Schema({
    event: {
      type: String,
      required: true,
      description: 'Title of related event',
      example: 'Trunk or Treat',
    },
    opportunity: {
      type: String,
      required: true,
      description: 'A volunteer task',
      example: 'Hand out snacks',
    },
    name: {
      type: String,
      required: true,
      description: 'The full name of the volunteer',
      example: 'Samantha Smith',
    },
  })
);

module.exports = Volunteer;
