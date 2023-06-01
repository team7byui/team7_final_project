const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Administration = require('../models/administration.js');
const queryFromRequest = require('../util/queryFromRequest.js');

const findAllAdmin = async (request, response) => {
  /*
    #swagger.summary=Show all admins info
    #swagger.description=Finds all admin members info
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/AdministrationArray' }
    }
  */
  try {
    const result = await queryFromRequest(Administration, request);
    // Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json('Could not get a list of admins.');
    }
  } catch (err) {
    response.status(500).json(err.message);
  }
};

const getSingle = async (request, response) => {
  /*
    #swagger.summary=Show an admins info based off id
    #swagger.description=Finds an admin members info based off id
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/Administration' }
    }
  */
  try {
    if (ObjectId.isValid(request.params.id)) {
      const userId = new ObjectId(request.params.id);
      const result = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('administration')
        .find({ _id: userId })
        .toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get admin information.');
      }
    } else {
      response.status(400).json('Must use a valid administration id to see the admin info.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const createAdministration = async (request, response) => {
  /*
    #swagger.summary=Add a new admin position to database
    #swagger.description=Enter new admin positions information to add to database
    #swagger.parameters['body'] = {
      in: 'body',
      schema: { $ref: '#/definitions/Administration' }
    }
    #swagger.responses[201] = {
      schema: { $ref: '#/definitions/InsertedResponse' }
    }
  */
  try {
    const Administration = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      address: request.body.address,
      email: request.body.email,
      phoneNumber: request.body.phoneNumber,
      position: request.body.position,
    };
    const res = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('administration')
      .insertOne(Administration);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your administration.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateAdministration = async (req, res) => {
  /*
    #swagger.summary=Update an admins info based off id
    #swagger.description=Changes an admin members info based off their id
    #swagger.parameters['body'] = {
      in: 'body',
      schema: { $ref: '#/definitions/Administration' }
    }
  */
  try {
    if (ObjectId.isValid(req.params.id)) {
      const administrationId = new ObjectId(req.params.id);
      const administration = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        position: req.body.position
      };
      const response = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('administration')
        .replaceOne({ _id: administrationId }, administration);
      console.log(response.modifiedCount + 'document(s) were updated');
      // Error handling
      if (response.modifiedCount > 0) {
        res.status(204).send(response.modifiedCount + 'document(s) were updated.');
      } else {
        res.status(500).json(response.error || 'Some error occurred while updating the admin.');
      }
    } else {
      res.status(400).json('Must use a valid administration id to update admin information.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Working
const deleteAdministration = async (req, res) => {
  // #swagger.summary=Delete an admins info based off id
  // #swagger.description=Deletes an admin members info based off their id
  try {
    if (ObjectId.isValid(req.params.id)) {
      const administrationId = new ObjectId(req.params.id);
      const response = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('administration')
        .deleteOne({ _id: administrationId }, true);
      console.log(response.deletedCount + 'document(s) were deleted');
      if (response.deletedCount > 0) {
        res.status(200).send(response.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(response.error || 'Error occurred while deleting the admin.');
      }
    } else {
      res.status(400).json('Must use a valid administration id to delete admin info.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  findAllAdmin,
  getSingle,
  createAdministration,
  updateAdministration,
  deleteAdministration
};
