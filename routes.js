const path = require('path');
const Dropbox = require('dropbox');
const express = require('express');
const magnet = require('magnet-uri');
const WebTorrent = require('webtorrent');

const router = express.Router();
const client = new WebTorrent();
const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN
});

const checkComplete = (statusObject, socket) => {
  console.log(`Checking status of ${statusObject.async_job_id}`);
  dbx.filesSaveUrlCheckJobStatus({
      async_job_id: statusObject.async_job_id
    })
    .then((response) => {
      // Status: 'in_progress' | 'complete' | 'failed'
      let fileStatus = {
        hash: statusObject.hash,
        name: statusObject.name,
        async_job_id: statusObject.async_job_id,
        status: response['.tag']
      };
      switch (response['.tag']) {
        case 'in_progress':
          socket.emit('file_status', Object.assign(fileStatus, {
            message: `${statusObject.name} upload in progress`
          }));
          // Call the function again after 10 seconds
          setTimeout(
            function() {
              process.nextTick(checkComplete, statusObject, socket);
            }, 10 * 1000);
          break;
        case 'failed':
          socket.emit('file_status', Object.assign(fileStatus, {
            message: `${statusObject.name} upload failed`
          }));
          console.log('Failed:', response['failed'])
          break;
        case 'complete':
          socket.emit('file_status', Object.assign(fileStatus, {
            message: `${statusObject.name} upload complete`
          }));
          console.log(`${statusObject.async_job_id} upload complete`)
          break;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const dropboxUpload = (files) => {
  files.forEach(function(file, index) {
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
          let statusObject = {
            hash: torrent.infoHash,
            name: file.name,
            async_job_id: response['async_job_id']
          };
          // Send status to the client
          socket.emit('file_status',
            Object.assign(statusObject, {
              status: 'started',
              message: `Started uploading ${file.name} to Dropbox`
            }));
          checkComplete(statusObject, socket);
          console.log(`Started async upload: ${response['async_job_id']}`);
        } else if (response['.tag'] === 'complete') {
          console.log(`Downloaded ${file.name}`);
          // Send status to the client
          socket.emit('file_status', {
            hash: torrent.infoHash,
            name: file.name,
            status: 'complete',
            message: `Downloaded ${file.name} to Dropbox`
          });
        }
        console.log(response);
      })
      .catch((error) => {
        // Send status to the client
        socket.emit('file_status', {
          hash: torrent.infoHash,
          name: file.name,
          status: 'failed',
          message: `Failed to upload ${file.name} to Dropbox`
        });
        console.error(error);
      });
  });
};

// this provides download link for downloaded files
router.get('/download', function(req, res) {
  const file = path.join(__dirname, 'tmp', req.query.file);
  const fileName = path.basename(file);
  console.log(`Dowloading ${fileName} ...`);
  res.download(file, fileName);
});

// to add torrent enter 'http://your_url.com/torAdd?magnet=magnet_link
router.post('/torAdd', function(req, res) {
  const socket = req.app.io;
  const parsedInfo = magnet.decode(req.body.magnet);
  console.log(`Downloading ${parsedInfo.name}`);
  client.add(req.body.magnet, {
    path: path.join(__dirname, 'tmp')
  }, (torrent) => {
    torrent.on('done', () => {
      console.log('Torrent download finished');
      // Send status to the client
      socket.emit('got_torrent', {
        name: parsedInfo.name,
        hash: torrent.infoHash,
        status: 'Torrent download finished',
        files: torrent.files
      });
      // Start saving each of the downloaded files to Dropbox
      dropboxUpload(torrent.files)
    });
  });
  res.send(`Downloading ${parsedInfo.name}`);
});

module.exports = router;
