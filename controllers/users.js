const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const getSingle = async (request, response) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Show users info based off id
  // #swagger.description=Show users email and hashed password based off id
  try {
    const userId = new ObjectId(request.params.id);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('users')
      .find({ _id: userId });
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists[0]);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const createUsers = async (request, response) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Create a new user
  // #swagger.description=Create a users email and hashed password
  try {
    const username = request.body.username;
    const password = request.body.password;

    // Hash password
    const plainPassword = password;
    bcrypt.hash(plainPassword, 10)
      .then(function (hashedPassword) {
        const res = mongodb
          .getDb()
          .db('ClubOrganization')
          .collection('users')
          .insertOne({ username, password: hashedPassword });
        // Error handling
        if (hashedPassword) {
          response.status(201).json('User was created.');
        } else {
          response.status(500).json(res.error || 'Error occurred while creating your User.');
        }
      });
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Update a users info based off id
  // #swagger.description=Update a users email and hashed password based off id
  const username = request.params.username;
  const users = {
    username: request.body.username,
    password: request.body.password,
  };
  const response = await mongodb
    .getDb()
    .db('ClubOrganization')
    .collection('users')
    .replaceOne({ username: username }, users);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};
  

const deleteUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Delete a user
  // #swagger.description=Delete a users email and hashed password
  const username = request.params.username;
  const response = await mongodb.getDb().db('ClubOrganization').collection('members').deleteOne({ username: username }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error occurred while deleting the user.');
  }
};

module.exports = { getSingle, createUsers, updateUser, deleteUser };
