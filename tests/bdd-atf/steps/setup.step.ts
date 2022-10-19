import { Given, When, Then } from '@cucumber/cucumber';

Given('a publisher is on the setup page', async () => {
    console.log('SETUP-STEP:: Publisher is on the setup page')
    await global.setupPage.open('https://dolby.io/')
});

When('the publisher turns off the microphone', async () => {
    console.log('SETUP-STEP:: Publisher turns off the microphone')
});

Then('the microphone should be turned off', async () => {
    console.log('SETUP-STEP:: Publisher microphone should be turned off')
});

When('the publisher turns off the camera', async () => {
    console.log('SETUP-STEP:: Publisher turns off the camera')
});

Then('the camera should be turned off', async () => {
    console.log('SETUP-STEP:: Publisher camera should be turned off')
});