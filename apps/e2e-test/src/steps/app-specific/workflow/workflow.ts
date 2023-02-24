import { getElementText } from '../../../playwright-support/generic/element-read';
import { ScenarioWorld } from '../../../hooks/ScenarioWorld';
import { logger } from '../../../logger';
import { selectSettingDropdown, toogleSimulcast } from '../../../playwright-support/app-specific/element-action';
import { getStreamStats } from '../../../playwright-support/app-specific/element-read';
import { verifyViewScreenSize } from '../../../playwright-support/app-specific/element-verification';
import { clearText, click, enterText } from '../../../playwright-support/generic/element-action';

import { waitFor } from '../../../playwright-support/generic/element-wait';
import { verifyArrayContains, verifyEqualTo } from '../../../playwright-support/generic/verification';
import { TargetSelector } from '../../../utils/selector-mapper';
import { State, Status, Screen } from '../../../utils/types';
import { replaceAttributeTargetSelector } from '../../generic/utils';
import {
  addCamera,
  addLocalFile,
  addScreen,
  getQualityTabName,
  validateState,
  validateStatsInfo,
  validateStatus,
  validateText,
  validateValue,
} from './workflow.utils';
import fs from 'fs';

export const verifyView = async (
  scWorld: ScenarioWorld,
  elementPosition: string,
  viewName: string,
  expectedData: { [key: string]: string }
) => {
  const elementIndex = elementPosition != null ? Number(elementPosition.match(/\d/g)?.join('')) - 1 : undefined;
  const keys = Object.keys(expectedData);
  let keyCount = 0;

  let targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} loading`);
  await validateState(scWorld, targetSelector, 'hidden' as State, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, viewName);
  await validateState(scWorld, targetSelector, 'displayed' as State, elementIndex);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} loading`);
  await validateState(scWorld, targetSelector, 'hidden' as State, elementIndex);

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

  if (keys.includes('audio button')) {
    logger.info(`Verify ${viewName} audio button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} audio button`);
    await validateState(scWorld, targetSelector, expectedData['audio button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('audio button status')) {
    logger.info(`Verify ${viewName} audio button status`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} audio button`);
    await validateStatus(scWorld, targetSelector, expectedData['audio button status'], elementIndex);
    keyCount++;
  }

  if (keys.includes('video button')) {
    logger.info(`Verify ${viewName} video button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} video button`);
    await validateState(scWorld, targetSelector, expectedData['video button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('video button status')) {
    logger.info(`Verify ${viewName} video button status`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} video button`);
    await validateStatus(scWorld, targetSelector, expectedData['video button status'], elementIndex);
    keyCount++;
  }

  if (keys.includes('playback button')) {
    logger.info(`Verify ${viewName} playback button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} playback button`);
    await validateState(scWorld, targetSelector, expectedData['playback button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('playback button status')) {
    logger.info(`Verify ${viewName} playback button status`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} playback button`);
    await validateStatus(scWorld, targetSelector, expectedData['playback button status'], elementIndex);
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

  if (keys.includes('go live button')) {
    logger.info(`Verify ${viewName} go live button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} go live button`);
    await validateState(scWorld, targetSelector, expectedData['go live button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('go live button text')) {
    logger.info(`Verify ${viewName} go live button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} go live button`);
    await validateText(scWorld, targetSelector, expectedData['go live button text'], elementIndex);
    keyCount++;
  }

  if (keys.includes('stop button')) {
    logger.info(`Verify ${viewName} stop button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} stop button`);
    await validateState(scWorld, targetSelector, expectedData['stop button'], elementIndex);
    keyCount++;
  }

  if (keys.includes('stop button text')) {
    logger.info(`Verify ${viewName} stop button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} stop button`);
    await validateText(scWorld, targetSelector, expectedData['stop button text'], elementIndex);
    keyCount++;
  }

  if (keys.includes('close button')) {
    logger.info(`Verify ${viewName} close button`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `${viewName} close button`);
    await validateState(scWorld, targetSelector, expectedData['close button'], elementIndex);
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

  if (keys.includes('invite button text')) {
    logger.info(`Verify invite button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'invite button');
    await validateText(scWorld, targetSelector, expectedData['invite button text']);
    keyCount++;
  }

  const message = 'Some header data parameters are not verified';
  verifyEqualTo(keyCount, keys.length, message);
};

