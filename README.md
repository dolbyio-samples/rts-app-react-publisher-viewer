# rts-app-react-publisher-viewer

A sample app to showcase the capabilities of Dolby.io's Real Time Streaming (RTS) SDK and how it can be used to design solutions that require ultra low latency (sub 500ms).

## Prerequisites

In order to run this demo, you will need a Dolby.io account. If you don't already have one, you can create one on [our website](https://dashboard.dolby.io).

## Project structure

This project is setup as a yarn based nx-managed monorepo, and contains the following

- Publisher app (under `apps/publisher`)
- Viewer/subscriber app (under `apps/subscriber`)
- Tests (under `tests/*` )
- Shared components/hooks (under `libs/*`)
- Storybook stories (under `.storybook/*`)

The Millicast solution is broken down into 2 parts - the publisher (or the broadcaster) and the subscriber (or the viewer). This repository contains sample code for both parts.

## Installation and setup

To install the libraries necessary, run the following command.

```bash
yarn
```

### Millicast Tokens

In order for this application to work, you need three sets of tokens - `stream name`, `stream account id` and `stream publishing token`. These tokens can be found in your [Dolby.io dashboard](https://streaming.dolby.io/#/tokens), under the streaming tab for a given token.

![tokens screenshot](docs/img/tokens.png)

```bash
VITE_MILLICAST_STREAM_NAME=<your stream name>
VITE_MILLICAST_STREAM_PUBLISHING_TOKEN=<your stream token>
VITE_MILLICAST_STREAM_ID=<your stream id>
```

**Note**: please set these env variables before you launch the apps. You can either set them via the command line or by entering them in your .env file.

#### Run the publisher app in dev mode

```bash
yarn nx serve publisher
```

#### Build the publisher app and preview it

Run the command below in terminal and open the browser

```bash
yarn nx preview publisher
```

##### Configuring the viewer link

The viewer link is configured in the `.env` file in your `apps/publisher` directory. To set the URL, insert/update the following variable

```bash
VITE_MILLICAST_VIEWER_BASE_URL
```

> If you are using a particular port number, please add this to the URL. The application will use this key in the following manner.

```javascript
// This is only pseudo-code and may not be exactly
const linkText = `${VITE_VIEWER_URL}/?streamAccountId=${streamId}&streamName=${streamName}`;
```

#### Run the viewer app

To run your app in dev mode, run the command below in your terminal and open the browser

```bash
yarn nx serve viewer
```

And to run in preview mode

```bash
yarn nx preview viewer
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
Then, run the command below:

```bash
yarn nx storybook stories
```

The following components and hooks are available for you to use in your applications to simplify your workflow.

#### Hooks

- Alert
- ActionBar
- ControlBar
- DropDown
- InfoLabel
- LiveIndicator
- PopupMenu
- ShareLinkButton
- StatisticInfo
- Timer
- ToggleButton
- VideoView

#### Components

- useMediaCapabilities
- useNotification
- usePublisher
- useViewer

## Project roadmap

In next iteration following features will be added

- [ ] Ability to stream from 2+ sources.
- [ ] Ability to have multiple publishers.
- [ ] Grid layout for Video sources.
- [ ] Recording your streams.
- [ ] Chromecast support.
- [ ] Picture in Picture Support.
- [ ] Ability to see stats for each individual source.
- [ ] Improved simulcast stats for the publisher.

## Browser compatibility

While utmost care has been taken to ensure this works across all browsers, please note that there are some limitations and therefore, we recommend chromium based browsers or safari as the best means to test out these applications. Some known issues are.

- Simulcast only works when the publisher is on chrome (and uses H.264 or VP8 as the codec).
- Screen sharing does not reliably work with Firefox.

Generally speaking, our app has been tested to work on the following browser versions.

- Google Chrome v100+
- Apple Safari v16.x
- Edge v107.x

## Known Issues

The functionality provided here is supposed to serve as reference material, so while complete care was taken while creating these apps, please note that they are not intended for usage in real-world scenarios and as such, may have some bugs. To report a bug, please report them under `Issues` on our [GitHub](https://github.com/dolbyio-samples/stream-demo-react-millicast/issues) and appropriately label them. Please go through the existing open issues before raising a new one.
