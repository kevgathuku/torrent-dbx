const Dropbox = require('dropbox');

const dbx = new Dropbox({
  accessToken: process.env.REACT_APP_DROPBOX_ACCESS_TOKEN
});

const checkStatus = (store, statusObject) => {
  console.log(`Checking status of ${statusObject.async_job_id}`);
  dbx.filesSaveUrlCheckJobStatus({
      async_job_id: statusObject.async_job_id
    })
    .then((response) => {
      // Status: 'in_progress' | 'complete' | 'failed'
      let fileStatus = {
        hash: statusObject.hash,
        name: statusObject.name,
        async_job_id: statusObject.async_job_id,
        status: response['.tag']
      };
      switch (response['.tag']) {
        case 'in_progress':
          store.updateFileStatus(fileStatus, Object.assign(fileStatus, {
            message: `${statusObject.name} upload in progress`
          }));
          // Call the function again after 10 seconds
          setTimeout(
            function() {
              process.nextTick(checkStatus, store, statusObject);
            }, 10 * 1000);
          break;
        case 'failed':
          store.updateFileStatus(Object.assign(fileStatus, {
            message: `${statusObject.name} upload failed`
          }));
          console.log('Failed:', response['failed'])
          break;
        case 'complete':
          store.updateFileStatus(Object.assign(fileStatus, {
            message: `${statusObject.name} upload complete`
          }));
          console.log(`${statusObject.async_job_id} upload complete`)
          break;
        default:
          console.log('Failed to match response: ', response);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const beginDropboxUpload = (store, torrent) => {
  torrent.files.forEach(function(file, index) {
    console.log(`${file.length} ${file.url}`);

    let baseStatusObject = {
      hash: torrent.hash,
      name: file.name
    };

    dbx.filesSaveUrl({
        path: `/Saves/${file.path}`,
        url: file.url
      })
      .then((response) => {
        // Async upload started
        if (response['.tag'] === 'async_job_id') {
          // Update store
          let status = Object.assign(baseStatusObject, {
            status: 'started',
            message: `Started uploading ${file.name} to Dropbox`,
            async_job_id: response['async_job_id']
          });
          store.updateFileStatus(status);

          checkStatus(store, status);
          console.log(`Started async upload: ${response['async_job_id']}`);
        } else if (response['.tag'] === 'complete') {
          console.log(`Downloaded ${file.name}`);
          // Send status to the client
          let status = Object.assign(baseStatusObject, {
            status: 'complete',
            message: `Downloaded ${file.name} to Dropbox`
          });
          store.updateFileStatus(status);
        }
        console.log(response);
      })
      .catch((error) => {
        let status = Object.assign(baseStatusObject, {
          status: 'failed',
          message: `Failed to upload ${file.name} to Dropbox`
        });
        store.updateFileStatus(status);
        console.error(error);
      });
  });
};
