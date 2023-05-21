const { MongoServerError } = require('mongodb');
const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

const getSingle = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Show users info based off id
  // #swagger.description=Show users email and hashed password based off id
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('users')
      .find({ _id: userId })
      .toArray();
      // Error handling
    if (result.length === 1) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    } else {
      res.status(400).json(result.error || 'Could not display user information.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUsers = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Create a new user
  // #swagger.description=Create a users email and hashed password
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('users')
      .insertOne({ username, password: hashedPassword });
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(400).json('Username already exists.');
    } else {
      res.status(500).json(err);
    }
  }
};

const updateUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Update a users info based off id
  // #swagger.description=Update a users email and hashed password based off id
  try {
    const userId = new ObjectId(req.params.id);
    const username = req.body.username;
    const password = req.body.password;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('users')
      .replaceOne({ _id: userId }, { username, password: hashedPassword });
    console.log(result);
    res.status(204).send(result);
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(400).json('Username already exists.');
    } else {
      res.status(500).json(err);
    }
  }
};

const deleteUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Delete a user
  // #swagger.description=Delete a users email and hashed password
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('users')
      .deleteOne({ _id: userId }, true);
    console.log(result);
    if (result.acknowledged) {
      res.status(200).send(`${result.deletedCount} document(s) were deleted`);
    } else {
      res.status(500).json(result.error || 'Error occurred while deleting the user.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const checkUserExists = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Verify that username exists in db
  // #swagger.description=Returns true if username exists.
  try {
    const username = req.params.username;
    const result = await mongodb
      .getDb()
      .db('ClubOrganization')
      .collection('users')
      .find({ username })
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result.length === 1);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { checkUserExists, getSingle, createUsers, updateUser, deleteUser };
