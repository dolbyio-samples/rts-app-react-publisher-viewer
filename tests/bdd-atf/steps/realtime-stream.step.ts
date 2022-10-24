/* eslint-disable no-unused-vars */
import { Then, When } from "@cucumber/cucumber";

import { LiveStreamPage } from "../pages/LiveStreamPage";
import { ScenarioWorld } from "../support/ScenarioWorld";

let liveStreamPage: LiveStreamPage;

Then(
  "the publisher should be on live stream page",
  async function (this: ScenarioWorld) {
    liveStreamPage = new LiveStreamPage(this.publisherPage);
    await liveStreamPage.waitForPageLoad();
  }
);

Then(
  "the publisher video should be on shown in video frame",
  async function (this: ScenarioWorld) {
    await liveStreamPage.verifyVideoFrameIsDisplayed();
  }
);

When("the publisher stop the live event", async function (this: ScenarioWorld) {
  await liveStreamPage.stopLive();
});
