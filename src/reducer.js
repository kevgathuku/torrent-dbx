import produce from "immer";
import { createStore } from "redux";

const initialState = {
  status: "Loading...",
  torrents: {}
};

export const torrentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STATUS":
      return Object.assign({}, state, {
        status: action.status
      });
    case "ADD_TORRENT":
      return Object.assign({}, state, {
        torrents: {
          [action.torrent.hash]: action.torrent
        }
      });
    case "REMOVE_TORRENT":
      return produce(state, draftState => {
        delete draftState.torrents[action.hash];
      });
    case "UPDATE_FILE_STATUS":
      return produce(state, draftState => {
        let torrent = draftState.torrents[action.fileStatus.hash];

        // Find the correct file in the torrent.files array
        let fileIndex = torrent.files.findIndex(torrentFile => {
          return torrentFile.name === action.fileStatus.name;
        });

        // Update the file at the index with the new fileStatus
        if (fileIndex > -1) {
          let previousFile = torrent.files[fileIndex];
          torrent.files[fileIndex] = Object.assign(
            {},
            previousFile,
            action.fileStatus
          );
        }
      });
    case "MERGE_TORRENT_INFO":
      return produce(state, draftState => {
        let currentTorrent = draftState.torrents[action.torrent.hash];
        let mergedTorrent = Object.assign({}, currentTorrent, action.torrent);
        draftState.torrents[action.torrent.hash] = mergedTorrent;
      });
    default:
      return state;
  }
};

export const store = createStore(
  torrentsReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
