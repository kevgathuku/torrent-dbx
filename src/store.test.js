import store from './store';

describe('Store', function() {
  describe('updateFileStatus', function() {
    it('adds the fileStatus to the corresponding torrent object', function() {
      let torrent = {
        name: 'torrent name',
        hash: '12345',
        status: 'Torrent download finished',
        files: []
      };

      let fileStatus = {
        hash: '12345',
        name: 'file name',
        async_job_id: 'async_job_id',
        status: 'started',
        message: 'Started uploading file name to Dropbox'
      };

      store.torrents.push(torrent);
      store.updateFileStatus(fileStatus);
      expect(torrent.files[0]).toBe(fileStatus);
    });

    it('updates the fileStatus in the corresponding torrent object if it exists', function() {
      let torrent = {
        name: 'torrent name',
        hash: '12345',
        status: 'Torrent download finished',
        files: []
      };

      let fileStatus = {
        hash: '12345',
        name: 'file name',
        async_job_id: 'async_job_id',
        status: 'started',
        message: 'Started uploading file name to Dropbox'
      };

      store.torrents.push(torrent);
      // Add the initial file status to the torrent object
      torrent.files[0] = fileStatus;

      let updatedStatus = Object.assign(fileStatus, {
        status: 'complete'
      });

      store.updateFileStatus(updatedStatus);
      // The existing file status should be updated
      expect(torrent.files[0].status).toBe(updatedStatus.status);
    });
  });
});
