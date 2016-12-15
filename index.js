const express = require('express');
const os = require('os');
const request = require('request');
const SocketIO = require('socket.io');
require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

app.use('/', require('./routes'));

const server = app
  .use(express.static(__dirname + '/public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = SocketIO(server);
// Attach the SocketIO server to the app object
app.io = io;

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});
