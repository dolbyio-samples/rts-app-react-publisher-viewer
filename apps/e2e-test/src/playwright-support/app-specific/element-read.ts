/* eslint-disable no-await-in-loop */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { delay } from '../../utils/helper';
import { TargetSelector } from '../../utils/selector-mapper';
import { Screen, State, Status } from '../../utils/types';
import { click } from '../generic/element-action';
import { getLocator } from '../generic/element-helper';
import { getElementCount, getElementState, getElementText, getTableData } from '../generic/element-read';

export const getViewScreenSize = async (page: Page, selector: TargetSelector, index?: number): Promise<Screen> => {
  logger.trace(`Get view screen size`);
  const screenSize = await isViewFullScreen(page, selector, index);
  return screenSize ? 'Full' : 'Normal';
};

export const isViewFullScreen = async (page: Page, selector: TargetSelector, index?: number): Promise<boolean> => {
  logger.trace(`Is view full screen`);
  const locator = getLocator(page, selector, index);
  const attributeValue = await locator.getAttribute('class');
  return !!attributeValue?.includes('video--fullscreen');
};

export const getDeviceStatus = async (page: Page, selector: TargetSelector, index?: number): Promise<Status> => {
  logger.trace(`Get device status`);
  const deviceStatus = await isDeviceButtonToggled(page, selector, index);
  return deviceStatus ? 'Off' : 'On';
};

export const isDeviceButtonToggled = async (page: Page, selector: TargetSelector, index?: number): Promise<boolean> => {
  logger.trace(`Is device button toggled`);
  const locator = getLocator(page, selector, index);
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

export const getSimulcastStatus = async (page: Page, selector: TargetSelector, index?: number): Promise<Status> => {
  logger.trace(`Get simulcast status`);
  const locator = getLocator(page, selector, index);
  return (await locator.isChecked()) ? 'On' : 'Off';
};

export const getStreamStats = async (page: Page, tabSelector: TargetSelector, tableSelector: TargetSelector) => {
  logger.trace(`Get stream info stats`);

  const infoData: { [k: string]: { [k: string]: string } } = {};

  if (await getElementState(page, tabSelector, 'displayed' as State, 0)) {
    const tabCount = await getElementCount(page, tabSelector);

    for (let i = 0; i < tabCount; i++) {
      await click(page, tabSelector, i);
      await delay(3000);
      const tabName = await getElementText(page, tabSelector, i);
      const statsInfo = await getTableData(page, tableSelector);
      infoData[tabName as string] = transponseStreamData(statsInfo);
    }
  } else {
    const statsInfo = await getTableData(page, tableSelector);
    infoData['Standard'] = transponseStreamData(statsInfo);
  }

  return infoData;
};

const transponseStreamData = (tableData: string[][]): { [k: string]: string } => {
  const transponsedObj: { [k: string]: string } = {};
  tableData.forEach((data) => {
    transponsedObj[data[0] as string] = data[1] as string;
  });
  return transponsedObj;
};
