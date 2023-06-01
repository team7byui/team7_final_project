const mongoose = require('mongoose');

const Event = mongoose.model(
  'Event',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      description: 'Event title',
      example: 'Trunk or Treat',
    },
    startDate: {
      type: String,
      required: true,
      description: 'The start date and time in ISO 8601 format',
      example: '2023-05-17T17:00:00.000Z',
    },
    endDate: {
      type: String,
      description: 'The end date and time in ISO 8601 format',
      example: '2023-05-17T18:30:00.000Z',
    },
    duration: {
      type: String,
      description: 'The duration of the event in ISO 8601 format',
      example: 'PT1H30M',
    },
    location: {
      type: String,
      required: true,
      description: 'The physical location of the event',
      example: '1325 E Malibu Drive, Tempe, AZ 85282',
    },
    details: {
      type: String,
      required: true,
      description: 'A description of the event',
      example: 'Come dressed up. Make sure to pick treat and not trick.',
    },
    volunteersNeeded: {
      type: String,
      description: 'A comma separated list of volunteer activities.',
      example: 'Donate candy, decorate trunks, bouncy house supervisor',
    },
  })
);

module.exports = Event;
