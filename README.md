## Torrent to Dropbox

Download torrents to your Dropbox

## Setup

- Clone the repo locally and navigate to the app's folder

```sh
https://github.com/kevgathuku/torrent-dbx
cd torrent-dbx
```

- Install the dependencies

```sh
yarn
```

- Copy the .env.example file to .env and replace the values in the .env file with the appropriate values

```sh
cp .env.example .env
```

The following are the required environment variables:

- `DROPBOX_ACCESS_TOKEN`- Required to save files to your Dropbox account. You can obtain one from https://www.dropbox.com/developers/apps

## Usage

Start the app through the `npm start` command.
The app should now be running on `localhost:3000`

In the input field that appears, paste in a magnet link and the torrent will be
downloaded and saved to your Dropbox account under the `Saves` folder.

Because of the way the Dropbox functionality is set up, the app must be deployed
for the Dropbox upload to work. [Heroku](https://www.heroku.com/) is the
recommended hosting platform.

Try it out below:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
