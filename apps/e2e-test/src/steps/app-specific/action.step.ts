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
import { addFileSource, addSource, configureSettings, projectAsMainStream } from './workflow/workflow';
import { getDefaultConfigureSettings } from './workflow/workflow.data';

When(
  /^the (?:publisher|viewer) turns (Off|On) the "([^"]*)"$/,
  async function (this: ScenarioWorld, status: Status, selectorName: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    await toogleDevice(this.currentPage, targetSelector, status);
  }
);

When(
  /^(?:the publisher|the viewer|I) turns (Off|On) the "([^"]*)" feature$/,
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
  /^the (publisher|viewer) configures( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "(camera view|screen view|main view|local file view)" setting with the default values$/,
  async function (this: ScenarioWorld, actor: string, elementPosition: string, viewName: string) {
    const expectedData = getDefaultConfigureSettings(`${actor} ${this.currentPageName} ${viewName}`);
    await configureSettings(this, elementPosition, viewName, expectedData);
  }
);

When(
  /^the (publisher|viewer) configures( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "(camera view|screen view|main view|local file view)" setting with the following values( only)?$/,
  async function (
    this: ScenarioWorld,
    actor: string,
    elementPosition: string,
    viewName: string,
    type: string,
    dataTable: DataTable
  ) {
    const defaultExpectedData = getDefaultConfigureSettings(`${actor} ${this.currentPageName} ${viewName}`);
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

When(
  /^the viewer projects main stream as source name containing "([^"]*)"$/,
  async function (this: ScenarioWorld, srcName: string) {
    await projectAsMainStream(this, srcName);
  }
);

When(/^the publisher adds "(local|remote)" file source$/, async function (this: ScenarioWorld, srcName: string) {
  const filePath = 'apps/e2e-test/resources/local-file.mp4';
  await addFileSource(this, srcName, filePath);
});

When(
  /^the publisher adds "(local|remote)" file source with file "([^"]*)"$/,
  async function (this: ScenarioWorld, srcName: string, fileName: string) {
    const filePath = `apps/e2e-test/resources/${fileName}`;
    await addFileSource(this, srcName, filePath);
  }
);
