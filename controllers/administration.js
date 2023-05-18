const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const updateAdministration = async (req, res) => {
    const administrationId = new ObjectId(req.params.id);
    const administration = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        position: req.body.position
      };
    const response = await mongodb
      .getDb()
      .db()
      .collection('administration')
      .replaceOne({ _id: administrationId }, administration);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the admin.');
    }
};

//Delete Working
const deleteAdministration = async (req, res) => {
  const administrationId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db('ClubOrganization').collection('administration').deleteOne({ _id: administrationId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Error occurred while deleting the admin.');
  }
};

module.exports = { updateAdministration, deleteAdministration };