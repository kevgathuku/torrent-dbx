var express = require('express');
var WebTorrent = require('webtorrent');
var path = require("path");
var app = express();
var client = new WebTorrent();
var request = require('request');
var openload_login = process.env.OPENLOAD_LOGIN;
var openload_key = process.env.OPENLOAD_KEY;
var oUrl = 'https://api.openload.co/1/remotedl/add?login=' + openload_login + '&key=' + openload_key + '&url=';


app.use(express.static(__dirname + '/public'));

//this provides download link for downloaded files
app.get('/download', function(req, res) {
  var file = path.join(__dirname, 'public', req.query.file);
  res.download(file); // Set disposition and send it.
});

//to add torrent enter 'your_heroku_name.herokuapp.com/torAdd?magnet=magnet_link
app.get('/torAdd', function(req, res) {
  console.log('started');
  client.add(req.query.magnet, {
    path: 'public'
  }, function(torrent) {
    torrent.on('done', function() {
      console.log('torrent download finished');
      torrent.files.forEach(function(file) {
        console.log(`${file.name} ${file.length} ${file.path} \n`);
        request(oUrl + encodeURI(`https://warm-reef-79245.herokuapp.com/download?file=${file.path}`), function(error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(body);
          }
        });
      });
    });
  });
  res.send("downloading");
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Torrent app listening on port 3000!')
})
