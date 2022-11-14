/* eslint-disable no-unused-vars */
import { When, Then } from '@cucumber/cucumber';

import { getPageObject } from '../pages/PageUtils';
import { ScenarioWorld } from '../support/ScenarioWorld';

When(
  /^the publisher turns (Off|On) the camera on the (Preview|Stream) page$/,
  async function (this: ScenarioWorld, status, pageName) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.toggleCamera(status);
  }
);

When(
  /^the publisher turns (Off|On) the microphone on the (Preview|Stream) page$/,
  async function (this: ScenarioWorld, status, pageName) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.toggleMicrophone(status);
  }
);

When(
  /^the publisher clicks on (full|normal) screen button of the main view on the (Preview|Stream) page$/,
  async function (this: ScenarioWorld, screen, pageName) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.toggleFullScreenMainStreamView(screen);
  }
);

Then(/^the publisher should be navigated to (Preview|Stream) page$/, async function (this: ScenarioWorld, pageName) {
  const pageObject = getPageObject(this, `Publisher${pageName}Page`);
  await pageObject.waitForPageLoad();
});

Then(
  /^on the publisher (Preview|Stream) page streaming state should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, state) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStreamingLblState(state);
  }
);

Then(
  /^on the publisher (Preview|Stream) page company name should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, state) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyCompanyNameLblState(state);
  }
);

Then(
  /^on the publisher (Preview|Stream) page stream time should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, state) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStreamingTimeLblState(state);
  }
);

Then(
  /^on the publisher (Preview|Stream) page microphone button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyMicrophoneBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page camera button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyCameraBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page share button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyShareBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page setting button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifySettingBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page invite button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyInviteBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page main view should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyMainStreamViewState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page gallery view should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyGalleryViewState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page full screen button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyFullScreenBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Preview|Stream) page streaming state value should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStreamingStatus(value);
  }
);

Then(
  /^on the publisher (Preview|Stream) page company name value should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyCompanyName(value);
  }
);

Then(
  /^on the publisher (Preview|Stream) page stream time value should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyTimer(value);
  }
);

Then(
  /^on the publisher (Preview|Stream) page camera should be turned (On|Off)$/,
  async function (this: ScenarioWorld, pageName, status) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyCameraStatus(status);
  }
);

Then(
  /^on the publisher (Preview|Stream) page microphone should be turned (On|Off)$/,
  async function (this: ScenarioWorld, pageName, status) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyMicrophoneStatus(status);
  }
);

Then(
  /^on the publisher (Preview|Stream) page main view size should be (full|normal) size$/,
  async function (this: ScenarioWorld, pageName, screen) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyMainStreamViewFullScreen(screen);
  }
);
