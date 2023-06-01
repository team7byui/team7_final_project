/* eslint-disable max-len */
const swaggerAutogen = require('swagger-autogen')();
const m2s = require('mongoose-to-swagger');
const models = require('./models');

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

const doc = {
  swagger: '2.0',
  info: {
    version: '0.1',
    title: 'club organization',
    description: `
This api describes entities that might be useful to a club organization, like Members, Events, and Volunteers. We've also included Adminstration contacts (President, Secretary, etc) and a User table to manage authentication. The data is stored in a MongoDB database.

### 401 Unauthorized
To use routes that modify data, you need to be authenticated. [Click here to log in with your Google account](/auth/google).

### Credits
This API was written by Team 7 (Shauntal, Tianna, Kelsey, Sam, John) as a final project for CSE 341. [Source code is available on GitHub](https://github.com/team7byui/team7_final_project).

**This api not intended for regular use.**
    `
  },
  host: 'team7project.onrender.com',
  schemes: ['https'],
  '@definitions': Object.keys(models).reduce((def, key) => {
    def[key] = m2s(models[key], { props: ['example'], omitFields: ['_id','createdAt'] });
    def[`${key}Array`] = {
      type: 'array',
      items: { $ref: `#/definitions/${key}` }
    };
    return def;
  }, {
    'InsertedResponse': {
      type: 'object',
      properties: {
        'acknowledged': {
          type: 'boolean',
          description: 'Server acknowledged the update'
        },
        'insertedId': {
          type: 'string',
          description: 'Id of the newly inserted record'
        }
      }
    }
  })
};

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });
