/* eslint-disable no-unused-expressions */
import { expect } from "@playwright/test";
import { Page } from "playwright";

import LiveStreamPageLocators from "./LiveStreamPageLocators";

export class LiveStreamPage {
  readonly page: Page;

  readonly locators: LiveStreamPageLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new LiveStreamPageLocators(page);
  }

  async waitForPageLoad() {
    console.log("LiveStreamPage:: Wait for page to load");
    await this.page.bringToFront();
    await this.page.waitForSelector(this.locators.stopLiveBtnSelector);
    await expect(this.locators.stopLiveBtn).toBeVisible();
    await expect(this.locators.stopLiveBtn).toHaveText("Stop Live");
  }

  async stopLive() {
    console.log(`LiveStreamPage: Publisher stop live event`);
    await this.page.bringToFront();
    await this.locators.stopLiveBtn.click();
  }

  async verifyVideoFrameIsDisplayed() {
    console.log(`LiveStreamPage: Verify video frame is displayed`);
    await this.page.bringToFront();
    await expect(this.locators.videoFrame).toBeVisible();
  }
}
