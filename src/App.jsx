import React, { Component } from "react";
import { connect } from "react-redux";

import actions from "./actions";
import utils from "./utils";
import TorrentStatus from "./TorrentStatus.jsx";

const mapStatetoProps = state => {
  return {
    torrents: state.torrents
  };
};

const mapDispatchtoProps = dispatch => {
  return {
    onTorrentDownloadStart: torrent => {
      dispatch({ type: "ADD_TORRENT", torrent });
    },
    onTorrentDownloadProgress: torrent => {
      dispatch({ type: "MERGE_TORRENT_INFO", torrent });
    },
    onTorrentDownloadComplete: torrent => {
      dispatch({ type: "MERGE_TORRENT_INFO", torrent });
    },
    addTorrent: event => {
      // Prevent the default action for form submission
      event.preventDefault();
      // Get the form object and extract the magnet field from FormData
      const magnetValue = new FormData(event.target).get("magnet");
      if (!utils.isValidMagnetURI(magnetValue)) {
        dispatch({
          type: "SET_STATUS",
          status: "Please enter a valid magent URI"
        });
        return;
      }
      actions.postMagnetURI(dispatch, magnetValue);
    },
    dismissTorrent: torrent => {
      dispatch({
        type: "REMOVE_TORRENT",
        torrent
      });
    }
  };
};

class App extends Component {
  componentDidMount() {
    const {
      onTorrentDownloadStart,
      onTorrentDownloadProgress,
      onTorrentDownloadComplete
    } = this.props;

    actions.socket.on("download:start", onTorrentDownloadStart);
    actions.socket.on("download:progress", onTorrentDownloadProgress);
    actions.socket.on("download:complete", onTorrentDownloadComplete);
  }

  render() {
    const { addTorrent, dismissTorrent, torrents } = this.props;
    return (
      <React.Fragment>
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <p className="title is-2 lit">Torrent to Dropbox</p>
            <p className="subtitle is-5">
              Dowload torrents straight to your Dropbox
            </p>
          </div>
        </div>

        <div className="columns">
          <div className="column is-8 is-offset-2">
            <form onSubmit={addTorrent}>
              <div className="field">
                <p className="control has-icon">
                  <input
                    className="input is-primary"
                    id="magnet_link"
                    name="magnet"
                    placeholder="Enter magnet URI"
                    type="text"
                  />
                  <span className="icon is-small">
                    <i className="fa fa-magnet" aria-hidden="true" />
                  </span>
                </p>
              </div>
              <div className="form-group">
                <button className="button is-medium is-primary" type="submit">
                  Download
                </button>
              </div>
            </form>
          </div>
        </div>
        <TorrentStatus torrents={torrents} dismissTorrent={dismissTorrent} />
      </React.Fragment>
    );
  }
}

export default connect(mapStatetoProps, mapDispatchtoProps)(App);
