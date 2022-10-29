import { Locator, Page } from "playwright";

export default class CommonLocators {
  private page: Page;

  readonly shareLinkBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shareLinkBtn = page.locator("[test-id=shareLinkButton]");
  }
}
