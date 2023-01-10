import { loggerLevel } from '../config/defaults';

import { Logger } from './logger';

export const logger = Logger.getInstance(loggerLevel);
