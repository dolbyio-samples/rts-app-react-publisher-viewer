# WIP: stream-demo-react-milicast

Internal MVP of Milicast SDK Demo

**NOTE**: We are still actively developing this project

#### Install

```bash
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

```bash
yarn nx serve publisher
```

#### Build the publisher app and preview it

Run the command below in terminal and open the browser

```bash
yarn nx preview publisher
```

#### Run the end to end test

```bash
yarn nx e2e publisher
```

### Add a new component in libs

After the command below, your component should be in `libs/<your component name>`

```bash
yarn nx g @nxext/vite:library <your component name>
```


### Storybook
If you need storybook to support your UI component development, add your component code in `libs`, and add the story into `apps/stories`. Also don't forget to add your component path in `.storybook/main.ts`
Then run the command below:
```bash
yarn nx storybook stories
```
