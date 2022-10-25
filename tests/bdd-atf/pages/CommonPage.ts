/* eslint-disable no-unused-expressions */
import { expect } from "@playwright/test";
import clipboard from "clipboardy";
import { Page } from "playwright";

import CommonLocators from "./CommonLocators";

export default class CommonPage {
  readonly page: Page;

  readonly clocators: CommonLocators;

  readonly expectedViewerLink =
    "https://viewer.millicast.com/?streamId=KtpPTK/l9c58zkw";

  constructor(page: Page) {
    this.page = page;
    this.clocators = new CommonLocators(page);
  }

  async copyViewerLink() {
    console.log(`Common: Copy viewer link`);
    await this.clocators.shareLinkBtn.click();
  }

  async verifyCopyLinkButtonText(text: string) {
    console.log(`Common:: Verify copy link button to be ${text}`);
    await expect(this.clocators.shareLinkBtn).toHaveText(text);
  }

  async verifyViewerLink() {
    console.log(`Common:: Verify viewer link`);
    await expect(await clipboard.read()).toEqual(this.expectedViewerLink);
  }
}
