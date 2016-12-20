const path = require('path');
const Dropbox = require('dropbox');
const express = require('express');
const magnet = require('magnet-uri');
const WebTorrent = require('webtorrent');
const firebase = require('firebase');

const client = new WebTorrent();
const router = express.Router();

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN
});
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DB_URL
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// this provides download link for downloaded files
router.get('/download', function(req, res) {
  const file = path.join(__dirname, 'tmp', req.query.file);
  const fileName = path.basename(file);
  console.log(`Dowloading ${fileName} ...`);
  res.download(file, fileName);
});

// to add torrent enter 'http://your_url.com/torAdd?magnet=magnet_link
router.post('/torAdd', function(req, res) {
  const parsedInfo = magnet.decode(req.body.magnet);
  console.log(`Downloading ${parsedInfo.name}`);
  client.add(req.body.magnet, {
    path: path.join(__dirname, 'tmp')
  }, (torrent) => {
    torrent.on('done', () => {
      console.log('torrent download finished');
      torrent.files.forEach(function(file, index) {
        console.log(`${file.length} ${file.path} \n`);
        // Must be a publicly accessible URL for Dropbox upload to work
        const url = encodeURI(`${req.protocol}://${req.hostname}/download?file=${file.path}`);
        console.log(url);
        dbx.filesSaveUrl({
            path: `/Saves/${file.path}`,
            url: url
          })
          .then((response) => {
            // Async upload started
            if (response['.tag'] === 'async_job_id') {
              // check async upload status
              database.ref(`${torrent.infoHash}/name`).set(parsedInfo.name);
              checkComplete(torrent.infoHash, response['async_job_id']);
              console.log(`Started async upload: ${response['async_job_id']}`);
            } else if (response['.tag'] === 'complete') {
              console.log(`Downloaded ${file.name}`);
            }
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
  });
  res.send(`Downloading ${parsedInfo.name}`);
});

let checkStatus = (jobId) => {
  return dbx.filesSaveUrlCheckJobStatus({
    async_job_id: jobId
  });
};

let checkComplete = (hash, jobId) => {
  console.log(`Checking status of ${jobId}`);
  checkStatus(jobId)
    .then((response) => {
      // 'in_progress' | 'complete' | 'failed'
      database.ref(`${hash}/items/${jobId}`).set(response['.tag']);
      switch (response['.tag']) {
        case 'in_progress':
          // Call the function again after 10 seconds
          setTimeout(
            function() {
              process.nextTick(checkComplete, hash, jobId);
            }, 10 * 1000);
          break;
        case 'failed':
          console.log('Failed:', response['failed'])
          break;
        case 'complete':
          console.log(`${jobId} download complete`)
          break;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = router;
