const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const getByUsername = async (request, response) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Show users info based off username
  // #swagger.description=Show users email and hashed password based off username
  try {
    if (ObjectId.isValid(request.params.username)) {
      const newUsername = new ObjectId(request.params.username);
      const result = await mongodb.getDb().db('ClubOrganization').collection('users').find({ username: newUsername }).toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not get info.');
      }
    } else {
      response.status(400).json('Must use a valid username to see info.');
    }
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
          .insertOne({ username: username, password: hashedPassword });
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
  try {
    if (ObjectId.isValid(req.params.id)) {
      const userId = new ObjectId(req.params.id);
      const newUsername = req.body.username;
      const password = req.body.password;

      // Hash password
      const plainPassword = password;
      bcrypt.hash(plainPassword, 10)
        .then(function (hashedPassword) {
          const res = mongodb
            .getDb()
            .db('ClubOrganization')
            .collection('users')
            .replaceOne({ _id: userId }, { username: newUsername, password: hashedPassword});
          console.log('Document was updated');
          // Error handling
          if (hashedPassword) {
            res.status(204).json('Document was updated');
          } else {
            res.status(500).json(res.error || 'Sorry. New information could not be updated.');
          }
        });
    } else {
      res.status(400).json('Must use a valid id to update information.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Working
const deleteUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Delete a user
  // #swagger.description=Delete a users email and hashed password
  try{
    if (ObjectId.isValid(req.params.id)) {



      // Error handling
      if (result.acknowledged) {
        res.status(200).send(result.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(result.error || 'Sorry. User information was not deleted.');
      }
    } else {
      res.status(400).json('Must provide a valid id to delete user.');
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = { getByUsername, createUsers, updateUser, deleteUser };
