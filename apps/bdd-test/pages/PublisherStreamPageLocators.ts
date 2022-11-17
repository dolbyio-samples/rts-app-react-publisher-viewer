import { Locator, Page } from 'playwright';

import CommonLocators from './CommonLocators';

export default class PublisherStreamPageLocators extends CommonLocators {
  readonly stopBtn: Locator;

  readonly participantCount: Locator;

  readonly stopBtnSelector = '[test-id=stopStreamingButton]';

  constructor(page: Page) {
    super(page);
    this.stopBtn = page.locator(this.stopBtnSelector);
    this.participantCount = page.locator('[test-id=participantCountView] p');
  }
}
