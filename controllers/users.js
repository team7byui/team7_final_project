const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const getSingle = async (request, response) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Show users info based off id
  // #swagger.description=Show users email and hashed password based off id
  try {
    if (ObjectId.isValid(request.params.id)) {
      const userId = new ObjectId(request.params.id);
      const result = await mongodb
        .getDb()
        .db('ClubOrganization')
        .collection('users')
        .find({ _id: userId })
        .toArray();
      // Error handling
      if (result.length > 0) {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).json(result[0]);
      } else {
        response.status(400).json(result.error || 'Could not display user information.');
      }
    } else {
      response.status(400).json('Must use a valid user id to see the information.');
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
      const username = new ObjectId(req.params.id);
      const newUsername = req.body.username;
      const password = req.body.password;

      // Hash password
      const plainPassword = password;
      bcrypt.hash(plainPassword, 10)
        .then(function (hashedPassword) {
          const response = mongodb
            .getDb()
            .db('ClubOrganization')
            .collection('users')
            .replaceOne({ _id: username }, { username: newUsername, password: hashedPassword });
          console.log(response);
          if (hashedPassword) {
            res.status(204).send('Document was updated');
          } else {
            res.status(500).json(response.error || 'Some error occurred while updating the user.');
          }
        });
    } else {
      res.status(400).json('Must use a valid user id to update user information.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Delete a user
  // #swagger.description=Delete a users email and hashed password
  try {
    if (ObjectId.isValid(req.params.id)) {
      const username = new ObjectId(req.params.id);
      const response = await mongodb
        .getDb().db('ClubOrganization')
        .collection('members')
        .deleteOne({ _id: username }, true);
      console.log(response.deletedCount + 'document(s) were deleted');
      if (response.deletedCount > 0) {
        res.status(200).send(response.deletedCount + 'document(s) were deleted');
      } else {
        res.status(500).json(response.error || 'Error occurred while deleting the user.');
      }
    } else {
      res.status(400).json('Must provide a valid user id to delete user.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getSingle, createUsers, updateUser, deleteUser };
