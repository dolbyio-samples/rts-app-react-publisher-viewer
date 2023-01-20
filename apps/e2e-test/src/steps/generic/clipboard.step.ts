/* eslint-disable func-names */
import { Then } from '@cucumber/cucumber';
import { readClipboardText } from '../../playwright-support/generic/clipboard-actions';

import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { replacePlaceholder } from './utils';
import { getData, saveData } from '../../hooks/utils';
import { verifyEqualTo, verifyMatch } from '../../playwright-support/generic/verification';

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
    const options = { negate: !!negate, message: 'Clipboard text verification failed' };
    await verifyMatch(clipboardText, expPattern, options);
  }
);

Then(
  /^the copied clipboard text should( not)? be equal to the stored "([^"]*)" variable$/,
  async function (this: ScenarioWorld, negate: string, variableName: string) {
    const clipboardText = readClipboardText();
    const expText = getData(this, variableName);
    const options = { negate: !!negate, message: 'Clipboard text verification failed' };
    await verifyEqualTo(clipboardText, expText, options);
  }
);
