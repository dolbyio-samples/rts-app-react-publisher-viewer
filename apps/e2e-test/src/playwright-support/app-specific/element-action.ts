/* eslint-disable no-unused-expressions */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { Status } from '../../utils/types';
import { getLocator } from '../generic/element-helper';

import { getDeviceStatus, getSimulcastStatus } from './element-read';

export const toogleDevice = async (page: Page, selector: TargetSelector, status: Status): Promise<void> => {
  status === 'On' ? await turnOnDevice(page, selector) : await turnOffDevice(page, selector);
};

export const turnOnDevice = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Turn On the ${selector} device`);
  const locator = getLocator(page, selector);
  if ((await getDeviceStatus(page, selector)) === 'Off') {
    await locator.click();
  } else {
    throw new Error(`Device ${selector} is already turned On`);
  }
};

export const turnOffDevice = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Turn Off the ${selector} device`);
  const locator = getLocator(page, selector);
  if ((await getDeviceStatus(page, selector)) === 'On') {
    await locator.click();
  } else {
    throw new Error(`Device ${selector} is already turned Off`);
  }
};

export const toogleSimulcast = async (
  page: Page,
  selector: TargetSelector,
  clickSelector: TargetSelector,
  status: Status
): Promise<void> => {
  status === 'On'
    ? await turnOnSimulcast(page, selector, clickSelector)
    : await turnOffSimulcast(page, selector, clickSelector);
};

export const turnOnSimulcast = async (
  page: Page,
  selector: TargetSelector,
  clickSelector: TargetSelector
): Promise<void> => {
  logger.trace(`Turn On the simulcast`);
  if ((await getSimulcastStatus(page, selector)) === 'Off') {
    const locator = getLocator(page, clickSelector);
    await locator.click();
  } else {
    throw new Error(`Simulcast is already turned On`);
  }
};

export const turnOffSimulcast = async (
  page: Page,
  selector: TargetSelector,
  clickSelector: TargetSelector
): Promise<void> => {
  logger.trace(`Turn Off simulcast`);
  if ((await getSimulcastStatus(page, selector)) === 'On') {
    const locator = getLocator(page, clickSelector);
    await locator.click();
  } else {
    throw new Error(`Simulcast is already turned Off`);
  }
};

export const selectSettingDropdown = async (
  page: Page,
  selector: TargetSelector,
  optionsSelector: TargetSelector,
  option: string
): Promise<void> => {
  logger.trace(`Select ${option} from ${selector}`);
  await getLocator(page, selector).click();
  const locator = getLocator(page, optionsSelector);
  await locator.filter({ hasText: option }).click();
};
