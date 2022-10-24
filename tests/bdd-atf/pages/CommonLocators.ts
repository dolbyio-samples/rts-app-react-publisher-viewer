import { Page } from "playwright";

export default class CommonLocators {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
