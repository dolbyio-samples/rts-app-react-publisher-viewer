import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';

import { SelectorMapper } from '../utils/selector-mapper';
import { GlobalVariables, PlaywrightOptions } from '../utils/types';

export class ScenarioWorld extends World {
  currentPage!: any;

  currentPageName!: string;

  options!: PlaywrightOptions;

  featureName!: string;

  scenarioName!: string;

  featureNameFormated!: string;

  scenarioNameFormated!: string;

  startTime!: Date;

  debug?: boolean = false;

  globalVariables: GlobalVariables;

  selectorMap!: SelectorMapper;

  constructor(options: IWorldOptions) {
    super(options);
    this.globalVariables = {};
  }
}

setWorldConstructor(ScenarioWorld);
