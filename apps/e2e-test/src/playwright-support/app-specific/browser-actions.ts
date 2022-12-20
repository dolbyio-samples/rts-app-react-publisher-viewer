/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { expect } from '@playwright/test';
import { BrowserContext } from 'playwright';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData, saveData } from '../../hooks/utils';
import { logger } from '../../logger';
import { BrowserManager } from '../utils/BrowserManager';

export async function openPages(
  scenarioWorld: ScenarioWorld,
  browserMgr: BrowserManager,
  apps: string[]
): Promise<void> {
  logger.trace('Create context and page');
  const context = await browserMgr.newContext(scenarioWorld);
  saveData(scenarioWorld, 'context', context);

  for (const app of apps) {
    const appPage = await browserMgr.newPage(context);
    saveData(scenarioWorld, app, appPage);
    saveData(scenarioWorld, `${app}ConsoleLogs`, BrowserManager.monitorConsoleLogs(appPage));
    const videoFile = (await appPage.video()?.path()) as string;
    if (videoFile.trim() !== '') saveData(scenarioWorld, `${app}VideoFile`, videoFile);
  }
}

export async function closePages(
  scenarioWorld: ScenarioWorld,
  browserMgr: BrowserManager,
  apps: string[]
): Promise<void> {
  logger.trace('Close context and page');
  const context = getData(scenarioWorld, 'context') as BrowserContext;

  // Close Pages and Context
  await browserMgr.closePages(context);
  await BrowserManager.closeContext(context);

  // Verify Console logs for the opened pages/tabs
  for (const app of apps) {
    const consoleLogs = getData(scenarioWorld, `${app}ConsoleLogs`) as string[];
    const errorLogs = BrowserManager.filterErrorLogs(consoleLogs);
    logger.trace(`${app} Console Logs: ${consoleLogs}`);
    if (errorLogs.length > 0) logger.error(`${app} Error Console Logs: ${errorLogs}`);
    expect(errorLogs).toHaveLength(0);
  }
}
