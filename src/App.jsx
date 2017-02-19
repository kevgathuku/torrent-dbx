import React, { Component } from 'react';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';

import actions from './actions';
import utils from './utils';
import TorrentStatus from './TorrentStatus.jsx';

const App = observer(class App extends Component {
  render() {
    const store = this.props.store;
    return (
      <div className="container">
        <DevTools />
        <div className="row">
          <div className="one columns"><br></br></div>
          <div className="nine columns">
            <h3 className="center"> Save files to Dropbox </h3>
            <form onSubmit={this.addTorrent}>
              <label htmlFor="magnet_link">Magnet Link</label>
              <input className="u-full-width" type="text" placeholder="magnet:?..." id="magnet_link" name="magnet"/>
              <input className="button-primary" type="submit" value="Download"/>
            </form>
            <p>{ store.pendingRequests > 0 ? store.status : null }</p>
            {store.torrents.length > 0 ?
              <TorrentStatus torrents={ store.torrents } />
              : null}
            </div>
          </div>
      </div>
    );
  }

  componentDidMount() {
    actions.socket.on('got_torrent', this.torrentDownloaded)
    actions.socket.on('file_status', this.updateFileStatus)
  }

  torrentDownloaded = (torrent) => {
    const store = this.props.store;
    store.addTorrent(torrent);
    store.decrementPendingRequests();
  }

  updateFileStatus = (fileStatus) => {
    const store = this.props.store;
    store.updateFileStatus(fileStatus);
  }

  addTorrent = (event) => {
    // Prevent the default action for form submission
    event.preventDefault();
    const store = this.props.store;
    // Get the form object and extract the FormData from it
    // This returns the value of the magnet field
    var magnetValue = new FormData(event.target).get('magnet');
    if (!(utils.isValidMagnetURI(magnetValue))) {
      return store.setStatus('Please enter a valid magent URI');
    }
    store.incrementPendingRequests();
    actions.postMagnetURI(store, magnetValue);
  }
});

export default App;
