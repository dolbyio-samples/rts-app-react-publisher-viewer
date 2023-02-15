/* eslint-disable func-names */
import { Given, When } from '@cucumber/cucumber';

import { options } from '../../../test.config';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData, hasData, saveData } from '../../hooks/utils';
import { bringToFront, goToURL } from '../../playwright-support/generic/browser-actions';
import { readClipboardText } from '../../playwright-support/generic/clipboard-actions';
import { click, hover } from '../../playwright-support/generic/element-action';
import { formatURL } from '../../utils/helper';

Given(/^a publisher is on the "(preview)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'publisherApp');
  await goToURL(this.currentPage, options?.publisherURL as string);

  let viewerURL: string;
  if (this.options.dynamicStreamName) {
    let targetSelector = this.selectorMap.getSelector(this.currentPageName, 'invite button');
    await click(this.currentPage, targetSelector);
    targetSelector = this.selectorMap.getSelector(this.currentPageName, 'company name');
    await hover(this.currentPage, targetSelector);
    viewerURL = readClipboardText();
  } else {
    viewerURL = formatURL(options?.viewerURL as string);
  }
  saveData(this, 'App', 'publisher');
  saveData(this, 'ViewerURL', viewerURL, false);
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
  /^the (publisher|viewer) switch to "([^"]*)" page on "([^"]*)"$/,
  async function (this: ScenarioWorld, appType: string, pageName: string, appName: string) {
    this.currentPageName = pageName;
    this.currentPage = getData(this, appName);
    saveData(this, 'App', appType);
    await bringToFront(this.currentPage);
  }
);