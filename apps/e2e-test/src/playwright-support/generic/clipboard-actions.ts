import clipboard from 'clipboardy';
import { logger } from '../../logger';
import { Page } from 'playwright';

export const readClipboardText = async (page: Page): Promise<string> => {
  logger.trace(`Read the clipboard text`);
  // return clipboard.readSync();
  return await page.evaluate('navigator.clipboard.readText()');
};
