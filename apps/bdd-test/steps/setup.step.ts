/* eslint-disable no-unused-vars */
import { Given, When, Then } from "@cucumber/cucumber";

import { SetupPage } from "../pages/SetupPage";
import { options } from "../playwright.config";
import { ScenarioWorld } from "../support/ScenarioWorld";

let setupPage: SetupPage;

Given("a publisher is on the setup page", async function (this: ScenarioWorld) {
  setupPage = new SetupPage(this.publisherPage);
  await setupPage.open(options?.publisherURL as string);
});

When("the publisher starts live event", async () => {
  await setupPage.goLive();
});

When("the publisher copy the viewer link", async () => {
  await setupPage.copyViewerLink();
});

Then("the publisher should be redirected to setup page", async () => {
  await setupPage.waitForPageLoad();
});

Then(
  "the copy link button text should be changed to {string}",
  async (text) => {
    await setupPage.verifyCopyLinkButtonText(text);
  }
);

Then("the viewer link should be correct", async () => {
  await setupPage.verifyViewerLink();
});
