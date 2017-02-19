import io from 'socket.io-client';
import request from 'superagent';

let BASE_URL;
if (process.env.NODE_ENV === 'production') {
  BASE_URL = '';
} else {
  BASE_URL = 'http://localhost:4000';
}

const socket = io(BASE_URL);

socket.on('connect', function() {
  console.log('Connection established');
});

export default {
  postMagnetURI: (store, magnetValue) => {
    request
      .post(`${BASE_URL}/torAdd`)
      .send({
        magnet: magnetValue
      })
      .end((err, res) => {
        if (!err) return store.setStatus(res.text);
        return store.setStatus('Failed to start torrent download');
      });
  },
  socket: socket
};
