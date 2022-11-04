import fs from 'fs';
import path from 'path';

import {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
  ITestCaseHookParameter,
  Status,
  BeforeStep,
} from '@cucumber/cucumber';
import { ITestStepHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { expect } from '@playwright/test';

import { options } from '../playwright.config';

import { BrowserManager } from './BrowserManager';
import { ScenarioWorld } from './ScenarioWorld';

const browserMgr = new BrowserManager();
setDefaultTimeout(options.timeout as number);

BeforeAll(async () => {
  console.log('Hooks:: BeforeAll:: Launch browser');
  console.log(`Hooks:: BeforeAll:: Options \n ${JSON.stringify(options, null, 2)}`);
  await browserMgr.launch();
});

AfterAll(async () => {
  console.log('Hooks:: AfterAll:: Close browser');
  await browserMgr.browser.close();
});

Before(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
  console.log('Hooks:: Before:: Open context and page');
  this.startTime = new Date();
  this.featureName = scenario.gherkinDocument.feature?.name as string;
  this.scenarioName = scenario.pickle.name;
  this.featureNameFormated = this.featureName.toLowerCase().replace(/\s+/gi, '-');
  this.scenarioNameFormated = this.scenarioName.toLowerCase().replace(/\s+/gi, '-');
  this.options = options;

  this.browser = browserMgr.browser;
  this.context = await browserMgr.newContext(this);
  this.page = await this.context.newPage();
  this.publisherPage = this.page;
  this.viewerPage = await this.context.newPage();
  // TODO: Capture browser console logs
  this.publisherConsoleLogs = BrowserManager.monitorConsoleLogs(this.publisherPage);
  this.publisherConsoleErrorLogs = BrowserManager.monitorConsoleErrorLogs(this.publisherPage);
});

After(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
  console.log('Hooks:: After:: Close context and page');
  const videoFile = (await this.page.video()?.path()) as string;
  const traceFile = await stopTrace(this);
  await screenshot(this, scenario);

  await this.viewerPage.close();
  await this.publisherPage.close();
  await this.context.close();

  retainArtifacts(videoFile, traceFile, this, scenario);

  console.log(`Console Logs:\n${this.publisherConsoleLogs}`);
  console.log(`Console Error Logs:\n${this.publisherConsoleErrorLogs}`);
  expect(this.publisherConsoleErrorLogs).toHaveLength(0);
});

BeforeStep(async function (step: ITestStepHookParameter) {
  console.log(`STEP:: ${step.pickleStep.text}`);
});

async function stopTrace(scenarioWorld: ScenarioWorld) {
  console.log('Hooks:: Stop trace');
  const traceFile = `${scenarioWorld.options.reportPath}/traces/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}-trace.zip`;
  if (scenarioWorld.options.trace !== 'off') {
    await scenarioWorld.context.tracing.stop({
      path: traceFile,
    });
  }
  return traceFile;
}

async function screenshot(scenarioWorld: ScenarioWorld, scenario: ITestCaseHookParameter) {
  console.log('Hooks:: Take screenshot');
  const screenshotOption = scenarioWorld.options.screenshot;
  const scenarioStatus = scenario.result?.status;
  const screenshotFile = `${scenarioWorld.options.reportPath}/screenshots/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}.png`;

  if (screenshotOption !== 'off') {
    if (!(scenarioStatus === Status.PASSED && screenshotOption === 'only-on-failure')) {
      const screenshot = await scenarioWorld.page.screenshot({
        path: screenshotFile,
      });
      await scenarioWorld.attach(screenshot, 'image/png');
    }
  }
  return screenshotFile;
}

async function retainArtifacts(
  videoFile: string,
  traceFile: string,
  scenarioWorld: ScenarioWorld,
  scenario: ITestCaseHookParameter
) {
  console.log('Hooks:: Retain video and trace artifacts');
  const scenarioStatus = scenario.result?.status;
  const scenarioDuration = scenario.result?.duration;

  await scenarioWorld.attach(`Status: ${scenarioStatus}. Duration:${scenarioDuration?.seconds}s`);

  if (scenarioStatus === Status.PASSED && scenarioWorld.options.video === 'retain-on-failure') {
    const videoDir = path.dirname(videoFile);
    fs.rmSync(videoDir, { recursive: true, force: true });
  } else {
    await scenarioWorld.attach(`Video File: ${videoFile}`);
  }

  if (scenarioStatus === Status.PASSED && scenarioWorld.options.trace === 'retain-on-failure') {
    fs.rmSync(traceFile, { recursive: true, force: true });
  } else {
    await scenarioWorld.attach(`Trace File: ${traceFile}`);
  }
}
