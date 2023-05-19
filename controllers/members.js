const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (request, response) => {
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
const createMembers= async (request, response) => {
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
  const memberID = new ObjectId(request.params.id);
  const members = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    address: request.body.address,
    phoneNumber: request.body.phoneNumber,
    email: request.body.email,
    birthday: request.body.birthday,
    allFamilyMembers: request.body.allFamilyMembers
  };
  const membersCollection = getCollection();
      const result = await membersCollection.replaceOne({ memberID:memberID }, members);
      console.log(result);
  };
  

const deleteMember = async (req, res) => {
  const memberID = new ObjectId(request.params.id);
  const response = await mongodb.getDb().db('ClubOrganization').collection('members').deleteOne({ _id: memberID }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error occurred while deleting the member.');
  }
};

module.exports = { getAll, getSingle, createMembers, updateMember, deleteMember };