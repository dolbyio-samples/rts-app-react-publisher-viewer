import { expect } from '@playwright/test';
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { State } from '../../utils/types';

import { getLocator } from './element-helper';

export const verifyElementState = async (
  page: Page,
  selector: TargetSelector,
  state: State,
  negate = false
): Promise<void> => {
  logger.trace(`Verify element state${negate ? ' not' : ''} to be ${state}`);
  const locator = getLocator(page, selector);
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
    default:
      throw Error(`Invalid Element State ${state}`);
  }
};

export const verifyElementText = async (
  page: Page,
  selector: TargetSelector,
  text: string,
  negate = false
): Promise<void> => {
  logger.trace(`Verify element text${negate ? ' not' : ''} to be ${text}`);
  const locator = getLocator(page, selector);
  if (negate) {
    await expect(locator).not.toHaveText(text);
  } else {
    await expect(locator).toHaveText(text);
  }
};

export const verifyElementContainsText = async (
  page: Page,
  selector: TargetSelector,
  text: string,
  negate = false
): Promise<void> => {
  logger.trace(`Verify element${negate ? ' does not' : ''} contain text ${text}`);
  const locator = getLocator(page, selector);

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
  negate = false
): Promise<void> => {
  logger.trace(`Verify element text${negate ? ' not' : ''} to be ${text}`);
  const locator = getLocator(page, selector);
  if (negate) {
    await expect(locator).not.toHaveValue(text);
  } else {
    await expect(locator).toHaveValue(text);
  }
};

export const verifyElementCount = async (
  page: Page,
  selector: TargetSelector,
  count: number,
  negate = false
): Promise<void> => {
  logger.trace(`Verify element count${negate ? ' not' : ''} to be ${count}`);
  const locator = getLocator(page, selector);
  if (negate) {
    await expect(locator).not.toHaveCount(count);
  } else {
    await expect(locator).toHaveCount(count);
  }
};
