const deepFreeze = require("deep-freeze");

import { torrentsReducer } from "./reducer";

describe("Store", function() {
  describe("addTorrent", () => {
    it("adds a torrent to the store", () => {
      const initialState = {
        status: "Loading...",
        torrents: {}
      };

      const torrent = {
        name: "torrent name",
        hash: "12345",
        status: "Torrent download finished",
        files: []
      };

      const action = {
        type: "ADD_TORRENT",
        torrent
      };

      const stateAfter = {
        status: "Loading...",
        torrents: {
          [torrent.hash]: torrent
        }
      };

      deepFreeze(initialState);
      deepFreeze(action);

      expect(torrentsReducer(initialState, action)).toEqual(stateAfter);
    });
  });

  describe("removeTorrent", () => {
    it("removes torrent if found", () => {
      const torrent = {
        name: "torrent name",
        hash: "12345",
        status: "Torrent download finished",
        files: []
      };
      const initialState = {
        status: "Loading...",
        torrents: {
          [torrent.hash]: torrent
        }
      };

      const action = {
        type: "REMOVE_TORRENT",
        hash: torrent.hash
      };

      const stateAfter = {
        status: "Loading...",
        torrents: {}
      };

      deepFreeze(initialState);
      deepFreeze(action);

      expect(torrentsReducer(initialState, action)).toEqual(stateAfter);
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

      const initialState = {
        status: "Loading...",
        torrents: {
          [torrent.hash]: torrent
        }
      };

      let updatedFileStatus = Object.assign(fileStatus, {
        status: "complete"
      });

      const action = {
        type: "UPDATE_FILE_STATUS",
        fileStatus: updatedFileStatus
      };

      const stateAfter = {
        status: "Loading...",
        torrents: {
          [torrent.hash]: {
            name: "torrent name",
            hash: "12345",
            status: "Torrent download finished",
            files: [updatedFileStatus]
          }
        }
      };

      deepFreeze(initialState);
      deepFreeze(action);

      expect(torrentsReducer(initialState, action)).toEqual(stateAfter);
    });
  });

  test("mergeTorrentInfo adds new info to matching torrent", () => {
    const torrent = {
      name: "klefnef",
      hash: "12345",
      status: "Torrent download in progress",
      files: [
        {
          name: "haha",
          length: 34423,
          path: "/lemfe/fefe"
        }
      ]
    };

    const initialState = {
      status: "Loading...",
      torrents: {
        [torrent.hash]: torrent
      }
    };

    let updatedTorrent = Object.assign({}, torrent, {
      name: "This is the new me!"
    });

    const action = {
      type: "MERGE_TORRENT_INFO",
      torrent: updatedTorrent
    };

    let finalState = {
      status: "Loading...",
      torrents: {
        12345: updatedTorrent
      }
    };

    expect(torrentsReducer(initialState, action)).toEqual(finalState);
  });
});
