import React, { Component } from "react";

import actions from "./actions";
import utils from "./utils";
import TorrentStatus from "./TorrentStatus.jsx";

export default class App extends Component {
  render() {
    const store = this.props.store;
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

        <div class="columns">
          <div class="column is-8 is-offset-2">
            <form onSubmit={this.addTorrent}>
              <div class="field">
                <p class="control has-icon">
                  <input
                    class="input is-primary"
                    id="magnet_link"
                    name="magnet"
                    placeholder="Enter magnet URI"
                    type="text"
                  />
                  <span class="icon is-small">
                    <i class="fa fa-magnet" aria-hidden="true" />
                  </span>
                </p>
              </div>
              <div class="form-group">
                <button class="button is-medium is-primary" type="submit">
                  Download
                </button>
              </div>
            </form>
          </div>
        </div>
        {store.torrents.length > 0 ? (
          <TorrentStatus torrents={store.torrents} />
        ) : null}
      </React.Fragment>
    );
  }

  componentDidMount() {
    actions.socket.on("download:start", this.torrentDownloadStart);
    actions.socket.on("download:progress", this.torrentDownloadProgress);
    actions.socket.on("download:complete", this.torrentDownloadComplete);
  }

  torrentDownloadStart = torrent => {
    const store = this.props.store;
    store.addTorrent(torrent);
  };

  torrentDownloadProgress = torrent => {
    const store = this.props.store;
    store.mergeTorrentInfo(torrent);
  };

  torrentDownloadComplete = torrent => {
    const store = this.props.store;
    store.mergeTorrentInfo(torrent);
  };

  addTorrent = event => {
    // Prevent the default action for form submission
    event.preventDefault();
    const store = this.props.store;
    // Get the form object and extract the FormData from it
    // This returns the value of the magnet field
    var magnetValue = new FormData(event.target).get("magnet");
    if (!utils.isValidMagnetURI(magnetValue)) {
      return store.setStatus("Please enter a valid magent URI");
    }
    actions.postMagnetURI(store, magnetValue);
  };
}
