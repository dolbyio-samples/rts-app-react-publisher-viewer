/* eslint-disable func-names */
import { Given, When } from '@cucumber/cucumber';

import { options } from '../../../test.config';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData, hasData, saveData } from '../../hooks/utils';
import { bringToFront, goToURL } from '../../playwright-support/generic/browser-actions';
import { getElementText } from '../../playwright-support/generic/element-read';
import { formatURL } from '../../utils/helper';
import { verifyElementState } from '../../playwright-support/generic/element-verification';
import { waitFor } from '../../playwright-support/generic/element-wait';

Given(/^a publisher is on the "(preview)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'publisherApp');
  await goToURL(this.currentPage, options?.publisherURL as string);

  let targetSelector = this.selectorMap.getSelector(this.currentPageName, 'video frame');
  const verifyMethod = async () => {
    await verifyElementState(this.currentPage, targetSelector, 'displayed');
  };
  await waitFor(verifyMethod);

  targetSelector = this.selectorMap.getSelector(this.currentPageName, 'viewer link');
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
