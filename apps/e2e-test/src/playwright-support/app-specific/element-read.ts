/* eslint-disable no-await-in-loop */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { Screen, Status } from '../../utils/types';
import { getLocator } from '../generic/element-helper';

export const getViewScreenSize = async (page: Page, selector: TargetSelector): Promise<Screen> => {
  logger.trace(`Get view screen size`);
  const screenSize = await isViewFullScreen(page, selector);
  return screenSize ? 'Full' : 'Normal';
};

export const isViewFullScreen = async (page: Page, selector: TargetSelector): Promise<boolean> => {
  logger.trace(`Is view full screen`);
  const locator = getLocator(page, selector);
  const attributeValue = await locator.getAttribute('class');
  return !!attributeValue?.includes('video--fullscreen');
};

export const getDeviceStatus = async (page: Page, selector: TargetSelector): Promise<Status> => {
  logger.trace(`Get device status`);
  const deviceStatus = await isDeviceButtonToggled(page, selector);
  return deviceStatus ? 'Off' : 'On';
};

export const isDeviceButtonToggled = async (page: Page, selector: TargetSelector): Promise<boolean> => {
  logger.trace(`Is device button toggled`);
  const locator = getLocator(page, selector);
  const attributeValue = await locator.getAttribute('data-active');
  return attributeValue != null;
};

export const getOptions = async (page: Page, selector: TargetSelector): Promise<string[]> => {
  logger.trace(`Get options`);
  const locator = getLocator(page, selector);
  const options: string[] = [];
  const count = await locator.count();

  for (let i = 0; i < count; ++i) {
    options.push((await locator.nth(i).textContent()) as string);
  }
  return options;
};

export const getSimulcastStatus = async (page: Page, selector: TargetSelector): Promise<Status> => {
  logger.trace(`Get simulcast status`);
  const locator = getLocator(page, selector);
  return (await locator.isChecked()) ? 'On' : 'Off';
};
