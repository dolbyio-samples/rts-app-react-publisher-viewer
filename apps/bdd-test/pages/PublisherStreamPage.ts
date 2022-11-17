/* eslint-disable no-unused-expressions */
import { expect } from '@playwright/test';
import { Page } from 'playwright';

import { State } from '../utils/type';

import CommonPage from './CommonPage';
import PublisherStreamPageLocators from './PublisherStreamPageLocators';

export class PublisherStreamPage extends CommonPage {
  readonly locators: PublisherStreamPageLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PublisherStreamPageLocators(page);
  }

  async waitForPageLoad() {
    console.log('\tPublisherStreamPage:: Wait for page to load');
    await this.page.bringToFront();
    await this.page.waitForSelector(this.locators.stopBtnSelector);
    await this.verifyStopBtnState('enabled');
  }

  async stopStreaming() {
    console.log(`\tPublisherStreamPage: Publisher stop stream`);
    await this.page.bringToFront();
    await this.locators.stopBtn.click();
  }

  async verifyParticipantCount(count: string) {
    console.log(`\tPublisherStreamPage:: Verify participant count is ${count}`);
    const string = count === '1' ? '1 viewer' : `${count} viewers`;
    await expect(this.locators.participantCount).toHaveText(string);
  }

  async verifyStopBtnState(state: State) {
    console.log(`\tPublisherStreamPage:: Verify stop button is ${state}`);
    await this.verifyComponentState(this.locators.stopBtn, state);
  }

  async verifyStopBtnText(text: string) {
    console.log(`\tPublisherPreviewPage:: Verify start button text to be ${text}`);
    await expect(this.locators.stopBtn).toHaveText(text);
  }
}
