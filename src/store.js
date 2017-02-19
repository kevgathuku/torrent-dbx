import {
  action,
  autorun,
  extendObservable
} from 'mobx';

class AppStore {
  constructor() {
    extendObservable(this, {
      torrents: [],
      status: 'Loading...',
      pendingRequests: 0,
      incrementPendingRequests: action('incrementPendingRequests', function() {
        this.pendingRequests += 1;
      }),
      decrementPendingRequests: action('decrementPendingRequests', function() {
        this.pendingRequests -= 1;
      }),
      setStatus: action('setStatus', function(status) {
        this.status = status;
      }),
      addTorrent: action('addTorrent', function(torrent) {
        this.torrents.push(torrent);
      }),
      removeTorrent: action('removeTorrent', function(torrent) {
        this.torrents.remove(torrent);
      }),
      updateFileStatus: action('updateFileStatus', function(fileStatus) {
        console.log(fileStatus);
        // Find the correct torrent in the torrents array
        let torrent = this.torrents.find(tor => {
          return tor.hash === fileStatus.hash;
        });
        // Find the correct file in the torrent.files array
        let fileIndex = torrent.files.findIndex(torrentFile => {
          return torrentFile.name === fileStatus.name;
        });
        // Replace the file at the index with the new fileStatus object
        if (fileIndex > -1) {
          torrent.files[fileIndex] = fileStatus;
        } else {
          torrent.files.push(fileStatus);
        }
      })
    })

    autorun(() => console.log(this.torrents.map(function(torrent) {
      return torrent.name;
    })));
  }
}


export default new AppStore();
