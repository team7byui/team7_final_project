const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Show all volunteer info
  // #swagger.description=See all volunteer info
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('volunteers').find().toArray();
    // Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json(result.error || 'Could not get list of volunteers.');
    };
  } catch (err) {
    response.status(500).json(err);
  }
};

const getOneEvent = async (req, res) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Shows volunteer info based off event
  // #swagger.description=See volunteer info for each event based off event title
  try {
    if (ObjectId.isValid(req.params.event)) {
      // Create new object based off event
      const newEvent = new ObjectId(req.params.event);

      // Connect to database
      const dataBack = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('volunteers')
        .find({ event: newEvent })
        .toArray();
      // Error handling
      if (dataBack.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(dataBack[0]);
      } else {
        res.status(400).json(dataBack.error || 'Could not get volunteer information');
      }
    } else {
      res.status(400).json('Must use a valid event to see the volunteer information');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const createVolunteer = async (request, response) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Create new volunteer info
  // #swagger.description=Create new volunteer info
  try {
    const volunteers = {
      event: request.body.event,
      opportunity: request.body.opportunity,
      name: request.body.name
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('volunteers').insertOne(volunteers);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your volunteer.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateVolunteer = async (req, res) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Update volunteer info
  // #swagger.description=Update volunteer info
  try {
    if (ObjectId.isValid(req.params.id)) {


      // Error Handling
      if (result.modifiedCount > 0) {
        res.status(204).send(result.modifiedCount + 'document(s) were updated');
      } else {
        res.status(500).json(result.error || 'Sorry. New information could not be updated.');
      }
    } else {
      res.status(400).json('Must use a valid id to update volunteer info.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Working
const deleteVolunteer = async (req, res) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Delete volunteer info
  // #swagger.description=Delete volunteer info
  try {
    if (ObjectId.isValid(req.params.id)) {



      // Error handling
      if (result.acknowledged) {
        res.status(200).send(result.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(result.error || 'Sorry. Volunteer info was not deleted.');
      }
    } else {
      res.status(400).json('Must provide a valid id to delete volunteer.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAll, getOneEvent, createVolunteer, updateVolunteer, deleteVolunteer };
