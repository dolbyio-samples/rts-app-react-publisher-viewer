import { expect } from '@playwright/test';
import { Page } from 'playwright';

import { State } from '../utils/type';

import CommonPage from './CommonPage';
import PublisherPreviewPageLocators from './PublisherPreviewPageLocators';

export class PublisherPreviewPage extends CommonPage {
  readonly locators: PublisherPreviewPageLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PublisherPreviewPageLocators(page);
  }

  async open(url: string) {
    console.log(`\tPublisherPreviewPage:: Open publisher application - ${url}`);
    await this.page.bringToFront();
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    console.log(`\tPublisherPreviewPage:: Wait for page to load`);
    await this.page.waitForSelector(this.locators.startBtnSelector);
    await this.verifyStartBtnState('enabled');
  }

  async startStreaming() {
    console.log(`\tPublisherPreviewPage: Publisher start streaming`);
    await this.page.bringToFront();
    await this.locators.startBtn.click();
  }

  async verifyStartBtnState(state: State) {
    console.log(`\tPublisherPreviewPage:: Verify start button is ${state}`);
    await this.verifyComponentState(this.locators.startBtn, state);
  }

  async verifyHeaderLblState(state: State) {
    console.log(`\tCommon:: Verify header label is ${state}`);
    await this.verifyComponentState(this.locators.heading, state);
  }

  async verifyDescriptionLblState(state: State) {
    console.log(`\tCommon:: Verify description label is ${state}`);
    await this.verifyComponentState(this.locators.description, state);
  }

  async verifyStartBtnText(text: string) {
    console.log(`\tPublisherPreviewPage:: Verify start button text to be ${text}`);
    await expect(this.locators.startBtn).toHaveText(text);
  }

  async verifyGetStartedHeader(text: string) {
    console.log(`\tPublisherPreviewPage:: Verify get started header as ${text}`);
    await expect(this.locators.heading).toHaveText(text);
  }

  async verifyGetStartedDesc(text: string) {
    console.log(`\tPublisherPreviewPage:: Verify get started description as ${text}`);
    await expect(this.locators.description).toHaveText(text);
  }
}
