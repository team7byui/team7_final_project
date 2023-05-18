const express = require('express');
const debug = require('debug')('team7_final_project:server');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5012;

const mongodb = require('./db/connect');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', require('./routes/index.js'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
    process.exit();
  } else {
    app.on('listening', onListening);
    app.listen(port);
    console.log(`Server is running on Port ${port} and connected to DB`);
    if (app.get('env') === 'development') {
      console.log(`Ctrl+Click here => http://localhost:${port}/`);
    }
  }
});

const onListening = async (app) => {
  const addr = app.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
};
