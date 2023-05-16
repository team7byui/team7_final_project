const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5012;

const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', require('./routes/index.js'));

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Server is running on Port ${port} and connected to DB`);
    if (app.get('env') === 'development') {
      console.log(`Ctrl+Click here => http://localhost:${port}/`);
    }
  }
});
