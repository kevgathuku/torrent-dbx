import magnet from 'magnet-uri';

export default {
  isValidMagnetURI: function(uri) {
    var hash = magnet.decode(uri).infoHash;
    // Infohash should be 40 chars long
    if (/^[A-Za-z0-9]{40}$/.test(hash)) {
      return true;
    }
    return false;
  }
};
