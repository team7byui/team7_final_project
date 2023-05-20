const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Show all events info
  // #swagger.description=Displays all events info
  try {
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('events')
      .find()
      .toArray();
    //Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json(result.error || 'Could not get list of events');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const getSingle = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Show event info based off id
  // #swagger.description=Displays event info based off id
  try {
    if (ObjectId.isValid(request.params.id)) {
      const userId = new ObjectId(request.params.id);
      const result = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('events')
        .find({ _id: userId })
        .toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get events information.');
      }
    } else {
      response.status(400).json('Must use a valid id to see the event information.');
    }
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
    // Error handling
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
  // #swagger.tags=['Events']
  // #swagger.summary=Update an event
  // #swagger.description=Fill in new event info to update event
  try {
    if (ObjectId.isValid(req.params.id)) {
      const eventName = new ObjectId(req.params.id);
      const events = {
        title: req.body.title,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        details: req.body.details,
        volunteersNeeded: req.body.volunteersNeeded
      };
      const eventsCollection = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('events')
        .replaceOne({ _id: eventName }, events);
      console.log(eventsCollection.modifiedCount + 'document(s) were updated');
      // Error handling
      if (eventsCollection.modifiedCount > 0) {
        res.status(204).send(eventsCollection.modifiedCount + 'document(s) were updated');
      } else {
        res.status(500).json(eventsCollection.error || 'New information could not be updated');
      }
    } else {
      res.status(400).json('Must use a valid event id to update event info.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteEvent = async (req, res) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Delete an event
  // #swagger.description=Delete event info using event id
  try {
    if (ObjectId.isValid(req.params.id)) {
      const eventName = new ObjectId(req.params.id);
      //Connect to books database in mongodb
      const eventsCollection = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('events')
        .deleteOne({ _id: eventName}, true);
      console.log(eventsCollection.deletedCount + 'document(s) were deleted.');
      //Error handling
      if(eventsCollection.acknowledged) {
        res.status(200).send(eventsCollection.deletedCount + 'documents(s) were deleted.');
      } else {
        res.status(500).json(eventsCollection.error || 'Sorry. Event information was not deleted.');
      }
    } else {
      res.status(400).json('Must provide a valid id to delete event.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAll, getSingle, createEvent, updateEvent, deleteEvent };
