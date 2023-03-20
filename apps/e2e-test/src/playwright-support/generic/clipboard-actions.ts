import clipboard from 'clipboardy';

import { logger } from '#e2e-test/src/logger';

export const readClipboardText = () => {
  logger.trace(`Read the clipboard text`);
  return clipboard.readSync();
};
