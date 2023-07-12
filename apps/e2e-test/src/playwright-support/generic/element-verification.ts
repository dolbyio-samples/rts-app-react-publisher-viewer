import { expect } from '@playwright/test';
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { State } from '../../utils/types';

import { getLocator } from './element-helper';
import { getElementValue } from './element-read';

export const verifyElementState = async (
  page: Page,
  selector: TargetSelector,
  state: State,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element state${negate ? ' not' : ''} to be ${state}`);
  const locator = await getLocator(page, selector, index);
  const matcher = negate ? expect(locator).not : expect(locator);

  switch (state) {
    case 'displayed':
    case 'visible':
      await matcher.toBeVisible();
      break;
    case 'invisible':
    case 'hidden':
      await matcher.toBeHidden();
      break;
    case 'enabled':
      await matcher.toBeEnabled();
      break;
    case 'disabled':
      await matcher.toBeDisabled();
      break;
    case 'editable':
      await matcher.toBeEditable();
      break;
    case 'selected':
    case 'checked':
      await matcher.toBeChecked();
      break;
    case 'unselected':
    case 'unchecked':
      await matcher.not.toBeChecked();
      break;
    default:
      throw Error(`Invalid Element State ${state}`);
  }
};

export const verifyElementText = async (
  page: Page,
  selector: TargetSelector,
  text: string,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element text${negate ? ' not' : ''} to be ${text}`);
  const locator = await getLocator(page, selector, index);
  if (negate) {
    await expect(locator).not.toHaveText(text);
  } else {
    await expect(locator).toHaveText(text);
  }
};

export const verifyElementMatchText = async (
  page: Page,
  selector: TargetSelector,
  expPattern: string,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element text should${negate ? ' not' : ''} match to be ${expPattern}`);
  const locator = await getLocator(page, selector, index);
  const actText = await locator.textContent();

  const regExp = new RegExp(expPattern, 'i');
  if (negate) {
    await expect(actText).not.toMatch(regExp);
  } else {
    await expect(actText).toMatch(regExp);
  }
};

export const verifyElementContainsText = async (
  page: Page,
  selector: TargetSelector,
  text: string,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element${negate ? ' does not' : ''} contain text ${text}`);
  const locator = await getLocator(page, selector, index);

  if (negate) {
    await expect(locator).not.toContainText(text);
  } else {
    await expect(locator).toContainText(text);
  }
};

export const verifyElementValue = async (
  page: Page,
  selector: TargetSelector,
  text: string,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element text${negate ? ' not' : ''} to be ${text}`);
  const locator = await getLocator(page, selector, index);
  if (negate) {
    await expect(locator).not.toHaveValue(text);
  } else {
    await expect(locator).toHaveValue(text);
  }
};

export const verifyElementContainsValue = async (
  page: Page,
  selector: TargetSelector,
  value: string,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element ${negate ? ' does not' : ''} contain value ${value}`);
  const actValue = await getElementValue(page, selector, index);
  const regExp = new RegExp(value);
  if (negate) {
    await expect(actValue).not.toMatch(regExp);
  } else {
    await expect(actValue).toMatch(regExp);
  }
};

export const verifyElementCount = async (
  page: Page,
  selector: TargetSelector,
  count: number,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element count${negate ? ' not' : ''} to be ${count}`);
  const locator = await getLocator(page, selector, index);
  if (negate) {
    await expect(locator).not.toHaveCount(count);
  } else {
    await expect(locator).toHaveCount(count);
  }
};

export const isElementVisible = async (page: Page, selector: TargetSelector, index?: number): Promise<boolean> => {
  const locator = await getLocator(page, selector, index);
  return await locator.isVisible();
};
