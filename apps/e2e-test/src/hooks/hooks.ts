/* eslint-disable no-param-reassign */

/* eslint-disable func-names */
import {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
  ITestCaseHookParameter,
  BeforeStep,
} from '@cucumber/cucumber';
import { ITestStepHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';

import { selectorMappingPath } from '#e2e-test/src/config/defaults';
import { logger } from '#e2e-test/src/logger';
import {
  openPages,
  consoleLogsVerification,
  closePages,
} from '#e2e-test/src/playwright-support/app-specific/browser-actions';
import { BrowserManager } from '#e2e-test/src/playwright-support/utils/BrowserManager';
import { captureArtifacts } from '#e2e-test/src/playwright-support/utils/test-artifacts';
import { formatURL } from '#e2e-test/src/utils/helper';
import { SelectorMapper } from '#e2e-test/src/utils/selector-mapper';
import { options } from '#e2e-test/test.config';

import { GlobalData } from './GlobalData';
import { ScenarioWorld } from './ScenarioWorld';
import { saveData } from './utils';

const selectorMap = new SelectorMapper(selectorMappingPath);
const browserMgr = new BrowserManager();
setDefaultTimeout(options.timeout as number);
const apps = ['publisherApp', 'viewerApp'];
const globalData = GlobalData.getInstance();

BeforeAll(async () => {
  logger.debug(`BeforeAll:: Options \n ${JSON.stringify(options, null, 2)}`);
  await browserMgr.launchBrowser();
});

AfterAll(async () => {
  await browserMgr.closeBrowser();
});

Before(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
  this.selectorMap = selectorMap;
  this.options = options;
  this.globalData = globalData;

  setAppURLs(this);

  setFeatureAndScenarioName(this, scenario);

  logScenarioName(this);

  await openPages(this, browserMgr, apps);
});

After(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
  console.log(`\n`);
  await consoleLogsVerification(this, apps);
  await captureArtifacts(this, scenario, apps);
  await closePages(this, browserMgr);

  await this.attach(`Status: ${scenario.result?.status}`);
});

BeforeStep(async function (step: ITestStepHookParameter) {
  logger.step(`${step.pickleStep.text}`);
});

const setFeatureAndScenarioName = (scenarioWorld: ScenarioWorld, scenario: ITestCaseHookParameter) => {
  scenarioWorld.startTime = new Date();
  scenarioWorld.featureName = scenario.gherkinDocument.feature?.name as string;
  scenarioWorld.scenarioName = scenario.pickle.name;
  scenarioWorld.featureNameFormated = scenarioWorld.featureName.toLowerCase().replace(/\s+/gi, '-');
  scenarioWorld.scenarioNameFormated = scenarioWorld.scenarioName.toLowerCase().replace(/\s+/gi, '-');
};

const logScenarioName = (scenarioWorld: ScenarioWorld) => {
  const scDesc = `${scenarioWorld.featureName} : ${scenarioWorld.scenarioName}`;
  const liner = `${'-'.repeat(scDesc.length * 0.8)}`;
  logger.info(liner);
  logger.scenario(scDesc);
  logger.info(liner);
};

const setAppURLs = (scenarioWorld: ScenarioWorld) => {
  saveData(scenarioWorld, 'PublisherURL', formatURL(options?.publisherURL as string), false);
};