export const verifyFooterData = async (scWorld: ScenarioWorld, expectedData: { [key: string]: string }) => {
  const keys = Object.keys(expectedData);
  let targetSelector: TargetSelector;
  let keyCount = 0;

  if (keys.includes('add source button')) {
    logger.info(`Verify add source button state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'add source button');
    await validateState(scWorld, targetSelector, expectedData['add source button']);
    keyCount++;
  }

  if (keys.includes('add source button text')) {
    logger.info(`Verify add source button text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'add source button');
    await validateText(scWorld, targetSelector, expectedData['add source button text']);
    keyCount++;
  }

  if (keys.includes('app version')) {
    logger.info(`Verify app version state`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'app version');
    await validateState(scWorld, targetSelector, expectedData['app version']);
    keyCount++;
  }

  if (keys.includes('app version text')) {
    logger.info(`Verify app version text`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'app version');
    await validateText(scWorld, targetSelector, expectedData['app version text']);
    keyCount++;
  }

  const message = 'Some footer data parameters are not verified';
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

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `settings popup`);
  await validateState(scWorld, targetSelector, 'displayed' as State);

  if (keys.includes('source name')) {
    logger.info(`Verify ${viewName} source name`);
    if (!expectedData['source name'].startsWith('ignore: ')) {
      targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `source name input`);
      await validateValue(scWorld, targetSelector, expectedData['source name']);
    }
    keyCount++;
  }

  if (keys.includes('resolution')) {
    logger.info(`Verify ${viewName} resolution`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `resolution dropdown default`);
    await validateText(scWorld, targetSelector, expectedData['resolution']);
    keyCount++;
  }

  if (keys.includes('bitrate')) {
    logger.info(`Verify ${viewName} bitrate`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `bitrate dropdown default`);
    await validateText(scWorld, targetSelector, expectedData['bitrate']);
    keyCount++;
  }

  let state = '';
  if (keys.includes('simulcast')) {
    logger.info(`Verify ${viewName} simulcast`);
    const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `simulcast`);
    state = expectedData['simulcast'] === 'On' ? 'checked' : 'unchecked';
    if (expectedData['codec'].includes('vp9')) {
      state = 'hidden' as State;
    }
    await validateState(scWorld, targetSelector, state);
    keyCount++;
  }

  if (keys.includes('codec')) {
    logger.info(`Verify ${viewName} codec`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `codec dropdown default`);
    await validateText(scWorld, targetSelector, expectedData['codec']);
    keyCount++;
  }

  if (keys.includes('quality')) {
    logger.info(`Verify ${viewName} quality`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `quality dropdown default`);
    await validateText(scWorld, targetSelector, expectedData['quality']);
    keyCount++;
  }

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `settings close button`);
  await click(scWorld.currentPage, targetSelector);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `settings popup`);
  await validateState(scWorld, targetSelector, 'hidden' as State);

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

  const qualityTabName = getQualityTabName(qualityTab);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info tab`);
  const tableSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stats info`);
  const streamStats = await getStreamStats(scWorld.currentPage, targetSelector, tableSelector, qualityTabName);

  logger.info(`Actual stream stats: ${JSON.stringify(streamStats, null, 2)}`);
  logger.info(`Expected stream stats: ${JSON.stringify(expectedData, null, 2)}`);

  try {
    let streamStatsKeys = Object.keys(streamStats);
    let message = '';
    if (qualityTabName != 'None' && appName === 'publisher') {
      logger.info(`Verify ${appName} ${viewName} stats with simulcast On`);

      const tabs = ['Auto', 'High', 'Medium', 'Low'];
      const isFound = tabs.some((item) => streamStatsKeys.includes(item));
      message = `Stream Info stats does not have Auto/High/Medium/Low quality tabs\nActual Tabs: ${streamStatsKeys}`;
      verifyEqualTo(isFound, true, message);

      if (qualityTabName !== 'All') {
        streamStatsKeys = [qualityTabName];
      }

      for (const quality of streamStatsKeys) {
        logger.info(`Verify ${viewName} stats with ${quality} quality`);
        message = 'Unknown Stream Info quality';
        validateStatsInfo(streamStats[quality], expectedData);
      }
    } else {
      logger.info(`Verify ${appName} ${viewName} stats`);
      message = 'Stream Info stats have quality tabs';
      verifyArrayContains(streamStatsKeys, 'Auto', message);

      message = 'Stream Info quality has less or more than 1 quality';
      verifyEqualTo(streamStatsKeys.length, 1, message);
      validateStatsInfo(streamStats['Auto'], expectedData);
    }
  } catch (exception) {
    logger.error(`Actual stream stats: ${JSON.stringify(streamStats, null, 2)}`);
    logger.error(`Expected stream stats: ${JSON.stringify(expectedData, null, 2)}`);
    throw exception;
  }

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info close button`);
  await click(scWorld.currentPage, targetSelector);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream info popover`);
  await validateState(scWorld, targetSelector, 'hidden' as State);
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

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `settings popup`);
  await validateState(scWorld, targetSelector, 'displayed' as State);

  if (keys.includes('source name')) {
    logger.info(`Configure ${viewName} source name`);
    if (!expectedData['source name'].startsWith('ignore: ')) {
      targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `source name input`);
      await clearText(scWorld.currentPage, targetSelector);
      await enterText(scWorld.currentPage, targetSelector, expectedData['source name']);
    }
    keyCount++;
  }

  if (keys.includes('resolution')) {
    logger.info(`Configure ${viewName} resolution`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `resolution dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `resolution dropdown options`);
    await selectSettingDropdown(scWorld.currentPage, targetSelector, OptionsSelector, expectedData['resolution']);
    keyCount++;
  }

  if (keys.includes('bitrate')) {
    logger.info(`Configure ${viewName} bitrate`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `bitrate dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `bitrate dropdown options`);
    await selectSettingDropdown(scWorld.currentPage, targetSelector, OptionsSelector, expectedData['bitrate']);
    keyCount++;
  }

  if (keys.includes('simulcast')) {
    logger.info(`Configure ${viewName} simulcast`);
    const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `simulcast`);
    const clickSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `simulcast label`);
    await toogleSimulcast(
      scWorld.currentPage,
      targetSelector,
      clickSelector,
      expectedData['simulcast'] as Status,
      false
    );
    keyCount++;
  }

  if (keys.includes('codec')) {
    logger.info(`Configure ${viewName} codec`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `codec dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `codec dropdown options`);
    await selectSettingDropdown(scWorld.currentPage, targetSelector, OptionsSelector, expectedData['codec']);
    keyCount++;
  }

  if (keys.includes('quality')) {
    logger.info(`Configure ${viewName} quality`);
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `quality dropdown`);
    OptionsSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `quality dropdown options`);
    await selectSettingDropdown(scWorld.currentPage, targetSelector, OptionsSelector, expectedData['quality']);
    keyCount++;
  }

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `settings close button`);
  await click(scWorld.currentPage, targetSelector);

  targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `settings popup`);
  await validateState(scWorld, targetSelector, 'hidden' as State);

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

export const projectAsMainStream = async (scWorld: ScenarioWorld, srcName: string) => {
  let targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'main view source name');
  const mainViewSrcName = await getElementText(scWorld.currentPage, targetSelector);

  if (!mainViewSrcName?.includes(srcName)) {
    targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, `stream list item`);
    targetSelector = replaceAttributeTargetSelector(targetSelector, srcName);
    await click(scWorld.currentPage, targetSelector);
  }
};

export const addFileSource = async (scWorld: ScenarioWorld, srcName: string, filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} does not exists`);
  }

  const targetSelector = scWorld.selectorMap.getSelector(scWorld.currentPageName, 'add source button');
  await click(scWorld.currentPage, targetSelector);

  switch (srcName) {
    case 'local':
      await addLocalFile(scWorld, filePath);
      break;
    case 'remote':
      // await addRemoteFile(scWorld, filePath);
      break;
    default:
      throw Error(`Invalid source name - ${srcName}`);
  }
};
