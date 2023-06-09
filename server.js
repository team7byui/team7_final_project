const express = require('express');
const debug = require('debug')('team7_final_project:server');
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
    process.exit();
  } else {
    app.listen(port);
    app.on('listening', onListening);
    app.on('error', onError);

    console.log(`Server is running on Port ${port} and connected to DB`);
    if (app.get('env') === 'development') {
      console.log(`Ctrl+Click here => http://localhost:${port}/`);
    }
  }
});

/**
 * Event listener for HTTP server "listening" event.
 * @param {{address: () => string|{port:number}}} app The parent application
 */
const onListening = async (app) => {
  const addr = app.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
};

/**
 * Event listener for HTTP server "error" event.
 * @param {{code?: string, syscall?: string}} error The current error.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES': {
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  }

  case 'EADDRINUSE': {
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  }

  default: {
    throw error;
  }
  }
}
