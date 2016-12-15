const express = require('express');
const os = require('os');
const request = require('request');
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;
app.port = PORT;

app.use('/', require('./routes'));

const server = app
  .use(express.static(__dirname + '/public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
