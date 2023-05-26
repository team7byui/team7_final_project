const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  // eslint-disable-next-line max-len
  MongoClient.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@team7.cvagdmh.mongodb.net`)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

/**
 * Get the current MongoDB client connection.
 * @returns {MongoClient} The MongoDB client connection.
 * @throws If initDb not called first.
 */
const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized.');
  }
  return _db;
};

const connectMongooseDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@team7.cvagdmh.mongodb.net/ClubOrganization`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { initDb, getDb, connectMongooseDB };
