const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const Member = require('../models/member.js');
const queryFromRequest = require('../util/queryFromRequest');

const getAll = async (request, response) => {
  /*
    #swagger.tags=['Members']
    #swagger.summary=Show all members info
    #swagger.description=Shows all members info
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/MemberArray' }
    }
  */
  try {
    const result = await queryFromRequest(Member, request);
    // Error handling
    if (result.length > 0) {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(result);
    } else {
      response.status(400).json('Could not get list of members.');
    }
  } catch (err) {
    response.status(500).json(err.message);
  }
};

const getSingle = async (request, response) => {
  /*
    #swagger.tags=['Members']
    #swagger.summary=Get member info based off id
    #swagger.description=Show a members info based off id
    #swagger.responses[200] = {
      schema: { $ref: '#/definitions/Member }
    }
  */
  try {
    if (ObjectId.isValid(request.params.id)) {
      const memberID = new ObjectId(request.params.id);
      const result = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('members')
        .find({ _id: memberID })
        .toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get members information');
      }
    } else {
      response.status(400).json('Must use a valid members id to see the members information.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};
const createMembers = async (request, response) => {
  /*
    #swagger.tags=['Members']
    #swagger.summary=Create a new member
    #swagger.description=Fill in new members info to create a new member
    #swagger.responses[201] = {
      schema: { $ref: '#/definitions/InsertedId' }
    }
  */
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
    const res = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('members')
      .insertOne(members);
    // Error handling
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
      const memberID = new ObjectId(req.params.id);
      const members = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        birthday: req.body.birthday,
        allFamilyMembers: req.body.allFamilyMembers
      };
      const membersCollection = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('members')
        .replaceOne({ _id:memberID }, members);
      console.log(membersCollection.modifiedCount + 'document(s) were updated');
      // Error handling
      if (membersCollection.modifiedCount > 0) {
        res.status(204).send(membersCollection.modifiedCount + 'document(s) were updated');
      } else {
        res.status(500).json(membersCollection.error || 'New information could not be updated.');
      }
    } else {
      res.status(400).json('Must use a valid member id to update member information');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteMember = async (req, res) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Delete member info based off id
  // #swagger.description=Delete member info based off id
  try {
    if (ObjectId.isValid(req.params.id)) {
      const memberID = new ObjectId(req.params.id);
      const response = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('members')
        .deleteOne({ _id: memberID }, true);
      console.log(response.deletedCount + 'document(s) were deleted');
      // Error handling
      if (response.deletedCount > 0) {
        res.status(200).send(response.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(response.error || 'Error occurred while deleting the member.');
      }
    } else {
      res.status(400).json('Must use a valid member id to delete member.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAll, getSingle, createMembers, updateMember, deleteMember };
