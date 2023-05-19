const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const findAll = async (request, response, next) => {
  try {
    const result = await mongodb
      .getDb()
      .db("ClubOrganization")
      .collection("administration")
      .find();
    result.toArray().then((lists) => {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(lists);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const findByPosition = async (request, response) => {
  try {
    const position = request.params.position;
    const result = await mongodb
      .getDb()
      .db("ClubOrganization")
      .collection("administration")
      .find({ position });
    result.toArray().then((lists) => {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(lists[0]);
    });
  } catch (err) {
    response.status(500).json(err);
  }
};

const createAdministration = async (request, response) => {
  try {
    const Administration = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      address: request.body.address,
      email: request.body.email,
      phoneNumber: request.body.phoneNumber,
      position: request.body.position,
    };
    const res = await mongodb
      .getDb()
      .db("ClubOrganization")
      .collection("administration")
      .insertOne(Administration);
    if (res.acknowledged) {
      response.status(201).json(res);
    } else {
      response
        .status(500)
        .json(
          res.error || "Error occurred while creating your administration."
        );
    }
  } catch (err) {
    response.status(500).json(err);
  }
};

const updateAdministration = async (req, res) => {
  const position = req.params.position;
  const Administration = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    address: request.body.address,
    email: request.body.email,
    phoneNumber: request.body.phoneNumber,
    position: request.body.position,
  };
  const response = await mongodb
    .getDb()
    .db("ClubOrganization")
    .collection("administration")
    .replaceOne({ position : position }, Administration);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Some error occurred while updating the admin.");
  }
};

// Delete Working
const deleteAdministration = async (req, res) => {
  const position = req.params.position;
  const response = await mongodb
    .getDb()
    .db("ClubOrganization")
    .collection("administration")
    .deleteOne({ position: position }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "Error occurred while deleting the admin.");
  }
};

module.exports = {
  findAll,
  findByPosition,
  createAdministration,
  updateAdministration,
  deleteAdministration,
};
