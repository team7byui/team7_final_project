const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (request, response) => {
  try {
    const result = await mongodb.getDb().db('ClubOrganization').collection('volunteers').find();
    result.toArray().then((lists) => {
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(lists);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const createVolunteer= async (request, response) => {
  try {
    const volunteers = {
      event: request.body.event,
      opportunity: request.body.opportunity,
      name: request.body.name,
    };
    const res = await mongodb.getDb().db('ClubOrganization').collection('volunteers').insertOne(volunteers);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response.status(500).json(res.error || 'Error occurred while creating your volunteer.');
    }
  } catch (err) {
    response.status(500).json(err);
  }
};


const updateVolunteer = async (req, res) => {
    
  };
  

//Delete Working
const deleteVolunteer = async (req, res) => {
  
};

module.exports = { getAll, createVolunteer, updateVolunteer, deleteVolunteer };