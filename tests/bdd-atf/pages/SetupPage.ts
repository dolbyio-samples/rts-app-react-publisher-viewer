/* eslint-disable no-unused-expressions */
import { expect } from "@playwright/test";
import { Page } from "playwright";

import { delay } from "../utils/helper";

import CommonPage from "./CommonPage";
import SetupPageLocators from "./SetupPageLocators";

export class SetupPage extends CommonPage {
  readonly locators: SetupPageLocators;

  constructor(page: Page) {
    super(page);
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
    await delay(1000);
    await this.page.bringToFront();
    await this.locators.goLiveBtn.click();
  }
}
