/* eslint-disable func-names */
import { DataTable, When } from '@cucumber/cucumber';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import {
  selectSettingDropdown,
  toogleDevice,
  toogleSimulcast,
} from '../../playwright-support/app-specific/element-action';
import { Status } from '../../utils/types';
import { arrayContainsAll } from '../generic/utils';
import { addSource, configureSettings } from './workflow/workflow';
import { getDefaultConfigureSettings } from './workflow/workflow.data';

When(
  /^the publisher turns (Off|On) the "([^"]*)"$/,
  async function (this: ScenarioWorld, status: Status, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    await toogleDevice(this.currentPage, targetSelector, status);
  }
);

When(
  /^(?:the publisher|I) turns (Off|On) the "([^"]*)" feature$/,
  async function (this: ScenarioWorld, status: Status, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const clickSelector = this.selectorMap.getSelector(this.currentPageName, 'simulcast label');
    await toogleSimulcast(this.currentPage, targetSelector, clickSelector, status);
  }
);

When(
  /^the (?:publisher|viewer) selects "([^"]*)" option from the "([^"]*)"$/,
  async function (this: ScenarioWorld, option: string, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const OptionsSelector = this.selectorMap.getSelector(this.currentPageName, `${selectorName} options`);
    await selectSettingDropdown(this.currentPage, targetSelector, OptionsSelector, option);
  }
);

When(
  /^the publisher configures( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "(camera view|screen view)" setting with the default values$/,
  async function (this: ScenarioWorld, elementPosition: string, viewName: string) {
    const expectedData = getDefaultConfigureSettings(`publisher ${this.currentPageName} ${viewName}`);
    await configureSettings(this, elementPosition, viewName, expectedData);
  }
);

When(
  /^the publisher configures( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "(camera view|screen view)" setting with the following values( only)?$/,
  async function (this: ScenarioWorld, elementPosition: string, viewName: string, type: string, dataTable: DataTable) {
    const defaultExpectedData = getDefaultConfigureSettings(`publisher ${this.currentPageName} ${viewName}`);
    let expectedData = dataTable.rowsHash();

    if (!arrayContainsAll(Object.keys(defaultExpectedData), Object.keys(expectedData))) {
      throw Error(`Invalid parameter/key name - ${Object.keys(expectedData)}`);
    }

    if (!type) {
      expectedData = { ...defaultExpectedData, ...dataTable.rowsHash() };
    }
    await configureSettings(this, elementPosition, viewName, expectedData);
  }
);

When(/^the publisher adds "(camera|screen)" source$/, async function (this: ScenarioWorld, srcName: string) {
  await addSource(this, srcName);
});
