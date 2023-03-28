import clipboard from 'clipboardy';

import { logger } from '../../logger';

export const readClipboardText = () => {
  logger.trace(`Read the clipboard text`);
  return clipboard.readSync();
};
