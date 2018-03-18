import store from "./store";

describe("Store", function() {
  describe("addTorrent", () => {
    it("adds a torrent to the store", () => {
      const torrent = {
        name: "torrent name",
        hash: "12345",
        status: "Torrent download finished",
        files: []
      };

      store.addTorrent(torrent);
      expect(store.findTorrentByHash(torrent.hash)).toEqual(torrent);
    });
  });

  describe("findTorrentByHash", () => {
    it("returns torrent if found", () => {
      const torrent = {
        name: "torrent name",
        hash: "12345",
        status: "Torrent download finished",
        files: []
      };

      store.addTorrent(torrent);

      expect(store.findTorrentByHash(torrent.hash)).toEqual(torrent);
    });
  });

  describe("updateFileStatus", function() {
    it("updates the fileStatus in the corresponding torrent object if it exists", function() {
      let fileStatus = {
        hash: "12345",
        name: "file name",
        async_job_id: "async_job_id",
        status: "started",
        message: "Started uploading file name to Dropbox"
      };

      let torrent = {
        name: "torrent name",
        hash: "12345",
        status: "Torrent download finished",
        files: [fileStatus]
      };

      store.addTorrent(torrent);

      let updatedStatus = Object.assign(fileStatus, {
        status: "complete"
      });

      store.updateFileStatus(updatedStatus);
      // The existing file status should be updated
      expect(torrent.files[0].status).toBe(updatedStatus.status);
    });
  });

  test("mergeTorrentInfo adds new info to matching torrent", () => {
    const validTorrent = {
      name: "klefnef",
      hash: "12345",
      status: "",
      files: [
        {
          name: "haha",
          length: 34423,
          path: "/lemfe/fefe"
        }
      ]
    };
    let updatedTorrent = Object.assign({}, validTorrent, {
      name: "This is the new me!"
    });
    let finalState = {
      12345: updatedTorrent
    };
    store.mergeTorrentInfo(updatedTorrent);
    expect(store.torrents).toEqual(finalState);
  });
});
