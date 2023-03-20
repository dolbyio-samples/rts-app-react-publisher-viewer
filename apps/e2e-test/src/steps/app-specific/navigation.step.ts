/* eslint-disable func-names */
import { Given, When } from '@cucumber/cucumber';

import { ScenarioWorld } from '#e2e-test/src/hooks/ScenarioWorld';
import { getData, hasData, saveData } from '#e2e-test/src/hooks/utils';
import { bringToFront, goToURL } from '#e2e-test/src/playwright-support/generic/browser-actions';
import { getElementText } from '#e2e-test/src/playwright-support/generic/element-read';
import { formatURL } from '#e2e-test/src/utils/helper';
import { options } from '#e2e-test/test.config';

Given(/^a publisher is on the "(preview)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'publisherApp');
  await goToURL(this.currentPage, options?.publisherURL as string);

  const targetSelector = this.selectorMap.getSelector(this.currentPageName, 'viewer link');
  const viewerURL = (await getElementText(this.currentPage, targetSelector)) as string;

  saveData(this, 'App', 'publisher');
  saveData(this, 'ViewerURL', viewerURL);
  saveData(this, 'ViewerBaseURL', `${new URL(viewerURL).origin}`, false);
});

Given(/^a viewer is on the "(waiting-room)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'viewerApp');
  saveData(this, 'App', 'viewer');
  let viewerURL: string;
  if (hasData(this, 'ViewerURL')) {
    viewerURL = getData(this, 'ViewerURL');
  } else {
    viewerURL = formatURL(options?.viewerURL as string);
  }
  await goToURL(this.currentPage, viewerURL);
});

When(/^the publisher switch to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'publisherApp');
  saveData(this, 'App', 'publisher');
  await bringToFront(this.currentPage);
});

When(/^the viewer switch to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'viewerApp');
  saveData(this, 'App', 'viewer');
  await bringToFront(this.currentPage);
});

When(
  /^switch to "([^"]*)" page on "(publisher|viewer)" app$/,
  async function (this: ScenarioWorld, pageName: string, appName: string) {
    this.currentPageName = pageName;
    this.currentPage = getData(this, `${appName}App`);
    saveData(this, 'App', appName);
    await bringToFront(this.currentPage);
  }
);
