import { BrowserContextOptions, LaunchOptions } from "playwright";

import { BrowserName, PlaywrightOptions } from "./utils/type";

export const launchOptionsChromium: LaunchOptions = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
};

export const launchOptionsChrome: LaunchOptions = {
  channel: "chrome",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
};

export const launchOptionsFirefox: LaunchOptions = {
  args: ["--quiet", "--use-test-media-devices"],
  firefoxUserPrefs: {
    "media.navigator.streams.fake": true,
    "media.navigator.permission.disabled": true,
  },
};

export const browserContextOptions: BrowserContextOptions = {};

export const options: PlaywrightOptions = {
  browserName: (process.env.BROWSER_NAME as BrowserName) || "chrome",
  headless: process.env.HEADLESS?.toLowerCase() === "true" || true,
  timeout: 60 * 1000,
  viewport: null,
  video: "retain-on-failure",
  screenshot: "only-on-failure",
  trace: "retain-on-failure",
  baseURL: "http://localhost:3000",
  publisherURL:
    "https://deploy-preview-26--astounding-lily-fa33fc.netlify.app/",
  viewerURL: "https://viewer.millicast.com/?streamId=KtpPTK/l9c58zkw",
  launchOptions: {
    chromium: launchOptionsChromium,
    chrome: launchOptionsChrome,
    firefox: launchOptionsFirefox,
  },
  contextOptions: browserContextOptions,
};
