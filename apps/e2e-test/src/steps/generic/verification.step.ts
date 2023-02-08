/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';
import { defaultReportPath } from '../../config/defaults';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import {
  verifyElementContainsText,
  verifyElementCount,
  verifyElementState,
  verifyElementText,
  verifyElementValue,
} from '../../playwright-support/generic/element-verification';
import { waitFor } from '../../playwright-support/generic/element-wait';
import { verifyImageEqual, verifyImageNotEqual } from '../../playwright-support/generic/verification';
import { State } from '../../utils/types';
import { replaceAttributeTargetSelector } from './utils';

Then(
  /^the( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "([^"]*)" should( not)? be (displayed|visible|invisible|hidden|enabled|disabled|editable|checked|selected)$/,
  async function (this: ScenarioWorld, elementPosition: string, selectorName: string, negate: string, state: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
    const verifyMethod = async () => {
      await verifyElementState(this.currentPage, targetSelector, state as State, !!negate, elementIndex);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" text should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, text: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementText(this.currentPage, targetSelector, text, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" text should( not)? contain "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, text: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementContainsText(this.currentPage, targetSelector, text, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the "([^"]*)" value should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, text: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementValue(this.currentPage, targetSelector, text, !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the number of "([^"]*)" count should( not)? be "([^"]*)"$/,
  async function (this: ScenarioWorld, selectorName: string, negate: string, count: string) {
    const targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    const verifyMethod = async () => {
      await verifyElementCount(this.currentPage, targetSelector, Number(count), !!negate);
    };
    await waitFor(verifyMethod);
  }
);

Then(
  /^the image "([^"]*)" should( not)? be equal to image "([^"]*)"$/,
  async function (this: ScenarioWorld, image1: string, negate: string, image2: string) {
    const image1Path = `${defaultReportPath}/image-compare/${image1}`;
    const image2Path = `${defaultReportPath}/image-compare/${image2}`;
    const diffPath = `${defaultReportPath}/image-compare/${image1.split('.')[0]}-${
      image2.split('.')[0]
    }-${Date.now()}.png`;

    if (negate) {
      verifyImageNotEqual(image1Path, image2Path, diffPath);
    } else {
      verifyImageEqual(image1Path, image2Path, diffPath);
    }
  }
);

Then(
  /^the( "([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd)")? "([^"]*)" with locator attribute "([^"]*)" should( not)? be (displayed|visible|invisible|hidden|enabled|disabled|editable|checked|selected)$/,
  async function (
    this: ScenarioWorld,
    elementPosition: string,
    selectorName: string,
    attributeValue: string,
    negate: string,
    state: string
  ) {
    let targetSelector = this.selectorMap.getSelector(this.currentPageName, selectorName);
    targetSelector = replaceAttributeTargetSelector(targetSelector, attributeValue);
    const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
    const verifyMethod = async () => {
      await verifyElementState(this.currentPage, targetSelector, state as State, !!negate, elementIndex);
    };
    await waitFor(verifyMethod);
  }
);
