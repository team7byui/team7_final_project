const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getByUsername = async (request, response) => {
  try {
    const username = new ObjectId(request.params.username);
    const result = await mongodb.getDb().db('ClubOrganization').collection('users').find({ _id: username });
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists[0]);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const createUsers= async (request, response) => {
  try {
    const users = {
      username: request.body.username,
      password: request.body.password,
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('users').insertOne(users);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your Users.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  const username = new ObjectId(request.params.username);
  const users = {
    username: request.body.username,
    password: request.body.password,
  };
  const response = await mongodb
    .getDb()
    .db('ClubOrganization')
    .collection('users')
    .replaceOne({ _id: username }, users);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
  };
  

const deleteUser = async (req, res) => {
  const username = new ObjectId(request.params.username);
  const response = await mongodb.getDb().db('ClubOrganization').collection('members').deleteOne({ _id: username }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error occurred while deleting the user.');
  }
};

module.exports = { getByUsername, createUsers, updateUser, deleteUser };