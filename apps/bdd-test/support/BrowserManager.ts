import cloneDeep from 'lodash.clonedeep';
import playwright, { Browser } from 'playwright';

import { defaultTimeout } from '../config/defaults';
import { options } from '../playwright.config';
import { PlaywrightOptions } from '../utils/type';

import { ScenarioWorld } from './ScenarioWorld';

export class BrowserManager {
  private options: PlaywrightOptions;

  browser!: Browser;

  constructor() {
    this.options = options;
    this.manageDefaults();
  }

  async launch(): Promise<Browser> {
    const { browserName } = this.options;
    const browserEngine = this.getBrowserEngine();
    console.log(`BrowserManager:: Launch browser ${browserName}`);

    const launchOptions = this.getLaunchOptions();
    this.browser = await playwright[browserEngine].launch(launchOptions);
    return this.browser;
  }

  async newContext(scenarioWorld: ScenarioWorld) {
    console.log(`BrowserManager:: Create browser context`);
    const contextOptions = this.getContextOptions(scenarioWorld);
    const context = await this.browser.newContext(contextOptions);

    if (this.options.trace !== 'off') {
      console.log(`BrowserManager:: Starting the trace`);
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
        title: `${scenarioWorld.scenarioName}`,
      });
    }
    return context;
  }

  async newPage() {
    console.log(`BrowserManager:: Create page ${this.options.browserName}`);
  }

  private getBrowserEngine() {
    const { browserName } = this.options;
    return browserName === 'firefox' ? 'firefox' : 'chromium';
  }

  private getLaunchOptions() {
    let launchOptions;
    const { browserName } = this.options;

    switch (browserName) {
      case 'chromium':
        launchOptions = this.options.launchOptions?.chromium || {};
        break;
      case 'firefox':
        launchOptions = this.options.launchOptions?.firefox || {};
        break;
      default:
        launchOptions = this.options.launchOptions?.chrome || {};
        launchOptions.channel = launchOptions?.channel || 'chrome';
    }

    launchOptions.headless =
      'headless' in launchOptions ? launchOptions.headless : this.options.headless;
    return launchOptions;
  }

  private getContextOptions(scenarioWorld: ScenarioWorld) {
    const contextOptions = cloneDeep(this.options.contextOptions);
    if (!contextOptions?.recordVideo && this.options.video !== 'off') {
      contextOptions.recordVideo = {
        dir: `./reports/videos/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}/`,
        size: { width: 1280, height: 720 },
      };
    }
    return contextOptions;
  }

  private manageDefaults() {
    console.log('BrowserManager:: Set default options');
    this.options.timeout = this.options.timeout || defaultTimeout;
    this.options.headless = 'headless' in this.options ? this.options.headless : true;
    this.options.video = this.options?.video || 'off';
    this.options.screenshot = this.options?.screenshot || 'off';
    this.options.trace = this.options?.trace || 'off';

    this.options.launchOptions = this.options?.launchOptions || {};

    this.options.contextOptions = this.options?.contextOptions || {};
    if (typeof this.options.viewport !== 'undefined') {
      this.options.contextOptions.viewport = this.options.viewport;
    }
  }
}
