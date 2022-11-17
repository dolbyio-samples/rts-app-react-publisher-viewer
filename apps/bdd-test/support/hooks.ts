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
  console.log(`\tHooks:: BeforeAll:: Options \n ${JSON.stringify(options, null, 2)}`);
  await browserMgr.launch();
});

AfterAll(async () => {
  console.log('Hooks:: AfterAll:: Close browser');
  await browserMgr.browser.close();
});

Before(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.featureName = scenario.gherkinDocument.feature?.name as string;
  this.scenarioName = scenario.pickle.name;
  this.featureNameFormated = this.featureName.toLowerCase().replace(/\s+/gi, '-');
  this.scenarioNameFormated = this.scenarioName.toLowerCase().replace(/\s+/gi, '-');
  this.options = options;

  const scDesc = `SCENARIO START:: ${this.featureName} : ${this.scenarioName}`;
  const liner = `${'-'.repeat(scDesc.length)}`;
  console.log(liner);
  console.log(scDesc);
  console.log(liner);

  console.log('\tHooks:: Before:: Open context and page');
  this.browser = browserMgr.browser;
  this.context = await browserMgr.newContext(this);
  this.publisherPage = await this.context.newPage();
  this.viewerPage = await this.context.newPage();
  this.globalVariables['publisherPage'] = this.publisherPage;
  this.globalVariables['viewerPage'] = this.viewerPage;

  this.publisherConsoleLogs = BrowserManager.monitorConsoleLogs(this.publisherPage);
  this.publisherConsoleErrorLogs = BrowserManager.monitorConsoleErrorLogs(this.publisherPage);
});

After(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
  console.log(`SCENARIO END`);
  console.log('\tHooks:: After:: Close context and page');

  const videoFile = (await this.publisherPage.video()?.path()) as string;
  const traceFile = await stopTrace(this);
  await screenshot(this, scenario);

  await this.viewerPage.close();
  await this.publisherPage.close();
  await this.context.close();

  retainArtifacts(videoFile, traceFile, this, scenario);

  console.log(`\tConsole Logs: ${this.publisherConsoleLogs}`);
  console.log(`\tConsole Error Logs: ${this.publisherConsoleErrorLogs}`);
  expect(this.publisherConsoleErrorLogs).toHaveLength(0);
});

BeforeStep(async function (step: ITestStepHookParameter) {
  console.log(`STEP:: ${step.pickleStep.text}`);
});

async function stopTrace(scenarioWorld: ScenarioWorld) {
  console.log('\tHooks:: Stop trace');
  const traceFile = `${scenarioWorld.options.reportPath}/traces/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}-trace.zip`;
  if (scenarioWorld.options.trace !== 'off') {
    await scenarioWorld.context.tracing.stop({
      path: traceFile,
    });
  }
  return traceFile;
}

async function screenshot(scenarioWorld: ScenarioWorld, scenario: ITestCaseHookParameter) {
  console.log('\tHooks:: Take screenshot');
  const screenshotOption = scenarioWorld.options.screenshot;
  const scenarioStatus = scenario.result?.status;

  const screenshot = {
    publisher: '',
    viewer: '',
  };

  if (screenshotOption !== 'off') {
    if (!(scenarioStatus === Status.PASSED && screenshotOption === 'only-on-failure')) {
      const screenshotDir = `${scenarioWorld.options.reportPath}/screenshots/${scenarioWorld.featureNameFormated}`;
      screenshot.publisher = `${screenshotDir}/${scenarioWorld.scenarioNameFormated}-publisher.png`;
      screenshot.viewer = `${screenshotDir}/${scenarioWorld.scenarioNameFormated}-viewer.png`;

      const pScreenshot = await scenarioWorld.publisherPage.screenshot({
        path: screenshot.publisher,
      });
      await scenarioWorld.attach(pScreenshot, 'image/png');

      const vScreenshot = await scenarioWorld.viewerPage.screenshot({
        path: screenshot.viewer,
      });
      await scenarioWorld.attach(vScreenshot, 'image/png');
    }
  }
  return screenshot;
}

async function retainArtifacts(
  videoFile: string,
  traceFile: string,
  scenarioWorld: ScenarioWorld,
  scenario: ITestCaseHookParameter
) {
  console.log('\tHooks:: Retain video and trace artifacts');
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
