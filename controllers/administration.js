const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;


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

const getSingle = async (request, response) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Show an admins info based off id
  // #swagger.description=Finds an admin members info based off id
  try {

    const userId = new ObjectId(request.params.id);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('administration')
      .find({ _id: userId });

    result.toArray().then((lists) => {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(lists[0]);
    });
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
      response
        .status(500)
        .json(
          res.error || 'Error occurred while creating your administration.'
        );
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateAdministration = async (req, res) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Update an admins info based off id
  // #swagger.description=Changes an admin members info based off their position
  const administrationId = new ObjectId(req.params.id);
  const administration = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    position: req.body.birthday
  };
  const response = await mongodb
    .getDb()
    .db('ClubOrganization')
    .collection('administration')
    .replaceOne({ _id: administrationId }, administration);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while updating the admin.');
  }
};

// Delete Working
const deleteAdministration = async (req, res) => {
  // #swagger.tags=['Administration']
  // #swagger.summary=Delete an admins info based off id
  // #swagger.description=Deletes an admin members info based off their position
  const administrationId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db('ClubOrganization')
    .collection('administration')
    .deleteOne({ _id: administrationId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'Error occurred while deleting the admin.');

  }
};

module.exports = {
  findAllAdmin,
  getSingle,
  createAdministration,
  updateAdministration,
  deleteAdministration
};
