const express = require('express');
const os = require('os');
const request = require('request');
require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

app.use('/', require('./routes'));

const server = app
  .use(express.static(__dirname + '/public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
