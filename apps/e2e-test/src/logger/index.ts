import { loggerLevel } from '#e2e-test/src/config/defaults';

import { Logger } from './logger';

export const logger = Logger.getInstance(loggerLevel);
