var express = require('express');
var WebTorrent = require('webtorrent');
var path = require('path');
var client = new WebTorrent();
var request = require('request');
var Dropbox = require('dropbox');

var app = express();
var dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
app.use(express.static(__dirname + '/public'));

// this provides download link for downloaded files
app.get('/download', function(req, res) {
  var file = path.join(__dirname, 'public', req.query.file);
  var fileName = path.basename(file);
  console.log(`Dowloading ${fileName} ...`);
  res.download(file, fileName); // Set disposition and send it.
});

// to add torrent enter 'your_heroku_name.herokuapp.com/torAdd?magnet=magnet_link
app.get('/torAdd', function(req, res) {
  console.log('started');
  client.add(req.query.magnet, {
    path: 'public'
  }, function(torrent) {
    torrent.on('done', function() {
      console.log('torrent download finished');
      torrent.files.forEach(function(file) {
        console.log(`${file.length} ${file.path} \n`);
        var url = `https://warm-reef-79245.herokuapp.com/download?file=${file.path}`;
        dbx.filesSaveUrl({path: `/Saves/${file.path}`, url: url})
          .then(function(response) {
            if (response['.tag'] === 'async_job_id') {
              job_tag = response['async_job_id'];
              console.log(`Started async upload: ${response['async_job_id']}`);
            } else if (response['.tag'] === complete) {
              console.log(response['complete']);
            }
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    });
  });
  res.send("downloading");
});

app.get('/status/:async_job_id', function(req, res) {
  dbx.filesSaveUrlCheckJobStatus({async_job_id: req.params.async_job_id})
    .then(function(response) {
      res.send(response);
    })
    .catch(function(error) {
      res.send(error);
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Torrent app listening on port 3000!')
})
