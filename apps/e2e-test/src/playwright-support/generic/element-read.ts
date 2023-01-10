/* eslint-disable no-return-await */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { State } from '../../utils/types';

import { getLocator } from './element-helper';

export const getElementState = async (page: Page, selector: TargetSelector, state: State): Promise<boolean> => {
  logger.trace(`Get element state ${state}`);

  const locator = getLocator(page, selector);

  switch (state) {
    case 'displayed':
    case 'visible':
      return await locator.isVisible();
    case 'invisible':
    case 'hidden':
      return await locator.isHidden();
    case 'enabled':
      return await locator.isEnabled();
    case 'disabled':
      return await locator.isDisabled();
    case 'editable':
      return await locator.isEditable();
    case 'checked':
      return await locator.isChecked();
    default:
      throw Error(`Invalid Element State ${state}`);
  }
};

export const getElementText = async (page: Page, selector: TargetSelector) => {
  logger.trace(`Get element text`);
  const locator = getLocator(page, selector);
  return await locator.textContent();
};

export const getElementValue = async (page: Page, selector: TargetSelector) => {
  logger.trace(`Get element text`);
  const locator = getLocator(page, selector);
  return await locator.inputValue();
};
