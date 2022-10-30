import { Locator, Page } from 'playwright';

import CommonLocators from './CommonLocators';

export default class SetupPageLocators extends CommonLocators {
  readonly goLiveBtn: Locator;

  readonly goLiveBtnSelector = '[test-id=startStreamingButton]';

  constructor(page: Page) {
    super(page);
    this.goLiveBtn = page.locator(this.goLiveBtnSelector);
  }
}
