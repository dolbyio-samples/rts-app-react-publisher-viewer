# WIP: stream-demo-react-milicast

Internal MVP of Milicast SDK Demo

**NOTE**: We are still actively developing this project

#### Install

```javascript
yarn
```

#### Your millicast token and stream name, id

```bash
VITE_MILLICAST_STREAM_NAME=<your stream name>
VITE_MILLICAST_STREAM_PUBLISHING_TOKEN=<your stream token>
VITE_MILLICAST_STREAM_ID=<your stream id>
```

**Note**: please set these env variables before you launch the apps by .env file or command line

#### Run the publisher app in dev mode

```javascript
yarn nx serve publisher
```

#### Build the publisher app and preview it

Run the command below in terminal and open the browser

```javascript
yarn nx preview publisher
```

#### Run the end to end test

```javascript
yarn nx e2e publisher
```

### Add a new component in libs

After the command below, your component should be in `libs/<your component name>`

```javascript
yarn nx g @nxext/vite:library <your component name>
```
