const { MongoServerError } = require('mongodb');
const bcrypt = require('bcrypt');
const {User} = require('../models');

const getSingle = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Show users info based off id
  // #swagger.description=Show users email and hashed password based off id
  try {
    const result = await User.findById(req.params.id);
    // Error handling
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(400).json('Could not display user information.');
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const createUsers = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.summary=Create a new user
  // #swagger.description=Create a users email and hashed password
  try {
    const username = req.body.username;
    const password = req.body.password;
    const googleId = req.body.googleId;
    if (username && password) {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.create({ username, password: hashedPassword });
      res.status(201).json(result);
    } else if (googleId) {
      const result = await User.create(req.body);
      res.status(201).json(result);
    } else {
      res.status(400).send('Need either username/password or googleId to create user.');
    }
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
    const username = req.body.username;
    const password = req.body.password;
    const googleId = req.body.googleId;
    if (username && password) {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(
        req.params.id, { username, password: hashedPassword }
      );
      res.status(204);
    } else if (googleId) {
      await User.findByIdAndUpdate(req.param.id, req.body);
      res.status(204);
    } else {
      res.status(400).send('Need either username/password or googleId to create user.');
    }
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
    const result = await User.findByIdAndDelete(req.params.id);
    console.log(result);
    if (result.acknowledged) {
      res.status(200).send(`${result.deletedCount} document(s) were deleted`);
    } else {
      res.status(500).json('Error occurred while deleting the user.');
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
    const result = await User.findOne({username});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(!!result);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { checkUserExists, getSingle, createUsers, updateUser, deleteUser };
