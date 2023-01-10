import { Logger as TSLogger, ISettingsParam } from 'tslog';
import { ILogObj, ILogObjMeta } from 'tslog/dist/types/BaseLogger';

export class CustomLogger<LogObj> extends TSLogger<LogObj> {
  // eslint-disable-next-line no-useless-constructor
  constructor(settings?: ISettingsParam<LogObj>, logObj?: LogObj) {
    super(settings, logObj);
  }

  public step(...args: unknown[]): (LogObj & ILogObjMeta & ILogObj) | undefined {
    return super.log(4, 'STEP', ...args);
  }

  public scenario(...args: unknown[]): (LogObj & ILogObjMeta & ILogObj) | undefined {
    return super.log(8, 'SCENARIO', ...args);
  }
}
