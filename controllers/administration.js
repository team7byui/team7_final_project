const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const findAllAdmin = async (request, response) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Show all admins info
  // #swagger.description=Finds an admin members info based off their position
  try {
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('administration')
      .find()
      .toArray();
    // Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json(result.error || 'Could not get all admin info.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const findByPosition = async (request, response) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Show an admins info based off position
  // #swagger.description=Finds an admin members info based off their position
  try {
    if (ObjectId.isValid(request.params.position)) {
      const newPosition = new ObjectId(request.params.position);
      const result = await mongodb.getDb().db('ClubOrganization').collection('administration').find({ position: newPosition }).toArray();
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get admin info.');
      };
    } else {
      response.status(400).json('Must use a valid position to find information.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const createAdministration = async (request, response) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Add a new admin position to database
  // #swagger.description=Enter new admin positions information to add to database
  try {
    const Administration = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      address: request.body.address,
      phoneNumber: request.body.phoneNumber,
      email: request.body.email,
      position: request.body.position
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('administration').insertOne(Administration);
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
  // #swagger.tags=['Administration']
  // #swagger.summary=Update an admins info based off id
  // #swagger.description=Changes an admin members info based off their position
  try {
    if (ObjectId.isValid(req.params.id)) {
      const administrationId = new ObjectId(req.params.id);
      const administration = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        position: req.body.position
      };
      const response = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('administration')
        .replaceOne({ _id: administrationId }, administration);
      console.log(response);
      if (response.modifiedCount > 0) {
        res.status(204).send(response.modifiedCount + 'document(s) were update');
      } else {
        res.status(500).json(response.error || 'Some error occurred while updating the admin.');
      }
    } else {
      res.status(400).json('Must use a valid Id to update admin information.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Working
const deleteAdministration = async (req, res) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Delete an admins info based off id
  // #swagger.description=Deletes an admin members info based off their position
  try {
    if (ObjectId.isValid(req.params.id)) {
      const administrationId = new ObjectId(req.params.id);
      const response = await mongodb.getDb().db('ClubOrganization').collection('administration').deleteOne({ _id: administrationId }, true);
      console.log(response);
      if (response.deletedCount > 0) {
        res.status(200).send(response.deletedCount + 'admin(s) were deleted');
      } else {
        res.status(500).json(response.error || 'Error occurred while deleting the admin.');
      }
    } else {
      res.status(400).json('Must use a valid Id to delete an admin.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { findAllAdmin, findByPosition, createAdministration, updateAdministration, deleteAdministration };
