import { ScenarioWorld } from '../../../hooks/ScenarioWorld';
import { logger } from '../../../logger';
import { selectSettingDropdown, toogleSimulcast } from '../../../playwright-support/app-specific/element-action';
import { getStreamStats } from '../../../playwright-support/app-specific/element-read';
import { verifyViewScreenSize } from '../../../playwright-support/app-specific/element-verification';
import { clearText, click, enterText } from '../../../playwright-support/generic/element-action';

import { waitFor } from '../../../playwright-support/generic/element-wait';
import { verifyArrayContains, verifyEqualTo, verifyLessThan } from '../../../playwright-support/generic/verification';
import { TargetSelector } from '../../../utils/selector-mapper';
import { State, Status, Screen } from '../../../utils/types';
import {
  addCamera,
  addLocalFile,
  addRemoteFile,
  addScreen,
  getQualityTabName,
  validateState,
  validateStatsInfo,
  validateStatus,
  validateText,
  validateValue,
} from './workflow.utils';

export const verifyView = async (
  scWorld: ScenarioWorld,
  elementPosition: string,
  viewName: string,
  expectedData: { [key: string]: string }
) => {
  const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
  const keys = Object.keys(expectedData);
  let keyCount = 0;

  let targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, viewName);
  await validateState(scWorld, targetSelector, 'displayed' as State, elementIndex);

  if (keys.includes('size')) {
    logger.info(`Verify ${viewName} size`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, viewName);
    await waitFor(async () => {
      await verifyViewScreenSize(scWorld.currentPage, targetSelector, expectedData.size as Screen, false, elementIndex);
    });
    keyCount++;
  }

  if (keys.includes('source name')) {
    logger.info(`Verify ${viewName} source name state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} source name`);
    await validateState(scWorld, targetSelector, expectedData['source name'], elementIndex);
    keyCount++;
  }

  if (keys.includes('source name text')) {
    logger.info(`Verify ${viewName} source name text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} source name`);
    await validateText(scWorld, targetSelector, expectedData['source name text'], elementIndex);
    keyCount++;
  }

  if (keys.includes('microphone button')) {
    logger.info(`Verify ${viewName} microphone button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} microphone button`);
    await validateState(scWorld, targetSelector, expectedData['microphone button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('microphone button status')) {
    logger.info(`Verify ${viewName} microphone button status`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} microphone button`);
    await validateStatus(scWorld, targetSelector, expectedData['microphone button status'] as Status, elementIndex);
    keyCount++;
  }

  if (keys.includes('camera button')) {
    logger.info(`Verify ${viewName} camera button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} camera button`);
    await validateState(scWorld, targetSelector, expectedData['camera button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('camera button status')) {
    logger.info(`Verify ${viewName} camera button status`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} camera button`);
    await validateStatus(scWorld, targetSelector, expectedData['camera button status'] as Status, elementIndex);
    keyCount++;
  }

  if (keys.includes('setting button')) {
    logger.info(`Verify ${viewName} setting button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} setting button`);
    await validateState(scWorld, targetSelector, expectedData['setting button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('stream info button')) {
    logger.info(`Verify ${viewName} stream info button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} stream info button`);
    await validateState(scWorld, targetSelector, expectedData['stream info button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('full screen button')) {
    logger.info(`Verify ${viewName} full screen button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} full screen button`);
    await validateState(scWorld, targetSelector, expectedData['full screen button'], elementIndex);
    keyCount++;
  }

  const message = 'Some stream view parameters are not verified';
  verifyEqualTo(keyCount, keys.length, message);
};

export const verifyHeaderData = async (scWorld: ScenarioWorld, expectedData: { [key: string]: string }) => {
  const keys = Object.keys(expectedData);
  let targetSelector: TargetSelector;
  let keyCount = 0;

  if (keys.includes('company name')) {
    logger.info(`Verify company name state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'company name');
    await validateState(scWorld, targetSelector, expectedData['company name']);
    keyCount++;
  }

  if (keys.includes('company name text')) {
    logger.info(`Verify company name text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'company name');
    await validateText(scWorld, targetSelector, expectedData['company name text']);
    keyCount++;
  }

  if (keys.includes('timer')) {
    logger.info(`Verify timer state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'timer');
    await validateState(scWorld, targetSelector, expectedData['timer']);
    keyCount++;
  }

  if (keys.includes('timer text')) {
    logger.info(`Verify timer text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'timer');
    await validateText(scWorld, targetSelector, expectedData['timer text']);
    keyCount++;
  }

  if (keys.includes('page header')) {
    logger.info(`Verify page header state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'page header');
    await validateState(scWorld, targetSelector, expectedData['page header']);
    keyCount++;
  }

  if (keys.includes('page header text')) {
    logger.info(`Verify header text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'page header');
    await validateText(scWorld, targetSelector, expectedData['page header text']);
    keyCount++;
  }

  if (keys.includes('page description')) {
    logger.info(`Verify page description state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'page description');
    await validateState(scWorld, targetSelector, expectedData['page description']);
    keyCount++;
  }

  if (keys.includes('page description text')) {
    logger.info(`Verify page description text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'page description');
    await validateText(scWorld, targetSelector, expectedData['page description text']);
    keyCount++;
  }

  if (keys.includes('streaming status dot')) {
    logger.info(`Verify streaming status dot state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'streaming status dot');
    await validateState(scWorld, targetSelector, expectedData['streaming status dot']);
    keyCount++;
  }

  if (keys.includes('viewers count')) {
    logger.info(`Verify viewers count state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'viewers count');
    await validateState(scWorld, targetSelector, expectedData['viewers count']);
    keyCount++;
  }

  if (keys.includes('viewers count text')) {
    logger.info(`Verify viewers count text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'viewers count');
    await validateText(scWorld, targetSelector, expectedData['viewers count text']);
    keyCount++;
  }

  if (keys.includes('multi source label')) {
    logger.info(`Verify multi source label state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'multi source label');
    await validateState(scWorld, targetSelector, expectedData['multi source label']);
    keyCount++;
  }

  if (keys.includes('multi source label text')) {
    logger.info(`Verify multi source label text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'multi source label');
    await validateText(scWorld, targetSelector, expectedData['multi source label text']);
    keyCount++;
  }

  if (keys.includes('go live button')) {
    logger.info(`Verify go live button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'go live button');
    await validateState(scWorld, targetSelector, expectedData['go live button']);
    keyCount++;
  }

  if (keys.includes('go live button text')) {
    logger.info(`Verify go live button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'go live button');
    await validateText(scWorld, targetSelector, expectedData['go live button text']);
    keyCount++;
  }

  if (keys.includes('stop button')) {
    logger.info(`Verify stop button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'stop button');
    await validateState(scWorld, targetSelector, expectedData['stop button']);
    keyCount++;
  }

  if (keys.includes('stop button text')) {
    logger.info(`Verify stop button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'stop button');
    await validateText(scWorld, targetSelector, expectedData['stop button text']);
    keyCount++;
  }

  if (keys.includes('invite button')) {
    logger.info(`Verify invite button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'invite button');
    await validateState(scWorld, targetSelector, expectedData['invite button']);
    keyCount++;
  }

  if (keys.includes('stop button text')) {
    logger.info(`Verify invite button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'invite button');
    await validateText(scWorld, targetSelector, expectedData['invite button text']);
    keyCount++;
  }

  const message = 'Some header data parameters are not verified';
  verifyEqualTo(keyCount, keys.length, message);
};

export const verifySettings = async (
  scWorld: ScenarioWorld,
  elementPosition: string,
  viewName: string,
  expectedData: { [key: string]: string }
) => {
  const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
  const keys = Object.keys(expectedData);
  let targetSelector: TargetSelector;
  let keyCount = 0;

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} setting button`);
  await click(scWorld.currentPage, targetSelector, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} settings`);
  await validateState(scWorld, targetSelector, 'displayed' as State, elementIndex);

  if (keys.includes('source name')) {
    logger.info(`Verify ${viewName} source name`);
    if (!expectedData['source name'].startsWith('ignore: ')) {
      targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} source name input`);
      await validateValue(scWorld, targetSelector, expectedData['source name'], elementIndex);
    }
    keyCount++;
  }

  if (keys.includes('resolution')) {
    logger.info(`Verify ${viewName} resolution`);
    targetSelector = scWorld.selectorMap.getSelector(
      scWorld.currentPageName,
      `${viewName} resolution dropdown default`
    );
    await validateText(scWorld, targetSelector, expectedData['resolution'], elementIndex);
    keyCount++;
  }

  if (keys.includes('bitrate')) {
    logger.info(`Verify ${viewName} bitrate`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} bitrate dropdown default`);
    await validateText(scWorld, targetSelector, expectedData['bitrate'], elementIndex);
    keyCount++;
  }

  if (keys.includes('simulcast')) {
    logger.info(`Verify ${viewName} simulcast`);
    const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} simulcast`);
    const state = expectedData['simulcast'] === 'On' ? 'checked' : 'unchecked';
    await validateState(scWorld, targetSelector, state, elementIndex);
    keyCount++;
  }

  if (keys.includes('codec')) {
    logger.info(`Verify ${viewName} codec`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} codec dropdown default`);
    await validateText(scWorld, targetSelector, expectedData['codec'], elementIndex);
    keyCount++;
  }

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} settings close button`);
  await click(scWorld.currentPage, targetSelector, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} settings`);
  await validateState(scWorld, targetSelector, 'hidden' as State, elementIndex);

  const message = 'Some settings parameters are not verified';
  verifyEqualTo(keyCount, keys.length, message);
};

export const verifyStats = async (
  scWorld: ScenarioWorld,
  elementPosition: string,
  appName: string,
  viewName: string,
  qualityTab: string,
  expectedData: { [key: string]: string }
) => {
  const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
  let targetSelector: TargetSelector;

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} stream info button`);
  await click(scWorld.currentPage, targetSelector, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info popover`);
  await validateState(scWorld, targetSelector, 'displayed' as State);
  // await delay(3000);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info tab`);
  const tableSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stats info`);
  const streamStats = await getStreamStats(scWorld.currentPage, targetSelector, tableSelector);

  logger.info(`Actual stream stats: ${JSON.stringify(streamStats, null, 2)}`);
  logger.info(`Expected stream stats: ${JSON.stringify(expectedData, null, 2)}`);

  const qualityTabName = getQualityTabName(qualityTab);

  try {
    let streamStatsKeys = Object.keys(streamStats);
    let message;
    if (qualityTabName != 'none' && appName === 'publisher') {
      logger.info(`Verify ${appName} ${viewName} stats with simulcast On`);
      message = 'Stream Info stats does not have High/Low quality tabs';
      verifyArrayContains(streamStatsKeys, ['High', 'Low'], message);

      message = 'Stream Info stats have more than 3 quality tabs';
      verifyLessThan(streamStatsKeys.length, 4, message);

      if (qualityTabName !== 'all') {
        streamStatsKeys = [qualityTabName];
      }

      for (const quality of streamStatsKeys) {
        logger.info(`Verify ${viewName} stats with ${quality} quality`);
        message = 'Unknown Stream Info quality';
        verifyArrayContains(['High', 'Medium', 'Low'], quality, message);
        validateStatsInfo(streamStats[quality], expectedData);
      }
    } else {
      logger.info(`Verify ${appName} ${viewName} stats`);
      message = 'Stream Info stats have quality tabs';
      verifyArrayContains(streamStatsKeys, 'Standard', message);

      message = 'Stream Info quality has less or more than 1 quality';
      verifyEqualTo(streamStatsKeys.length, 1, message);
      validateStatsInfo(streamStats['Standard'], expectedData);
    }
  } catch (exception) {
    logger.error(`Actual stream stats: ${JSON.stringify(streamStats, null, 2)}`);
    logger.error(`Expected stream stats: ${JSON.stringify(expectedData, null, 2)}`);
    throw exception;
  }

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info close button`);
  await click(scWorld.currentPage, targetSelector, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info popover`);
  await validateState(scWorld, targetSelector, 'hidden' as State, elementIndex);
};

export const configureSettings = async (
  scWorld: ScenarioWorld,
  elementPosition: string,
  viewName: string,
  expectedData: { [key: string]: string }
) => {
  const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
  const keys = Object.keys(expectedData);
  let targetSelector: TargetSelector;
  let OptionsSelector: TargetSelector;
  let keyCount = 0;

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} setting button`);
  await click(scWorld.currentPage, targetSelector, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} settings`);
  await validateState(scWorld, targetSelector, 'displayed' as State, elementIndex);

  if (keys.includes('source name')) {
    logger.info(`Configure ${viewName} source name`);
    if (!expectedData['source name'].startsWith('ignore: ')) {
      targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} source name input`);
      await clearText(scWorld.currentPage, targetSelector, elementIndex);
      await enterText(scWorld.currentPage, targetSelector, expectedData['source name'], elementIndex);
    }
    keyCount++;
  }

  if (keys.includes('resolution')) {
    logger.info(`Configure ${viewName} resolution`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} resolution dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(
      scWorld.currentPageName,
      `${viewName} resolution dropdown options`
    );
    await selectSettingDropdown(
      scWorld.currentPage,
      targetSelector,
      OptionsSelector,
      expectedData['resolution'],
      elementIndex
    );
    keyCount++;
  }

  if (keys.includes('bitrate')) {
    logger.info(`Configure ${viewName} bitrate`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} bitrate dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} bitrate dropdown options`);
    await selectSettingDropdown(
      scWorld.currentPage,
      targetSelector,
      OptionsSelector,
      expectedData['bitrate'],
      elementIndex
    );
    keyCount++;
  }

  if (keys.includes('simulcast')) {
    logger.info(`Configure ${viewName} simulcast`);
    const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} simulcast`);
    const clickSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} simulcast label`);
    await toogleSimulcast(
      scWorld.currentPage,
      targetSelector,
      clickSelector,
      expectedData['simulcast'] as Status,
      false,
      elementIndex
    );
    keyCount++;
  }

  if (keys.includes('codec')) {
    logger.info(`Configure ${viewName} codec`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} codec dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} codec dropdown options`);
    await selectSettingDropdown(
      scWorld.currentPage,
      targetSelector,
      OptionsSelector,
      expectedData['codec'],
      elementIndex
    );
    keyCount++;
  }

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} settings close button`);
  await click(scWorld.currentPage, targetSelector, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} settings`);
  await validateState(scWorld, targetSelector, 'hidden' as State, elementIndex);

  const message = 'Setting is not configured as expected';
  verifyEqualTo(keyCount, keys.length, message);
};

export const addSource = async (scWorld: ScenarioWorld, srcName: string) => {
  const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'add source button');
  await click(scWorld.currentPage, targetSelector);

  switch (srcName) {
    case 'camera':
      await addCamera(scWorld);
      break;
    case 'screen':
      await addScreen(scWorld);
      break;
    default:
      throw Error(`Invalid source name - ${srcName}`);
  }
};

export const addFileSource = async (scWorld: ScenarioWorld, srcName: string, filePath: string) => {
  const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'add source button');
  await click(scWorld.currentPage, targetSelector);

  switch (srcName) {
    case 'local':
      await addLocalFile(scWorld, filePath);
      break;
    case 'remote':
      await addRemoteFile(scWorld, filePath);
      break;
    default:
      throw Error(`Invalid source name - ${srcName}`);
  }
};
