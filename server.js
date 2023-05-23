const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const port = process.env.PORT || 5012;

const mongodb = require('./db/connect');
const passport = require('passport');

require('./config/passport');

const app = express();
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', require('./routes/index.js'));

mongodb.connectMongooseDB();

mongodb.initDb((err) => {
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
