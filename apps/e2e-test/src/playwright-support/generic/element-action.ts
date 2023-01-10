import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';

import { getLocator } from './element-helper';

export const click = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Click on selector: ${selector}`);
  const locator = getLocator(page, selector);
  await locator.click();
};

export const check = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Check the selector: ${selector}`);
  const locator = getLocator(page, selector);
  await locator.check();
};

export const uncheck = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Uncheck the selector: ${selector}`);
  const locator = getLocator(page, selector);
  await locator.uncheck({ force: true });
};

export const hover = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Hover over the selector: ${selector}`);
  const locator = getLocator(page, selector);
  await locator.hover();
};
