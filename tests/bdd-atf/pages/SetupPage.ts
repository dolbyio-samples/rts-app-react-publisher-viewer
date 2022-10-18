import { Locator, Page } from 'playwright'
import SetupPageLocators from './SetupPageLocators';

type setup = {
    publisherName: string;
    microphoneOn?: boolean;
    cameraOn?: boolean;
    microphoneName?: string;
    cameraName?: string;
}

export class SetupPage{

    readonly page: Page;
    readonly locators: SetupPageLocators;

    constructor(page: Page){
        this.page = page;
       this.locators = new SetupPageLocators(page);
    }

    async open(url: string){
        console.log(`SetupPage: Open publisher application - ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState();
    }

    async configureMicrophone(state: boolean){
        console.log(`SetupPage: Configure microphone - ${state}`);
        (state) ? this.turnOnMicrophone() : this.turnOffMicrophone();
    }

    async turnOnMicrophone(){
        console.log(`SetupPage: Turn on microphone`);
    }

    async turnOffMicrophone(){
        console.log(`SetupPage: Turn off microphone`);
    }

    async configureCamera(state: boolean){
        console.log(`SetupPage: Configure camera - ${state}`);
        (state) ? this.turnOnCamera() : this.turnOffCamera();
    }

    async turnOnCamera(){
        console.log(`SetupPage: Turn on camera`);
    }

    async turnOffCamera(){
        console.log(`SetupPage: Turn off camera`);
    }

    async enterPublisherName(name: string){
        console.log(`SetupPage: Enter publisher name '${name}'`);
    }

    async selectMicrophone(name: string){
        console.log(`SetupPage: Select microphone '${name}'`);
    }

    async selectCamera(name: string){
        console.log(`SetupPage: Select camera '${name}'`);
    }

    async openDeviceSelectionPopup(){
        console.log(`SetupPage: Open device selection popup`);
    }

    async configureSetup(options: setup){
        console.log(`SetupPage: Configure setup ${options}`);
        this.enterPublisherName(options.publisherName);
        if (options?.microphoneOn) this.configureMicrophone(options.microphoneOn);
        if (options?.cameraOn) this.configureCamera(options.cameraOn);
        if (options?.microphoneName) this.selectMicrophone(options.microphoneName);
        if (options?.cameraName) this.selectCamera(options.cameraName);
    }

    async join(options?: setup ){
        console.log(`SetupPage: Join as publisher`);
        if (options) this.configureSetup(options);

        console.log(`SetupPage: Click on Join button`);
    }

    async verifyMicrophoneButtonState(state = true) {
        console.log(`SetupPage:: Verify microphone button state as ${state}`);
    }
    
    async verifyCameraButtonState(state = true) {
        console.log(`SetupPage:: Verify camera button state as ${state}`);
    }

    async verifySelectedMicrophone(name: string) {
        console.log(`SetupPage:: Verify selected microphone ${name}`);
    }
    
    async verifySelectedCamera(name: string) {
        console.log(`SetupPage:: Verify selected camera ${name}`);
    }
}

//module.exports = {SetupPage}
//export default {SetupPage}