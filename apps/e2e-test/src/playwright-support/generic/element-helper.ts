import { Locator, Page } from 'playwright';

import { TargetSelector } from '../../utils/selector-mapper';

export const getLocator = async (page: Page, selector: TargetSelector, index?: number): Promise<Locator> => {
  let targetLocator: Locator;
  let parentIndexSet = false;

  if (typeof selector === 'string') {
    targetLocator = page.locator(selector);
  } else {
    targetLocator = page.locator(selector[0]);
    if ((await targetLocator.count()) > 1 && typeof index !== 'undefined') {
      targetLocator = targetLocator.nth(index);
      parentIndexSet = true;
    }
    for (let i = 1; i < selector.length; i++) {
      targetLocator = targetLocator.locator(selector[i]);
    }
  }

  if (typeof index !== 'undefined' && !parentIndexSet) {
    targetLocator = targetLocator.nth(index);
  }

  return targetLocator;
};
