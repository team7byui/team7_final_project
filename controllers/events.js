const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Show all events info
  // #swagger.description=Displays all events info
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('events').find().toArray();
    // Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json(result.error || 'Could not get list of events');
    };
  } catch (err) {
    response.status(500).json(err);
  }
};

const getByName = async (request, response) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Show event info based off title
  // #swagger.description=Displays event info based off title
  try {
    if (ObjectId.isValid(request.params.title)) {
      const eventName = new ObjectId(request.params.title);
      const result = await mongodb.getDb().db('ClubOrganization').collection('events').find({ title: eventName }).toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get event info.');
      };
    } else {
      response.status(400).json('Must use a valid Id to see the event info.');
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
  // #swagger.summary=Update event info based off id
  // #swagger.description=Update event info based off id
  try {
    if (ObjectId.isValid(req.params.id)) {

      // Error handling
      if(result.modifiedCount > 0) {
        res.status(204).send(result.modifiedCount + 'document(s) were updated');
      } else {
        res.status(500).json(result.error || 'Sorry. New information could not be update.');
      }
    } else {
      res.status(400).json('Must use a valid Id to update event info.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Working
const deleteEvent = async (req, res) => {
  // #swagger.tags=['Events']
  // #swagger.summary=Delete event info based off id
  // #swagger.description=Delete event info based off id
  try {
    if (ObjectId.isValid(req.params.id)) {

      // Error Handling
      if (result.acknowledged) {
        res.status(200).send(result.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(result.error || 'Sorry. Event information was not deleted.');
      }
    } else {
      res.status(400).json('Must provide a valid id to delete event.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAll, getByName, createEvent, updateEvent, deleteEvent };
