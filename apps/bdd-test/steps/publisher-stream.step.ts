/* eslint-disable no-unused-vars */
import { Then, When } from '@cucumber/cucumber';

import { getPageObject } from '../pages/PageUtils';
import { ScenarioWorld } from '../support/ScenarioWorld';

When(/^the publisher stops streaming on the (Stream) page$/, async function (this: ScenarioWorld, pageName) {
  const pageObject = getPageObject(this, `Publisher${pageName}Page`);
  await pageObject.stopStreaming();
});

Then(
  /^on the publisher (Stream) page participant count value should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, participantCount) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyParticipantCount(participantCount);
  }
);

Then(
  /^on the publisher (Stream) page stop button should be (visible|hidden|enabled|disabled)$/,
  async function (this: ScenarioWorld, pageName, buttonState) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStopBtnState(buttonState);
  }
);

Then(
  /^on the publisher (Stream) page stop button text should be "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName, value) {
    const pageObject = getPageObject(this, `Publisher${pageName}Page`);
    await pageObject.verifyStopBtnText(value);
  }
);
