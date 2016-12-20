const express = require('express');
const bodyParser = require('body-parser');
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 4000;
app.port = PORT;

app.use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use('/', require('./routes'));

const server = app
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
