const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Volunteer = require('../models/volunteer.js');
const queryFromRequest = require('../util/queryFromRequest');

const getAll = async (request, response) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Show all volunteer info
  // #swagger.description=See all volunteer info
  // #swagger.
  try {
    const result = await queryFromRequest(Volunteer, request);
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json('Could not get list of volunteers.');
    }
  } catch (err) {
    response.status(500).json(err.message);
  }
};

const getSingle = async (request, response) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Shows volunteer info based off id
  // #swagger.description=See volunteer info for each event based off id
  try {
    if (ObjectId.isValid(request.params.id)) {
      const userId = new ObjectId(request.params.id);
      const result = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('volunteers')
        .find({ _id: userId })
        .toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get volunteers information.');
      }
    } else {
      response.status(400).json('Must provide a valid volunteer id to access volunteer list.');
    }
  } catch (err) {
    response.status(500).json(err);
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
    const res = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('volunteers')
      .insertOne(volunteers);
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
  // #swagger.summary=Update volunteer info based off id
  // #swagger.description=Update volunteer info based off id
  try {
    if (ObjectId.isValid(req.params.id)) {
      const name = new ObjectId(req.params.id);
      const volunteers = {
        event: req.body.event,
        opportunity: req.body.opportunity,
        name: req.body.name,
      };
      const response = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('volunteers')
        .replaceOne({ _id: name }, volunteers);
      console.log(response.modifiedCount + 'document(s) were updated');
      if (response.modifiedCount > 0) {
        res.status(204).send(response.modifiedCount + 'document(s) were updated');
      } else {
        res.status(500).json(response.error || 'Some error occurred while updating the volunteer.');
      }
    } else {
      res.status(400).json('Must provide a valid volunteer id to update volunteer info.');
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
      const volunteer = new ObjectId(req.params.id);
      //Connect to books database in mongodb
      const response = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('volunteers')
        .deleteOne({ _id: volunteer}, true);
      console.log(response.deletedCount + 'document(s) were deleted.');
      //Error handling (successful post or error)
      if(response.acknowledged) {
        res.status(200).send(response.deletedCount + 'documents(s) were deleted.');
      } else {
        res.status(500).json(response.error || 'Sorry. Book information was not deleted.');
      }
    } else {
      res.status(400).json('Must provide a valid id to delete book.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
};
