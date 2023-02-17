import clipboard from 'clipboardy';
import { logger } from '../../logger';
import 'source-map-support/register';

export const readClipboardText = () => {
  logger.trace(`Read the clipboard text`);
  return clipboard.readSync();
};
