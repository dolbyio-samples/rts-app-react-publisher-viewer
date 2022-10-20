# WIP: stream-demo-react-milicast
Internal MVP of Milicast SDK Demo

**NOTE**: We are still actively developing this project

### Install 
```javascript
yarn
```

### Run the publisher app in dev mode
```javascript
VITE_MILLICAST_STREAM_NAME=<your stream name> VITE_MILLICAST_STREAM_PUBLISHING_TOKEN=<your stream token> yarn dev-pub
```


### Build the publisher app and preview it
Run the command below in terminal and open the browser
```javascript
yarn build-pub && yarn preview-pub
```

### Run the BDD test
```javascript
yarn bdd-test
```