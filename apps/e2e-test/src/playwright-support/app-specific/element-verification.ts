import { expect } from '@playwright/test';
import { Page } from 'playwright';
import assert from 'assertion';
import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { Screen, Status } from '../../utils/types';

import { getDeviceStatus, getOptions, getViewScreenSize } from './element-read';

export const verifyViewScreenSize = async (
  page: Page,
  selector: TargetSelector,
  screenSize: Screen,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify element view size${negate ? ' not' : ''} to be ${screenSize}`);
  const viewSize = await getViewScreenSize(page, selector, index);
  if (negate) {
    expect(viewSize).not.toEqual(screenSize);
  } else {
    expect(viewSize).toEqual(screenSize);
  }
};

export const verifyDeviceStatus = async (
  page: Page,
  selector: TargetSelector,
  status: Status,
  negate = false,
  index?: number
): Promise<void> => {
  logger.trace(`Verify device status${negate ? ' not' : ''} to be turned ${status}`);
  const deviceStatus = await getDeviceStatus(page, selector, index);
  if (negate) {
    expect(deviceStatus).not.toEqual(status);
  } else {
    expect(deviceStatus).toEqual(status);
  }
};

export const verifyOptions = async (
  page: Page,
  selector: TargetSelector,
  options: string[],
  negate = false
): Promise<void> => {
  logger.trace(`Verify element should${negate ? ' not' : ''} contain ${options} options`);
  const actOptions = await getOptions(page, selector);
  if (negate) {
    expect(actOptions).not.toEqual(options);
  } else {
    expect(actOptions).toEqual(options);
  }
};

export const verifyOptionsContains = async (page: Page, selector: TargetSelector, options: string[]): Promise<void> => {
  logger.trace(`Verify element should contain ${options} options`);
  const actOptions = await getOptions(page, selector);

  const message = `\n\tExpected Item: ${options}\n\tActualArray: ${actOptions}`;
  assert.has(actOptions, options, message);
};
