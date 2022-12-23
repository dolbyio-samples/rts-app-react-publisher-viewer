import { Page } from 'playwright';

import { logger } from '../../logger';

export const goToURL = async (page: Page, appURL: string): Promise<void> => {
  logger.trace(`Go to URL: ${appURL}`);
  await page.bringToFront();
  await page.goto(appURL);
};

export const bringToFront = async (page: Page): Promise<void> => {
  logger.trace(`Bring to front`);
  await page.bringToFront();
};

export const refresh = async (page: Page): Promise<void> => {
  logger.trace(`Refresh page`);
  await page.reload();
};
