const path = require('path');
const express = require('express');
const magnet = require('magnet-uri');
const WebTorrent = require('webtorrent');

const router = express.Router();
const client = new WebTorrent();

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
    client.on('torrent', function (torrent) {
      // When torrent info is ready
      socket.emit('download:start', {
        name: parsedInfo.name,
        hash: torrent.infoHash,
        files: torrent.files.map(function(file) {
          return {
            name: file.name,
            length: file.length,
            path: file.path,
            url: encodeURI(`${req.protocol}://${req.hostname}/download?file=${file.path}`)
          };
        })
      });
    });

    torrent.on('download', function(bytes) {
      socket.emit('download:progress', {
        hash: torrent.infoHash,
        status: 'Torrent download in progress',
        stats: {
          downloaded: torrent.downloaded,
          speed: torrent.downloadSpeed,
          progress: torrent.progress
        }
      });

      console.log('total downloaded: ' + torrent.downloaded);
      console.log('download speed: ' + torrent.downloadSpeed);
      console.log('progress: ' + torrent.progress);
    });

    torrent.on('done', () => {
      console.log('Torrent download finished');
      // Send status to the client
      socket.emit('download:complete', {
        hash: torrent.infoHash,
        status: 'Torrent download complete. Uploading to Dropbox...'
      });
    });
  });
  res.send(`Downloading ${parsedInfo.name}`);
});

module.exports = router;
