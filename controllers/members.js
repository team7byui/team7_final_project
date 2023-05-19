const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Show all members info
  // #swagger.description=Shows all members info
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('members').find().toArray();
    // Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json(result.error || 'Could not get list of members.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const getSingle = async (request, response) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Get member info based off id
  // #swagger.description=Show a members info based off id
  try {
    if (ObjectId.isValid(request.params.id)) {
      const memberID = new ObjectId(request.params.id);
      const result = await mongodb.getDb().db('ClubOrganization').collection('members').find({ _id: memberID }).toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get members info.');
      };
    } else {
      response.status(400).json('Must use a valid id to see a members info.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const createMembers = async (request, response) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Create a new member
  // #swagger.description=Fill in new members info to create a new member
  try {
    const members = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      address: request.body.address,
      phoneNumber: request.body.phoneNumber,
      email: request.body.email,
      birthday: request.body.birthday,
      allFamilyMembers: request.body.allFamilyMembers
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('members').insertOne(members);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your member.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateMember = async (req, res) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Update member info based off id
  // #swagger.description=Update member info based off id
  try {
    if (ObjectId.isValid(req.params.id)) {



      // Error handling
      if (result.modifiedCount > 0) {
        res.status(204).send(result.modifiedCount + 'document(s) were updated');
      } else {
        res.status(500).json(result.error || 'Sorry. New information could not be update.');
      }
    } else {
      res.status(400).json('Must use a valid Id to update member info.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Member
const deleteMember = async (req, res) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Delete member info based off id
  // #swagger.description=Delete member info based off id
  try {
    if (ObjectId.isValid(req.params.id)) {



      // Error Handling
      if (result.acknowledged) {
        res.status(200).send(result.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(result.error || 'Sorry. Member information was not deleted.');
      }
    } else {
      res.status(400).json('Must provide a valid id to delete member.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAll, getSingle, createMembers, updateMember, deleteMember };
