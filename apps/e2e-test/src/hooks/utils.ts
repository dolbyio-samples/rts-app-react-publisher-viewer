import { logger } from '../logger';
import { GlobalData } from './GlobalData';
import { ScenarioWorld } from './ScenarioWorld';

export const getData = (scenarioWorld: ScenarioWorld, name: string, globalSearch = true) => {
  logger.info(`Get local or global test data for ${name}`);
  if (scenarioWorld.localData.has(name)) {
    return scenarioWorld.localData.get(name);
  }
  logger.warn(`Data not found in the local for the ${name} key`);

  if (globalSearch) {
    return GlobalData.getInstance().load(name);
  }
};

export const saveData = (scenarioWorld: ScenarioWorld, name: string, value: unknown, local = true) => {
  logger.info(`Save local or global test data for ${name}`);
  if (local) {
    scenarioWorld.localData.set(name, value);
  } else {
    GlobalData.getInstance().save(name, value);
  }
};

export const hasData = (scenarioWorld: ScenarioWorld, name: string, globalSearch = true): boolean => {
  logger.info(`Check if data exists for ${name} in local or global`);
  if (scenarioWorld.localData.has(name)) return true;

  if (globalSearch) {
    return GlobalData.getInstance().has(name);
  }
  return false;
};
