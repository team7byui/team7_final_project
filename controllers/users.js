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
    
  };
  

//Delete Working
const deleteUser = async (req, res) => {
  
};

module.exports = { getByUsername, createUsers, updateUser, deleteUser };