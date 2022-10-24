import { Locator, Page } from "playwright";

import CommonLocators from "./CommonLocators";

export default class LiveStreamPageLocators extends CommonLocators {
  readonly stopLiveBtn: Locator;

  readonly videoFrame: Locator;

  readonly stopLiveBtnSelector = "[test-id=stopStreamingButton]";

  constructor(page: Page) {
    super(page);
    this.stopLiveBtn = page.locator(this.stopLiveBtnSelector);
    this.videoFrame = page.locator("[test-id=videoFrame]");
  }
}
