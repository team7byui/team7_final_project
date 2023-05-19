const mongoose = require('mongoose');

const Event = mongoose.model(
  'Event',
  new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    location: String,
    details: String,
    volunteersNeeded: String
  })
);

module.exports = Event;
