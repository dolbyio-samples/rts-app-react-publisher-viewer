/* eslint-disable no-unused-vars */
import { Given, When, Then } from '@cucumber/cucumber';

import { getPageObject } from '../pages/PageUtils';
import { options } from '../playwright.config';
import { ScenarioWorld } from '../support/ScenarioWorld';

Given(/^a publisher is on the (Preview) page$/, async function (this: ScenarioWorld, pageName) {
  const pageObject = getPageObject(this, `Publisher${pageName}Page`);
  await pageObject.open(options?.publisherURL as string);
  // TODO: If the Stream page is the first step in SC, then add logic to open and start the stream
  // a publisher is on the (Preview|Stream) page
});

When(/^the publisher starts streaming on the (Preview) page$/, async function (this: ScenarioWorld, pageName) {
  const pageObject = getPageObject(this, `Publisher${pageName}Page`);
  await pageObject.startStreaming();
});

Then(
  /^on the publisher (Preview) page heading should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, state) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyHeaderLblState(state);
  }
);

Then(
  /^on the publisher (Preview) page description should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, state) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyDescriptionLblState(state);
  }
);

Then(
  /^on the publisher (Preview) page start button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStartBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview) page heading value should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyGetStartedHeader(value);
  }
);

Then(
  /^on the publisher (Preview) page description value should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyGetStartedDesc(value);
  }
);

Then(
  /^on the publisher (Preview) page start button text should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStartBtnText(value);
  }
);

// When('the publisher copy the viewer link', async () => {
//   await previewPage.copyViewerLink();
// });

// Then('the publisher should be redirected to setup page', async () => {
//   await previewPage.waitForPageLoad();
// });

// Then('the copy link button text should be changed to {string}', async (text) => {
//   await previewPage.verifyCopyLinkButtonText(text);
// });

// Then('the viewer link should be correct', async () => {
//   await previewPage.verifyViewerLink();
// });

// Then(/^the publisher should be shown with microphone button( enabled| disabled)?$/, async (state) => {
//   console.log(`State: ${state}`)
//   await previewPage.getMicrophoneStatus()
// });
