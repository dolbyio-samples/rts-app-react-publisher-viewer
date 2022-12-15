/* eslint-disable func-names */
import { Given, When } from '@cucumber/cucumber';

import { options } from '../../../playwright.config';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { bringToFront, goToURL } from '../../playwright-support/generic/browser-actions';

Given(/^a publisher is on the "(preview)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = this.globalVariables.publisherApp;
  await goToURL(this.currentPage, options?.publisherURL as string);
});

Given(/^a viewer is on the "(waiting-room)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = this.globalVariables.viewerApp;
  await goToURL(this.currentPage, options?.viewerURL as string);
});

When(/^the publisher switch to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = this.globalVariables.publisherApp;
  await bringToFront(this.currentPage);
});

When(/^the viewer switch to "([^"]*)" page$/, async function (this: ScenarioWorld, pageName: string) {
  this.currentPageName = pageName;
  this.currentPage = this.globalVariables.viewerApp;
  await bringToFront(this.currentPage);
});

When(
  /^the (?:publisher|viewer) switch to "([^"]*)" page on "([^"]*)"$/,
  async function (this: ScenarioWorld, pageName: string, appName: string) {
    this.currentPageName = pageName;
    this.currentPage = this.globalVariables[appName];
    await bringToFront(this.currentPage);
  }
);
