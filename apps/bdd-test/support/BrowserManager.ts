// import cloneDeep from 'lodash.clonedeep';
import playwright, { Browser, Page } from 'playwright';

import { defaultTimeout } from '../config/defaults';
import { options } from '../playwright.config';
import { PlaywrightOptions } from '../utils/type';

import { ScenarioWorld } from './ScenarioWorld';

export class BrowserManager {
  options: PlaywrightOptions;

  browser!: Browser;

  constructor() {
    this.options = options;
    this.manageDefaults();
  }

  async launch(): Promise<Browser> {
    const { browserName } = this.options;
    const browserEngine = this.getBrowserEngine();
    console.log(`\tBrowserManager:: Launch browser ${browserName}`);

    const launchOptions = this.getLaunchOptions();
    this.browser = await playwright[browserEngine].launch(launchOptions);
    return this.browser;
  }

  async newContext(scenarioWorld: ScenarioWorld) {
    console.log(`\tBrowserManager:: Create browser context`);
    const contextOptions = this.getContextOptions(scenarioWorld);
    const context = await this.browser.newContext(contextOptions);

    if (this.options.trace !== 'off') {
      console.log(`\tBrowserManager:: Starting the trace`);
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
    console.log(`\tBrowserManager:: Create page ${this.options.browserName}`);
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

    launchOptions.headless = 'headless' in launchOptions ? launchOptions.headless : this.options.headless;
    return launchOptions;
  }

  private getContextOptions(scenarioWorld: ScenarioWorld) {
    // const contextOptions = cloneDeep(this.options.contextOptions);
    const contextOptions = { ...this.options.contextOptions };
    if (!contextOptions?.recordVideo && this.options.video !== 'off') {
      contextOptions.recordVideo = {
        dir: `${this.options.reportPath}/videos/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}/`,
        size: { width: 1280, height: 1024 },
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

  static monitorConsoleErrorLogs(page: Page) {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().toLowerCase().includes('roboto')) {
        console.log(`\tConsole Error Log: "${msg.text()}"`);
        consoleLogs.push(msg.text());
      }
    });
    return consoleLogs;
  }

  static monitorConsoleLogs(page: Page) {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });
    return consoleLogs;
  }
}
