import { Locator, Page } from 'playwright';

import { TargetSelector } from '../../utils/selector-mapper';

export const getLocator = (page: Page, selector: TargetSelector, index?: number): Locator => {
  let targetLocator: Locator;

  if (typeof selector === 'string') {
    targetLocator = page.locator(selector);
  } else {
    targetLocator = page.locator(selector[0]);
    for (let i = 1; i < selector.length; i++) {
      targetLocator = targetLocator.locator(selector[i]);
    }
  }

  if (typeof index !== 'undefined') {
    targetLocator = targetLocator.nth(index);
  }

  return targetLocator;
};