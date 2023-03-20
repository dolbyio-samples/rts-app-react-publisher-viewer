import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';

import { SelectorMapper } from '#e2e-test/src/utils/selector-mapper';
import { ScenarioData, TestOptions } from '#e2e-test/src/utils/types';

import { GlobalData } from './GlobalData';

export class ScenarioWorld extends World {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentPage!: any;

  currentPageName!: string;

  options!: TestOptions;

  featureName!: string;

  scenarioName!: string;

  featureNameFormated!: string;

  scenarioNameFormated!: string;

  startTime!: Date;

  debug?: boolean = false;

  localData: ScenarioData;

  globalData!: GlobalData;

  selectorMap!: SelectorMapper;

  constructor(options: IWorldOptions) {
    super(options);
    this.localData = new Map();
  }
}

setWorldConstructor(ScenarioWorld);
