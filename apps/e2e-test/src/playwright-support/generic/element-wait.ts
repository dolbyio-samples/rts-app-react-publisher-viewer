/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TimeOutError } from '../../utils/custom-exception';
import { TargetSelector } from '../../utils/selector-mapper';

import { getLocator } from './element-helper';

export const waitFor = async <T>(
  predicate: () => T | Promise<T>,
  options?: { timeout?: number; wait?: number }
): Promise<T> => {
  const { timeout = 20000, wait = 1000 } = options || {};
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const startTime = new Date().getTime();
  let error;

  while (new Date().getTime() - startTime < timeout) {
    try {
      const result = await predicate();
      // predicate fn has passed and not raised any exception
      if (result === undefined) return result;
      // predicate fn has returned true means verfication is passed
      if (result) return result;
    } catch (e: unknown) {
      error = e;
    }

    await sleep(wait);
    logger.info(`\tWaiting for ${wait} ms`);
  }

  if (error) {
    throw error;
  } else {
    throw new TimeOutError(`\tWait time of ${timeout}ms exceeded`);
  }
};

export const waitForSelector = async (
  page: Page,
  selector: string,
  options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number; strict?: boolean }
): Promise<boolean> => {
  try {
    const { state = 'visible', timeout = 30, strict = false } = options || {};

    await page.waitForSelector(selector, {
      state,
      timeout,
      strict,
    });
    return true;
  } catch (e) {
    return false;
  }
};

export const waitForLocator = async (
  page: Page,
  selector: TargetSelector,
  options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number }
): Promise<boolean> => {
  try {
    const { state = 'visible', timeout = 30 } = options || {};

    const locator = await getLocator(page, selector);

    await locator.waitFor({
      state,
      timeout,
    });
    return true;
  } catch (e) {
    return false;
  }
};
