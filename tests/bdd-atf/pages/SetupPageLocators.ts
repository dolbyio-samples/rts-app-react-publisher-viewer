import { Locator, Page } from 'playwright'

export default class SetupPageLocators{

    private page: Page;
    readonly joinBtn: Locator;
    readonly nameInput: Locator;
    readonly microphoneBtn: Locator;
    readonly CameraBtn: Locator;
    readonly microphoneSelect: Locator;
    readonly cameraSelect: Locator;
  
    constructor(page: Page){
        this.page = page;
        this.joinBtn = page.locator('<selector>')
        this.nameInput = page.locator('<selector>')
        this.microphoneBtn = page.locator('<selector>')
        this.CameraBtn = page.locator('<selector>')
        this.microphoneSelect = page.locator('<selector>')
        this.cameraSelect = page.locator('<selector>')
    }
}

