import React, { Component } from "react";
import _ from "underscore";

class TorrentItem extends Component {
  _onClick = () => {
    this.props.onDismissTorrent(this.props.torrent);
  };

  render() {
    const torrent = this.props.torrent;
    return (
      <article className="media">
        <div className="media-content">
          <div className="content">
            <div className="columns">
              <div className="column is-8">
                <p>
                  <strong>{torrent.name}</strong>
                  <br />
                  <small>{torrent.hash}</small>
                  <br />
                  <progress
                    className="progress is-info"
                    max="100"
                    value={
                      torrent.stats && torrent.stats.progress
                        ? (torrent.stats.progress * 100)
                        : 0
                    }
                  >
                    {torrent.stats && torrent.stats.progress
                      ? `${torrent.stats.progress * 100} %`
                      : "0 %"}
                  </progress>
                </p>
              </div>
              <div className="column">
                <div className="columns">
                  <a className="column">
                    Files<span className="icon">
                      <i className="fa fa-file" />
                    </span>
                  </a>
                  <a className="column">
                    Delete<span className="icon">
                      <i className="fa fa-trash-o" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div>
              {torrent.files.length > 0
                ? torrent.files.map(file => (
                    <div className="columns" key={file.name}>
                      <p className="column">{file.name}</p>
                      <div className="column">
                        <a
                          href={`https://torrent-dbx.herokuapp.com/download?file=${
                            file.path
                          }`}
                          className="dropbox-saver dropbox-dropin-btn dropbox-dropin-default"
                        >
                          <span className="dropin-btn-status" />
                          Save to Dropbox
                        </a>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      </article>
    );
  }
}

class TorrentStatus extends Component {
  render() {
    const { torrents, dismissTorrent } = this.props;
    return (
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <p className="title is-3">Torrents</p>
          {_.isEmpty(torrents) ? (
            <div className="box">
              <article className="media">
                <p className="subtitle is-5">Add Torrents Above</p>
              </article>
            </div>
          ) : (
            <div className="box">
              {_.map(torrents, torrent => (
                <TorrentItem
                  key={torrent.hash}
                  torrent={torrent}
                  onDismissTorrent={dismissTorrent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TorrentStatus;
