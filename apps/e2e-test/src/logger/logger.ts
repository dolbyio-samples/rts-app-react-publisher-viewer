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
      prettyLogStyles: {
        logLevelName: {
          '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
          DEBUG: ['bold', 'green'],
          ERROR: ['bold', 'red'],
          FATAL: ['bold', 'redBright'],
          INFO: ['bold', 'blue'],
          SCENARIO: ['bold', 'green'],
          SILLY: ['bold', 'white'],
          STEP: ['bold', 'green'],
          TRACE: ['bold', 'whiteBright'],
          WARN: ['bold', 'yellow'],
        },
      },
      prettyLogTemplate: '{{dd}}-{{mm}}-{{yyyy}} {{hh}}:{{MM}}:{{ss}}:{{ms}} :: {{logLevelName}} ::',
    };
    return new CustomLogger(settings);
  }

  private static getMinLevel(logLevel: string): number {
    return (Logger.logMap.get(logLevel.trim().toLowerCase()) || Logger.logMap.get('info')) as number;
  }
}
