import { Before, BeforeAll, AfterAll, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from 'playwright';
import { SetupPage } from '../pages/SetupPage'

setDefaultTimeout(60 * 1000);

BeforeAll(async () => {
    console.log('Hooks:: Launch browser')
    global.brower = await chromium.launch({headless: true});
});

AfterAll(async () => {
    console.log('Hooks:: Close browser')
    await global.brower.close()
})

Before(async () => {
    console.log('Hooks:: Open context and page');
    global.context = await global.brower.newContext();
    global.page = await global.context.newPage();
    global.setupPage = new SetupPage(global.page);
})

After(async () => {
    console.log('Hooks:: Close context and page');
    await global.page.close();
    await global.context.close();
})