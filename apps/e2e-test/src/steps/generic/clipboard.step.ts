/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';
import { readClipboardText } from '../../playwright-support/generic/clipboard-actions';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { verifyText, verifyTextMatch } from '../../playwright-support/generic/element-verification';
import { replacePlaceholder } from './utils';
import { getData, saveData } from '../../hooks/utils';

Then(
  /^store the copied clipboard text in "([^"]*)" variable$/,
  async function (this: ScenarioWorld, variableName: string) {
    saveData(this, variableName, readClipboardText());
  }
);

Then(
  /^the copied clipboard text should( not)? contain "([^"]*)"$/,
  async function (this: ScenarioWorld, negate: string, expRegex: string) {
    const clipboardText = readClipboardText();
    const expPattern = replacePlaceholder(expRegex, this);
    await verifyTextMatch(clipboardText, expPattern, !!negate);
  }
);

Then(
  /^the copied clipboard text should( not)? be equal to the stored "([^"]*)" variable$/,
  async function (this: ScenarioWorld, negate: string, variableName: string) {
    const clipboardText = readClipboardText();
    const expText = getData(this, variableName);
    await verifyText(clipboardText, expText, !!negate);
  }
);
