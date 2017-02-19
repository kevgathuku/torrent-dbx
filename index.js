const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = require('socket.io')(server, {
  origins: '*:*'
});

// Attach the io instance to the express app object
// to make it accessible from the routes
app.io = io;

io.on('connection', (socket) => {
  console.log('New client connected');
});


app.use(bodyParser.urlencoded({
    extended: true
  }))
  .use(bodyParser.json())
  .use(cors({
    origin: process.env.CLIENT_URL || '*',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
  }))
  .use('/', require('./routes'));

// Render the client routes if any other URL is passed in
// Do this ony in production. The local client server is used otherwise
if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Must use http server as listener rather than express app
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
