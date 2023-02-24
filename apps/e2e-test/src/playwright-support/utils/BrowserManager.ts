/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import playwright, { Browser, BrowserContext, BrowserContextOptions, LaunchOptions, Page } from 'playwright';

import { options } from '../../../test.config';
import { defaultExecutionTimeout } from '../../config/defaults';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { logger } from '../../logger';
import { TestOptions } from '../../utils/types';

export class BrowserManager {
  options: TestOptions;

  browser!: Browser;

  constructor() {
    this.options = options;
    this.manageDefaults();
  }

  async launchBrowser(): Promise<Browser> {
    const { browserName } = this.options;
    const browserEngine = this.getBrowserEngine();
    logger.debug(`BrowserManager:: Launch browser ${browserName}`);

    const launchOptions = this.getLaunchOptions();
    this.browser = await playwright[browserEngine].launch(launchOptions);
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    logger.debug('BrowserManager:: Close browser');
    this.browser.close();
  }

  async newContext(scenarioWorld: ScenarioWorld) {
    logger.debug(`BrowserManager:: Create browser context`);
    const contextOptions = this.getContextOptions(scenarioWorld);
    const context = await this.browser.newContext(contextOptions);

    if (this.options.trace !== 'off') {
      logger.trace(`BrowserManager:: Starting the trace`);
      await context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
        title: `${scenarioWorld.scenarioName}`,
      });
    }
    return context;
  }

  static async closeContext(context: BrowserContext): Promise<void> {
    logger.debug(`BrowserManager:: close browser context`);
    await context.close();
  }

  async newPage(context: BrowserContext): Promise<Page> {
    logger.debug(`BrowserManager:: Create page ${this.options.browserName}`);
    return await context.newPage();
  }

  async closePage(page: Page): Promise<void> {
    logger.debug(`BrowserManager:: close page ${this.options.browserName}`);
    await page.close();
  }

  async closePages(context: BrowserContext): Promise<void> {
    for (const page of context.pages()) {
      await this.closePage(page);
    }
  }

  private getBrowserEngine() {
    const { browserName } = this.options;
    return browserName === 'firefox' ? 'firefox' : 'chromium';
  }

  private getLaunchOptions(): LaunchOptions {
    let launchOptions: LaunchOptions;
    const { browserName } = this.options;

    switch (browserName) {
      case 'chromium':
        launchOptions = this.options.launchOptions?.chromium || {};
        break;
      case 'firefox':
        launchOptions = this.options.launchOptions?.firefox || {};
        break;
      case 'edge':
        launchOptions = this.options.launchOptions?.edge || {};
        launchOptions.channel = 'msedge';
        break;
      default:
        launchOptions = this.options.launchOptions?.chrome || {};
        launchOptions.channel = 'chrome';
    }

    launchOptions.headless = 'headless' in launchOptions ? launchOptions.headless : this.options.headless;
    return launchOptions;
  }

  private getContextOptions(scenarioWorld: ScenarioWorld): BrowserContextOptions {
    const contextOptions: BrowserContextOptions = { ...this.options.browserOptions };
    if (!contextOptions?.recordVideo && this.options.video !== 'off') {
      contextOptions.recordVideo = {
        dir: `${this.options.reportPath}/videos/${scenarioWorld.featureNameFormated}/${scenarioWorld.scenarioNameFormated}/`,
        size: { width: 1280, height: 1024 },
      };
    }
    return contextOptions;
  }

  private manageDefaults() {
    logger.debug('BrowserManager:: Set default options');
    this.options.timeout = this.options.timeout || defaultExecutionTimeout;
    this.options.headless = 'headless' in this.options ? this.options.headless : true;
    this.options.video = this.options?.video || 'off';
    this.options.screenshot = this.options?.screenshot || 'off';
    this.options.trace = this.options?.trace || 'off';

    this.options.launchOptions = this.options?.launchOptions || {};

    this.options.browserOptions = this.options?.browserOptions || {};
    if (typeof this.options.viewport !== 'undefined') {
      this.options.browserOptions.viewport = this.options.viewport;
    }
  }

  static monitorConsoleErrorLogs(page: Page) {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().toLowerCase().includes('roboto')) {
        logger.error(`\tConsole Error Log: "${msg.text()}"`);
        consoleLogs.push(msg.text());
      }
    });
    return consoleLogs;
  }

  static monitorConsoleLogs(page: Page) {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(`${msg.type()}:: ${msg.text()}`);
    });
    return consoleLogs;
  }

  static filterErrorLogs(consoleLogs: string[]): string[] {
    const errorLogs: string[] = [];
    const skipErrorListReg = [
      /roboto/,
      /Error: stream not being published/,
      /the server responded with a status of 400/,
      /Failed to load resource: net::ERR_EMPTY_RESPONSE/,
      /^log:: start viewer/,
      /^log:: connecting$/,
      /^log:: register broadcastEvent$/,
    ];

    consoleLogs.forEach((log) => {
      if (skipErrorListReg.findIndex((value) => value.test(log)) !== -1) return;
      if (log.startsWith('error')) errorLogs.push(log);
    });

    return errorLogs;
  }
}
