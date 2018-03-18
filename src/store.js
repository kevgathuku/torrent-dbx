import { action, autorun, extendObservable } from "mobx";

class AppStore {
  constructor() {
    extendObservable(this, {
      torrents: {},
      status: "Loading...",
      setStatus: action("setStatus", function(status) {
        this.status = status;
      }),
      addTorrent: action("addTorrent", function(torrent) {
        this.torrents[torrent.hash] = torrent;
      }),
      findTorrentByHash: torrentHash => {
        return this.torrents[torrentHash];
      },
      findTorrent: (list, torrent) => {
        return list.find(tor => {
          return tor.hash === torrent.hash;
        });
      },
      findTorrentIndex: (list, torrent) => {
        return list.findIndex(tor => {
          return tor.hash === torrent.hash;
        });
      },
      mergeTorrentInfo: action("mergeTorrentInfo", function(torrent) {
        let currentTorrent = this.findTorrentByHash(torrent.hash);
        let mergedTorrent = Object.assign({}, currentTorrent, torrent);
        this.torrents[torrent.hash] = mergedTorrent;
      }),
      removeTorrent: action("removeTorrent", function(torrent) {
        delete this.torrents[torrent.hash];
      }),
      updateFileStatus: action("updateFileStatus", function(fileStatus) {
        // Find the correct torrent in the torrents array
        let torrent = this.findTorrentByHash(fileStatus.hash);
        if (!torrent) throw new Error("Corresponding torrent not found");

        // Find the correct file in the torrent.files array
        let fileIndex = torrent.files.findIndex(torrentFile => {
          return torrentFile.name === fileStatus.name;
        });

        // Update the file at the index with the new fileStatus props
        if (fileIndex > -1) {
          let previousFile = torrent.files[fileIndex];
          torrent.files[fileIndex] = Object.assign(
            {},
            previousFile,
            fileStatus
          );
        }
      })
    });

    autorun(() => {
      for (const prop in this.torrents) {
        if (this.torrents.hasOwnProperty(prop)) {
          console.log(`store.${prop} = ${this.torrents[prop]}`);
        }
      }
    });
  }
}

export default new AppStore();
