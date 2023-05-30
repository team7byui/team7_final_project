const swaggerAutogen = require('swagger-autogen')();
const m2s = require('mongoose-to-swagger');
const models = require('./models');

const definitions = Object.keys(models).reduce((prev, key) => {
  prev[key] = m2s(models[key], {
    omitFields: ['_id','__v','createdAt']
  });
  prev[`${key}Array`] = [{ '$ref': `#/definitions/${key}`}];
  return prev;
}, {});

definitions['InsertedId'] = {
  insertedId: 'objectId'
};

const doc = {
  swagger: '2.0',
  info: {
    title: 'club organization',
    description: 'club organization'
  },
  host: 'team7project.onrender.com',
  schemes: ['https'],
  definitions
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });
