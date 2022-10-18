import { Before, BeforeAll, AfterAll, After } from "@cucumber/cucumber";
import { chromium } from 'playwright';

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
})

After(async () => {
    console.log('Hooks:: Close context and page');
    await global.page.close();
    await global.context.close();
})