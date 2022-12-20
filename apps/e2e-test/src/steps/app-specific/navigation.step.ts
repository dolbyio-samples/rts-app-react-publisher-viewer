/* eslint-disable func-names */
import { Given, When } from '@cucumber/cucumber';

import { options } from '../../../playwright.config';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData, hasData, saveData } from '../../hooks/utils';
import { bringToFront, goToURL } from '../../playwright-support/generic/browser-actions';
import { readClipboardText } from '../../playwright-support/generic/clipboard-actions';
import { click, hover } from '../../playwright-support/generic/element-action';
import { isStreamNameDynamic } from '../generic/utils';

Given(/^a publisher is on the "(preview)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'publisherApp');
  await goToURL(this.currentPage, options?.publisherURL as string);

  const dynamicStreamName = hasData(this, 'dynamicStreamName') ? (getData(this, 'dynamicStreamName') as boolean) : true;
  if (dynamicStreamName) {
    let targetSelector = this.selectorMap.getSelector(this.currentPageName, 'invite button');
    await click(this.currentPage, targetSelector);
    targetSelector = this.selectorMap.getSelector(this.currentPageName, 'company name');
    await hover(this.currentPage, targetSelector);

    const viewerURL = readClipboardText();
    saveData(this, 'dynamicStreamName', isStreamNameDynamic(viewerURL), false);
    saveData(this, 'ViewerURL', viewerURL, false);
    saveData(this, 'ViewerBaseURL', `${new URL(viewerURL).origin}`, false);
  }
});

Given(/^a viewer is on the "(waiting-room)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'viewerApp');
  await goToURL(this.currentPage, getData(this, 'ViewerURL') as string);
});

When(/^the publisher switch to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'publisherApp');
  await bringToFront(this.currentPage);
});

When(/^the viewer switch to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = getData(this, 'viewerApp');
  await bringToFront(this.currentPage);
});

When(
  /^the (?:publisher|viewer) switch to "([^"]*)" page on "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName: string, appName: string) {
    this.currentPageName = pageName;
    this.currentPage = getData(this, appName);
    await bringToFront(this.currentPage);
  }
);
