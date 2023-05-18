const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('events').find();
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const getByName = async (request, response) => {
  try {
    const eventName = new ObjectId(request.params.title);
    const result = await mongodb.getDb().db('ClubOrganization').collection('events').find({ _id: eventName });
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists[0]);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};


const createEvent= async (request, response) => {
  try {
    const events = {
      title: request.body.title,
      date: request.body.date,
      time: request.body.time,
      location: request.body.location,
      details: request.body.details,
      volunteersNeeded: request.body.volunteersNeeded
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('events').insertOne(events);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your event.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};


const updateEvent = async (req, res) => {
    
  };
  

//Delete Working
const deleteEvent = async (req, res) => {
  
};

module.exports = { getAll, getByName, createEvent, updateEvent, deleteEvent };