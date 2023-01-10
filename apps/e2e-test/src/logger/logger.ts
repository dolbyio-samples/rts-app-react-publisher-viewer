import { CustomLogger } from './custom-logger';

export class Logger {
  private static instance: CustomLogger<unknown>;

  private static logMap = new Map<string, number>([
    ['silly', 0],
    ['trace', 1],
    ['debug', 2],
    ['info', 3],
    ['warn', 4],
    ['error', 5],
    ['fatal', 6],
  ]);

  public static getInstance(logLevel = 'info'): CustomLogger<unknown> {
    if (!Logger.instance) {
      Logger.instance = Logger.createLogger(logLevel);
    }
    return Logger.instance;
  }

  private static createLogger(logLevel = 'info'): CustomLogger<unknown> {
    const settings = {
      minLevel: Logger.getMinLevel(logLevel),
      prettyLogTemplate: '{{dd}}-{{mm}}-{{yyyy}} {{hh}}:{{MM}}:{{ss}}:{{ms}} :: {{logLevelName}} ::',
      prettyLogStyles: {
        logLevelName: {
          '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
          SILLY: ['bold', 'white'],
          TRACE: ['bold', 'whiteBright'],
          DEBUG: ['bold', 'green'],
          INFO: ['bold', 'blue'],
          WARN: ['bold', 'yellow'],
          ERROR: ['bold', 'red'],
          FATAL: ['bold', 'redBright'],
          STEP: ['bold', 'green'],
          SCENARIO: ['bold', 'green'],
        },
      },
    };
    return new CustomLogger(settings);
  }

  private static getMinLevel(logLevel: string): number {
    return (Logger.logMap.get(logLevel.trim().toLowerCase()) || Logger.logMap.get('info')) as number;
  }
}
