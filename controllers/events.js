const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Show all events info
  // #swagger.description=Displays all events info
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('events').find();
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const getSingle = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Show event info based off title
  // #swagger.description=Displays event info based off title
  try {
    const userId = new ObjectId(request.params.id);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('events')
      .find({ _id: userId });
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists[0]);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const createEvent = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Create an event
  // #swagger.description=Fill in event info to create event
  try {
    const events = {
      title: request.body.title,
      date: request.body.date,
      time: request.body.time,
      location: request.body.location,
      details: request.body.details,
      volunteersNeeded: request.body.volunteersNeeded
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('events').insertOne(events);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your event.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateEvent = async (req, res) => {
  const eventName = req.params.eventName;
  const events = {
    title: request.body.title,
    date: request.body.date,
    time: request.body.time,
    location: request.body.location,
    details: request.body.details,
    volunteersNeeded: request.body.volunteersNeeded
  };
  const eventsCollection = getCollection();
      const result = await eventsCollection.replaceOne({ eventName:eventName }, events);
      console.log(result);
      
}

const deleteEvent = async (req, res) => {
  const eventName = req.params.eventName;
  const eventsCollection = getCollection();
      const result = await eventsCollection.deleteOne({ eventName: eventName });
      console.log(`${eventName} was successfully deleted`);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
};

module.exports = { getAll, getSingle, createEvent, updateEvent, deleteEvent };
