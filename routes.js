const path = require('path');
const Dropbox = require('dropbox');
const express = require('express');
const WebTorrent = require('webtorrent');
const firebase = require('firebase');
var client = new WebTorrent();
var dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN
});
var router = express.Router();
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(firebaseConfig);

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// this provides download link for downloaded files
router.get('/download', function(req, res) {
  var file = path.join(__dirname, 'public', req.query.file);
  var fileName = path.basename(file);
  console.log(`Dowloading ${fileName} ...`);
  res.download(file, fileName); // Set disposition and send it.
});

// to add torrent enter 'your_heroku_name.herokuapp.com/torAdd?magnet=magnet_link
router.get('/torAdd', function(req, res) {
  console.log('started');
  client.add(req.query.magnet, {
    path: 'public'
  }, (torrent) => {
    torrent.on('done', () => {
      console.log('torrent download finished');
      torrent.files.forEach(function(file, index) {
        console.log(`${file.length} ${file.path} \n`);
        // TODO: Remove URL hardcoding
        var url = encodeURI(`https://warm-reef-79245.herokuapp.com/download?file=${file.path}`);
        dbx.filesSaveUrl({
            path: `/Saves/${file.path}`,
            url: url
          })
          .then((response) => {
            // Async upload started
            if (response['.tag'] === 'async_job_id') {
              // check async upload status
              checkComplete(torrent.infoHash, response['async_job_id']);
              console.log(`Started async upload: ${response['async_job_id']}`);
            } else if (response['.tag'] === 'complete') {
              console.log(response['complete']);
              myFunct(data, jobId, itemId)
            }
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  });
  res.send('downloading');
});

let checkComplete = (hash, fileId) => {
  dbx.filesSaveUrlCheckJobStatus({
      async_job_id: fileId
    })
    .then((response) => {
      // incomplete / complete
      firebase.database().ref(`${hash}/items/${fileId}`).set(response.tag);
      if (response.tag !== 'complete') process.nextTick(checkComplete, jobId, fileId);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = router;
