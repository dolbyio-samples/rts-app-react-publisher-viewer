import { Page, Locator } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';

import { getLocator } from './element-helper';

export const click = async (page: Page, selector: TargetSelector, index?: number): Promise<void> => {
  logger.trace(`Click on selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.click();
};

export const check = async (page: Page, selector: TargetSelector, index?: number): Promise<void> => {
  logger.trace(`Check the selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.check();
};

export const uncheck = async (page: Page, selector: TargetSelector, index?: number): Promise<void> => {
  logger.trace(`Uncheck the selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.uncheck({ force: true });
};

export const hover = async (page: Page, selector: TargetSelector, index?: number): Promise<void> => {
  logger.trace(`Hover over the selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.hover();
};

export const enterText = async (page: Page, selector: TargetSelector, text: string, index?: number): Promise<void> => {
  logger.trace(`Enter ${text} in selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.fill(text);
};

export const clearText = async (page: Page, selector: TargetSelector, index?: number): Promise<void> => {
  logger.trace(`Clear text from selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.fill('');
  await locator.clear();
};

export const takeScreenshot = async (
  page: Page,
  selector: TargetSelector,
  path: string,
  targetMaskSelectors?: TargetSelector[],
  index?: number
): Promise<void> => {
  logger.trace(`take screenshot of selector: ${selector}`);
  const locator = await getLocator(page, selector, index);

  targetMaskSelectors = targetMaskSelectors || [];
  const maskLocators: Locator[] = [];
  for (const maskSelector of targetMaskSelectors) {
    maskLocators.push(await getLocator(page, maskSelector, index));
  }

  await locator.screenshot({
    animations: 'disabled',
    mask: maskLocators,
    path: path,
  });
};

export const fileUploadInput = async (
  page: Page,
  selector: TargetSelector,
  filePath: string,
  index?: number
): Promise<void> => {
  logger.trace(`File upload from selector: ${selector}`);
  const locator = await getLocator(page, selector, index);
  await locator.setInputFiles(filePath);
};
