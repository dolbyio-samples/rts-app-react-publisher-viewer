# rts-app-react-publisher-viewer

A sample app to showcase the capabilities of Dolby.io's Real Time Streaming SDK and how it can be used to design solutions that require ultra low latency (sub 500ms). You can read more about this offering from Dolby.io [here](https://dolby.io/products/real-time-streaming/).

## Prerequisites

In order to run this demo, you will need a Dolby.io account. If you don't already have one, you can create one on [our website](https://dashboard.dolby.io).

## Features and roadmap

- [x] Publish and view streams
- [x] Invite viewers to watch your stream
- [x] Mute audio and video both as publisher and viewer
- [x] Screen sharing
- [x] Publish with simulcast (only on Chrome)
- [x] Microphone and camera device selection
- [x] Resolution, bandwidth, codec, and bitrate selection
- [x] Observing stream statistics
- [ ] Ability to stream from two or more sources
- [ ] Ability to have multiple publishers
- [ ] Grid layout for video sources
- [ ] Recording your streams
- [ ] Chromecast support
- [ ] Picture in picture support
- [ ] Ability to see stats for each individual source
- [ ] Improved simulcast stats for the publisher

## Project structure

This project is setup as a yarn based nx-managed monorepo, and contains the following:

- Publisher app (under `apps/publisher`)
- Viewer/subscriber app (under `apps/viewer`)
- Tests (under `tests/*` )
- Shared components/hooks (under `libs/*`)
- Storybook stories (under `.apps/stories/*`)

The Millicast solution is broken down into 2 parts - the publisher (or the broadcaster) and the subscriber (or the viewer). This repository contains sample code for both parts.

## Installation and setup

To install the libraries necessary, run the following command:

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

**Note**: Please set these env variables before you launch the apps. You can either set them via the command line in your bash/zsh environment or by entering them in your .env file.

#### Configuring the viewer link

The viewer link is configured in the `.env` file in your `apps/publisher` directory, or in your bash/zsh/systen environment variables. To set the URL, insert/update the following variable:

```bash
VITE_MILLICAST_VIEWER_BASE_URL=<Your URL goes here>
```

> If you are using a particular port number, please add this to the URL.

```bash
VITE_MILLICAST_VIEWER_BASE_URL=http://localhost:5174/
```

#### Run the publisher app in dev mode

```bash
yarn nx serve publisher
```

#### Build the publisher app and preview it

Run the following command in terminal and open the browser:

```bash
yarn nx preview publisher
```

#### Run the viewer app

To run your app in dev mode, run the following command in your terminal and open the browser:

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

#### Components

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

#### Hooks

- useMediaCapabilities
- useNotification
- usePublisher
- useViewer

## Browser compatibility

While utmost care has been taken to ensure this works across all browsers, please note that there are some limitations and therefore, we recommend Chromium based browsers or Safari as the best means to test out these applications. Some browser known issues are:

- Simulcast only works when the publisher is on Chrome (and uses H.264 or VP8 as the codec).

Generally speaking, our app has been tested to work on the following browser versions:

- Google Chrome v100+
- Apple Safari v16.x
- Edge v107.x

There are known limitations with webRTC and Mozilla Firefox, and therefore the browser is not recommended.

## Known Issues

The apps and components provided here should be used as reference material. Although we have taken great care in creating these, please note that they are not intended for real production use and there may be some bugs.

Please report any issues under `Issues` on our [GitHub](https://github.com/dolbyio-samples/stream-demo-react-millicast/issues) and appropriately label them. Please review the existing open issues before raising a new one.
