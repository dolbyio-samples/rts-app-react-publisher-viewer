/* eslint-disable no-return-await */
import { Page } from 'playwright';

import { logger } from '../../logger';
import { TargetSelector } from '../../utils/selector-mapper';
import { State } from '../../utils/types';

import { getLocator } from './element-helper';

export const getElementState = async (
  page: Page,
  selector: TargetSelector,
  state: State,
  index?: number
): Promise<boolean> => {
  logger.trace(`Get element state ${state}`);

  const locator = await getLocator(page, selector, index);

  switch (state) {
    case 'displayed':
    case 'visible':
      return await locator.isVisible();
    case 'invisible':
    case 'hidden':
      return await locator.isHidden();
    case 'enabled':
      return await locator.isEnabled();
    case 'disabled':
      return await locator.isDisabled();
    case 'editable':
      return await locator.isEditable();
    case 'checked':
      return await locator.isChecked();
    default:
      throw Error(`Invalid Element State ${state}`);
  }
};

export const getElementText = async (page: Page, selector: TargetSelector, index?: number) => {
  logger.trace(`Get element text`);
  const locator = await getLocator(page, selector, index);
  return await locator.textContent();
};

export const getElementValue = async (page: Page, selector: TargetSelector, index?: number) => {
  logger.trace(`Get element text`);
  const locator = await getLocator(page, selector, index);
  return await locator.inputValue();
};

export const getElementCount = async (page: Page, selector: TargetSelector, index?: number) => {
  logger.trace(`Get element count`);
  const locator = await getLocator(page, selector, index);
  return await locator.count();
};

export const getTableData = async (page: Page, selector: TargetSelector, index?: number): Promise<string[][]> => {
  logger.trace(`Get table data`);
  const locator = await getLocator(page, selector, index);

  const tableRows = locator.locator('//tr');
  const tableRowsCount = await tableRows.count();
  const tableData: string[][] = [];

  for (let i = 0; i < tableRowsCount; i++) {
    const tableColumns = tableRows.nth(i).locator('//*');
    const tableColumnsCount = await tableColumns.count();
    const tableRowData: string[] = [];

    for (let j = 0; j < tableColumnsCount; j++) {
      tableRowData.push((await tableColumns.nth(j).textContent()) as string);
    }
    tableData.push(tableRowData);
  }

  return tableData;
};
