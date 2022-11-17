import { Locator, Page } from 'playwright';

import CommonLocators from './CommonLocators';

export default class PublisherPreviewPageLocators extends CommonLocators {
  readonly startBtn: Locator;

  readonly heading: Locator;

  readonly description: Locator;

  readonly startBtnSelector = '[test-id=startStreamingButton]';

  constructor(page: Page) {
    super(page);
    this.startBtn = page.locator(this.startBtnSelector);
    this.heading = page.locator('[test-id=getStartedInfoTitle]');
    this.description = page.locator('[test-id=getStartedInfoDesc]');
  }
}
