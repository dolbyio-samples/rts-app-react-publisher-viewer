# Real-time Streaming - Publisher & Viewer Sample Apps

<p align="center">
<img src="documentation/assets/banner.jpg" width="175px" />
</p>

## Overview

Quickly stand-up a lightning fast, broadcast quality, real-time streaming app with ultra low-latency (sub 500ms).
Want to learn more? Check out the [Real Time Streaming app gallery page](https://docs.dolby.io/streaming-apis/docs/real-time-streaming-publisher-viewer-sample-apps).


## Getting Started

### Prerequisites

- Node v16.16.0
- Yarn v1.22.19
- A Dolby.io account

#### How to get a Dolby.io account

To setup your Dolby.io account, go to the [Dolby.io dashboard](https://dashboard.dolby.io/signup/) and complete the form. After confirming your email address, you will be logged in.  

## Features and roadmap

### RTS Publisher

- [x] Publish streams
- [x] Publish with simulcast (only on Chrome)
- [x] Microphone and camera device selection
- [x] Invite viewers to watch your stream
- [x] Screen sharing
- [x] Mute audio and video
- [x] Resolution, bandwidth, codec, and bitrate selection
- [x] Ability to stream from up to 4 sources. See [here](https://docs.dolby.io/streaming-apis/docs/create-multi-view-web-app) for bandwidth limitations.
- [x] Ability to stream a local video file
- [x] Observing stream statistics for each simulcast layer
- [ ] Ability to have multiple publishers
- [ ] Recording your streams

### RTS Viewer

- [x] View streams
- [x] Mute audio and video
- [x] Observing stream statistics
- [x] Select incoming stream quality with simulcast
- [x] Ability to see stats for each individual source
- [ ] Chromecast support
- [ ] Picture in picture support

## Project structure

This project is setup as a yarn based nx-managed monorepo, and contains the following:

- Publisher app (under `apps/publisher`)
- Viewer/subscriber app (under `apps/viewer`)
- Tests (under `tests/*` )
- Shared components/hooks (under `libs/*`)
- Storybook stories (under `.apps/stories/*`)

The RTS solution is broken down into 2 parts - the publisher (or the broadcaster) and the subscriber (or the viewer). This repository contains sample code for both parts.

## Installation and setup

To install the libraries necessary, run the following command:

```bash
yarn
```

### Millicast (RTS) Tokens

In order for this application to work, you need three sets of tokens - `stream name`, `stream account id` and `stream publishing token`. These tokens can be found in your [Dolby.io dashboard](https://streaming.dolby.io/#/tokens), under the streaming tab for a given token.

![tokens screenshot](docs/img/tokens.png)

```bash
VITE_RTS_STREAM_NAME=<your stream name>
VITE_RTS_STREAM_PUBLISHING_TOKEN=<your stream token>
VITE_RTS_ACCOUNT_ID=<your stream id>
```

**Note**: Please set these env variables before you launch the apps. You can either set them via the command line in your bash/zsh environment or by entering them in your .env file.

#### Configuring the viewer link

The viewer link is configured in the `.env` file in your `apps/publisher` directory, or in your bash/zsh/systen environment variables. To set the URL, insert/update the following variable:

```bash
VITE_RTS_VIEWER_BASE_URL=<Your URL goes here>
```

> If you are using a particular port number, please add this to the URL.

```bash
VITE_RTS_VIEWER_BASE_URL=http://localhost:5174/
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

## More resources

Looking for more sample apps and projects? Head to the [Project Gallery](https://docs.dolby.io/communications-apis/page/gallery).
