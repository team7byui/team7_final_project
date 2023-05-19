const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Show all volunteer info
  // #swagger.description=See all volunteer info
  try {
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('volunteers')
      .find();
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const getSingle = async (request, response) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Shows volunteer info based off id
  // #swagger.description=See volunteer info for each event based off id
  try {
    const userId = new ObjectId(request.params.id);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('volunteers')
      .find({ _id: userId });
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists[0]);
    });
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
      response
        .status(500)
        .json(res.error || 'Error occurred while creating your volunteer.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateVolunteer = async (req, res) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Update volunteer info
  // #swagger.description=Update volunteer info
  const name = request.params.name;
  const volunteers = {
    event: request.body.event,
    opportunity: request.body.opportunity,
    name: request.body.name,
  };
  const response = await mongodb
    .getDb()
    .db('ClubOrganization')
    .collection('users')
    .replaceOne({ name: name }, volunteers);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the volunteer.');
  }
};


// Delete Working
const deleteVolunteer = async (req, res) => {
  // #swagger.tags=['Volunteers']
  // #swagger.summary=Delete volunteer info
  // #swagger.description=Delete volunteer info
  const name = request.params.name;
  const response = await mongodb.getDb().db('ClubOrganization').collection('members').deleteOne({ name: name }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error occurred while deleting the user.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer
};
