const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Show all members info
  // #swagger.description=Shows all members info
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('members').find();
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const getSingle = async (request, response) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Get member info based off id
  // #swagger.description=Show a members info based off id
  try {
    const memberID = new ObjectId(request.params.id);
    const result = await mongodb.getDb().db('ClubOrganization').collection('members').find({ _id: memberID });
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists[0]);
    });
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
};

// Delete Working
const deleteMember = async (req, res) => {
  // #swagger.tags=['Members']
  // #swagger.summary=Delete member info based off id
  // #swagger.description=Delete member info based off id
};

module.exports = { getAll, getSingle, createMembers, updateMember, deleteMember };
