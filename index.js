const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New client connected');
});

app.use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use('/', require('./routes'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
