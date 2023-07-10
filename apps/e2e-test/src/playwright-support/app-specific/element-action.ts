/* eslint-disable no-unused-expressions */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { Status } from '../../utils/types';
import { getLocator } from '../generic/element-helper';

import { getDeviceStatus, getSimulcastStatus } from './element-read';
import { delay } from '../../utils/helper';

export const toogleDevice = async (page: Page, selector: TargetSelector, status: Status): Promise<void> => {
  status === 'On' ? await turnOnDevice(page, selector) : await turnOffDevice(page, selector);
};

export const turnOnDevice = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Turn On the ${selector} device`);
  const locator = await getLocator(page, selector);
  if ((await getDeviceStatus(page, selector)) === 'Off') {
    await locator.click();
  } else {
    throw new Error(`Device ${selector} is already turned On`);
  }
};

export const turnOffDevice = async (page: Page, selector: TargetSelector): Promise<void> => {
  logger.trace(`Turn Off the ${selector} device`);
  const locator = await getLocator(page, selector);
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
  status: Status,
  raiseErr = true,
  index?: number
): Promise<void> => {
  status === 'On'
    ? await turnOnSimulcast(page, selector, clickSelector, raiseErr, index)
    : await turnOffSimulcast(page, selector, clickSelector, raiseErr, index);
};

export const turnOnSimulcast = async (
  page: Page,
  selector: TargetSelector,
  clickSelector: TargetSelector,
  raiseErr = true,
  index?: number
): Promise<void> => {
  logger.trace(`Turn On the simulcast`);
  if ((await getSimulcastStatus(page, selector, index)) === 'Off') {
    const locator = await getLocator(page, clickSelector, index);
    await locator.click();
  } else if (raiseErr) {
    throw new Error(`Simulcast is already turned On`);
  }
};

export const turnOffSimulcast = async (
  page: Page,
  selector: TargetSelector,
  clickSelector: TargetSelector,
  raiseErr = true,
  index?: number
): Promise<void> => {
  logger.trace(`Turn Off simulcast`);
  if ((await getSimulcastStatus(page, selector, index)) === 'On') {
    const locator = await getLocator(page, clickSelector, index);
    await locator.click();
  } else if (raiseErr) {
    throw new Error(`Simulcast is already turned Off`);
  }
};

export const selectSettingDropdown = async (
  page: Page,
  selector: TargetSelector,
  optionsSelector: TargetSelector,
  option: string,
  index?: number
): Promise<void> => {
  logger.trace(`Select ${option} from ${selector}`);
  let locator = await getLocator(page, selector, index);
  locator.click();
  await delay(1000);
  locator = await getLocator(page, optionsSelector, index);
  await locator.filter({ hasText: option }).click();
  await delay(1000);
};
