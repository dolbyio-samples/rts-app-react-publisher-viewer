/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';

import { Status } from '@cucumber/cucumber';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { BrowserContext, Page } from 'playwright';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { logger } from '../../logger';
import { getData } from '../../hooks/utils';

export async function captureArtifacts(
  scenarioWorld: ScenarioWorld,
  scenario: ITestCaseHookParameter,
  apps: string[]
): Promise<void> {
  await trace(scenarioWorld, scenario);

  await screenshot(scenarioWorld, scenario, apps);

  await video(scenarioWorld, scenario, apps);
}

async function trace(scenarioWorld: ScenarioWorld, scenario: ITestCaseHookParameter): Promise<string> {
  logger.debug('Save trace');
  const scenarioStatus = scenario.result?.status;
  let traceFile = '';

  if (!(scenarioStatus === Status.PASSED && scenarioWorld.options.trace === 'retain-on-failure')) {
    traceFile = `${scenarioWorld.options.reportPath}/traces/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}-trace.zip`;
    const context = getData(scenarioWorld, 'context') as BrowserContext;
    await context.tracing.stop({
      path: traceFile,
    });
    await scenarioWorld.attach(`Trace File: ${traceFile}`);
  }

  return traceFile;
}

async function screenshot(scenarioWorld: ScenarioWorld, scenario: ITestCaseHookParameter, apps: string[]) {
  logger.debug('Capture screenshot');
  const screenshotOption = scenarioWorld.options.screenshot;
  const scenarioStatus = scenario.result?.status;

  if (screenshotOption !== 'off') {
    if (!(scenarioStatus === Status.PASSED && screenshotOption === 'only-on-failure')) {
      const screenshotDir = `${scenarioWorld.options.reportPath}/screenshots/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}/`;
      for (const app of apps) {
        const filename = `${screenshotDir}/${app}.png`;
        const appPage = getData(scenarioWorld, app) as Page;
        const screenshotBuff = await appPage.screenshot({
          path: filename,
        });
        await scenarioWorld.attach(`${app} Screenshot: ${filename}`);
        await scenarioWorld.attach(screenshotBuff, 'image/png');
      }
    }
  }
}

async function video(scenarioWorld: ScenarioWorld, scenario: ITestCaseHookParameter, apps: string[]): Promise<void> {
  logger.debug('Save video');
  const scenarioStatus = scenario.result?.status;

  if (scenarioStatus === Status.PASSED && scenarioWorld.options.video === 'retain-on-failure') {
    const videoFile = getData(scenarioWorld, `${apps[0]}VideoFile`) as string;
    const videoDir = path.dirname(videoFile);

    fs.rmSync(videoDir, { recursive: true, force: true });
    if (fs.readdirSync(path.dirname(videoDir)).length === 0) {
      fs.rmSync(path.dirname(videoDir), { recursive: true, force: true });
    }
  } else {
    for (const app of apps) {
      try {
        const videoFile = getData(scenarioWorld, `${app}VideoFile`) as string;
        const newVideoFile = videoFile.replace(path.basename(videoFile), `${app}.webm`);
        fs.renameSync(videoFile, newVideoFile);
        await scenarioWorld.attach(`${app} Video File: ${newVideoFile}`);
      } catch (e: unknown) {
        // Do nothing
      }
    }
  }
}
