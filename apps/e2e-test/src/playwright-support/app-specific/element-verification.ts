import { expect } from '@playwright/test';
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { Screen, Status } from '../../utils/types';

import { getDeviceStatus, getOptions, getViewScreenSize } from './element-read';

export const verifyViewScreenSize = async (
  page: Page,
  selector: TargetSelector,
  screenSize: Screen,
  negate = false
): Promise<void> => {
  logger.trace(`Verify element view size${negate ? ' not' : ''} to be ${screenSize}`);
  if (negate) {
    expect(await getViewScreenSize(page, selector)).not.toEqual(screenSize);
  } else {
    expect(await getViewScreenSize(page, selector)).toEqual(screenSize);
  }
};

export const verifyDeviceStatus = async (
  page: Page,
  selector: TargetSelector,
  status: Status,
  negate = false
): Promise<void> => {
  logger.trace(`Verify device status${negate ? ' not' : ''} to be turned ${status}`);
  if (negate) {
    expect(await getDeviceStatus(page, selector)).not.toEqual(status);
  } else {
    expect(await getDeviceStatus(page, selector)).toEqual(status);
  }
};

export const verifyOptions = async (
  page: Page,
  selector: TargetSelector,
  options: string[],
  negate = false
): Promise<void> => {
  logger.trace(`Verify element should${negate ? ' not' : ''} contain ${options} options`);
  if (negate) {
    expect(await getOptions(page, selector)).not.toEqual(options);
  } else {
    expect(await getOptions(page, selector)).toEqual(options);
  }
};
