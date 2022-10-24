/* eslint-disable no-unused-expressions */
import { expect } from "@playwright/test";
import { Page } from "playwright";

import SetupPageLocators from "./SetupPageLocators";

export class SetupPage {
  readonly page: Page;

  readonly locators: SetupPageLocators;

  constructor(page: Page) {
    this.page = page;
    this.locators = new SetupPageLocators(page);
  }

  async open(url: string) {
    console.log(`SetupPage: Open publisher application - ${url}`);
    await this.page.bringToFront();
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    console.log("LiveStreamPage:: Wait for page to load");
    await this.page.waitForSelector(this.locators.goLiveBtnSelector);
    await expect(this.locators.goLiveBtn).toBeVisible();
  }

  async goLive() {
    console.log(`SetupPage: Publisher go live`);
    await this.page.bringToFront();
    await this.locators.goLiveBtn.click();
  }
}
