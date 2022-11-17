/* eslint-disable no-unused-expressions */
import { expect } from '@playwright/test';
import { Locator, Page } from 'playwright';

import { State, Status, Screen } from '../utils/type';

import CommonLocators from './CommonLocators';

export default class CommonPage {
  readonly page: Page;

  readonly clocators: CommonLocators;

  constructor(page: Page) {
    this.page = page;
    this.clocators = new CommonLocators(page);
  }

  async getMicrophoneStatus() {
    console.log(`\tCommon: Get microphone status`);
    const toggled = await this.isButtonToggled(this.clocators.microphoneBtn, 'data-active');
    return toggled ? 'Off' : 'On';
  }

  async getCameraStatus() {
    console.log(`\tCommon: Get camera status`);
    const toggled = await this.isButtonToggled(this.clocators.cameraBtn, 'data-active');
    return toggled ? 'Off' : 'On';
  }

  async getScreenSharingStatus() {
    console.log(`\tCommon: Get screen sharing status`);
    const toggled = await this.isButtonToggled(this.clocators.shareBtn, 'data-active');
    return toggled ? 'On' : 'Off';
  }

  async getStreamInformation() {
    console.log(`\tCommon: Get stream information`);
    await this.clocators.streamInformationStats.innerText();
    // TODO: Add test-id for the stream info title, key, value, No Statistics
    // Get the stream information
  }

  async copyInviteLink() {
    console.log(`\tCommon: Copy invite link`);
    await this.clocators.inviteLink.click();
  }

  async toggleMicrophone(status: Status) {
    status === 'On' ? await this.turnOnMicrophone() : await this.turnOffMicrophone();
  }

  async turnOffMicrophone() {
    console.log(`\tCommon: Turn Off microphone`);
    if ((await this.getMicrophoneStatus()) === 'On') {
      await this.clocators.microphoneBtn.click();
    }
  }

  async turnOnMicrophone() {
    console.log(`\tCommon: Turn On microphone`);
    if ((await this.getMicrophoneStatus()) === 'Off') {
      await this.clocators.microphoneBtn.click();
    }
  }

  async toggleCamera(status: Status) {
    status === 'On' ? await this.turnOnCamera() : await this.turnOffCamera();
  }

  async turnOnCamera() {
    console.log(`\tCommon: Turn on camera`);
    if ((await this.getCameraStatus()) === 'Off') {
      await this.clocators.cameraBtn.click();
    }
  }

  async turnOffCamera() {
    console.log(`\tCommon: Turn off camera`);
    if ((await this.getCameraStatus()) === 'On') {
      await this.clocators.cameraBtn.click();
    }
  }

  async startScreenShare() {
    console.log(`\tCommon: Start screen share`);
    if ((await this.getScreenSharingStatus()) === 'Off') {
      this.clocators.shareBtn.click();
    }
  }

  async stopScreenShare() {
    console.log(`\tCommon: Stop screen share`);
    if ((await this.getScreenSharingStatus()) === 'On') {
      this.clocators.shareBtn.click();
    }
  }

  async openSettings() {
    console.log(`\tCommon: Open settings`);
    // TODO: Check if the setting drawer is opened or not
    await this.clocators.settingsBtn.click();
  }

  async openStreamInformationStats() {
    console.log(`\tCommon: Open stream information stats`);
    // TODO: StreamInformationStats already opened
    await this.clocators.streamInfoBtn.click();
  }

  async closeStreamInformationStats() {
    console.log(`\tCommon: Close stream information stats`);
    // TODO: StreamInformationStats already opened
    await this.clocators.streamInfoBtn.click();
  }

  async toggleFullScreenMainStreamView(screen: Screen) {
    if (screen === 'full') {
      await this.mainStreamViewFullScreen();
    } else {
      await this.mainStreamViewNormalScreen();
    }
  }

  async mainStreamViewFullScreen() {
    console.log(`\tCommon: Main stream view to full screen`);
    const fullScreen = await this.isFullScreen(this.clocators.mainStreamView);
    if (!fullScreen) {
      await this.clocators.fullScreenBtn.click();
    }
  }

  async mainStreamViewNormalScreen() {
    console.log(`\tCommon: Main stream view to normal screen`);
    const fullScreen = await this.isFullScreen(this.clocators.mainStreamView);
    if (fullScreen) {
      await this.clocators.fullScreenBtn.click();
    }
  }

  // TODO:
  // Full Screen : Do we support presenter center stream and main stream view full screen
  // If yes we need to add methods for make full screen and normal for presenter center and main stream
  // If yes we need to add methods for verify full screen and normal for presenter center and main stream

  async verifyCompanyName(text: string) {
    console.log(`\tCommon:: Verify company name to be ${text}`);
    await expect(this.clocators.companyNameLbl).toHaveText(text);
  }

  async verifyTimer(text: string) {
    console.log(`\tCommon:: Verify timer to be ${text}`);
    await expect(this.clocators.timerLbl).toHaveText(text);
  }

  async verifyTimerIsGreaterThan(value: number) {
    console.log(`\tCommon:: Verify timer to be in between ${value - 2} and ${value + 5} `);
    const duration = await this.clocators.timerLbl.innerText();
    await expect(this.convertDurationtoSeconds(duration)).toBeGreaterThanOrEqual(value - 2);
    await expect(this.convertDurationtoSeconds(duration)).toBeLessThanOrEqual(value + 5);
  }

  async verifyStreamingLblState(state: State) {
    console.log(`\tCommon:: Verify streaming label is ${state}`);
    await this.verifyComponentState(this.clocators.streamingStatusLbl, state);
  }

  async verifyCompanyNameLblState(state: State) {
    console.log(`\tCommon:: Verify company name label is ${state}`);
    await this.verifyComponentState(this.clocators.companyNameLbl, state);
  }

  async verifyStreamingTimeLblState(state: State) {
    console.log(`\tCommon:: Verify streaming time label is ${state}`);
    await this.verifyComponentState(this.clocators.timerLbl, state);
  }

  async verifyMicrophoneBtnState(state: State) {
    console.log(`\tCommon:: Verify microphone button is ${state}`);
    await this.verifyComponentState(this.clocators.microphoneBtn, state);
  }

  async verifyCameraBtnState(state: State) {
    console.log(`\tCommon:: Verify camera button is  ${state}`);
    await this.verifyComponentState(this.clocators.cameraBtn, state);
  }

  async verifyShareBtnState(state: State) {
    console.log(`\tCommon:: Verify share button is  ${state}`);
    await this.verifyComponentState(this.clocators.shareBtn, state);
  }

  async verifySettingBtnState(state: State) {
    console.log(`\tCommon:: Verify more button is  ${state}`);
    await this.verifyComponentState(this.clocators.settingsBtn, state);
  }

  async verifyInviteBtnState(state: State) {
    console.log(`\tCommon:: Verify invite button is  ${state}`);
    await this.verifyComponentState(this.clocators.inviteLink, state);
  }

  async verifyFullScreenBtnState(state: State) {
    console.log(`\tCommon:: Verify full screen button is  ${state}`);
    await this.verifyComponentState(this.clocators.fullScreenBtn, state);
  }

  async verifyMainStreamViewState(state: State) {
    console.log(`\tCommon:: Verify main view state as ${state}`);
    await this.verifyComponentState(this.clocators.mainStreamView, state);
  }

  async verifyGalleryViewState(state: State) {
    console.log(`\tCommon:: Verify gallery view state as ${state}`);
    await this.verifyComponentState(this.clocators.galleryView, state);
  }

  async verifyStreamingStatus(text: string) {
    console.log(`\tCommon:: Verify streaming status to be ${text}`);
    await expect(this.clocators.streamingStatusLbl).toHaveText(text);
  }

  async verifyMicrophoneStatus(status: Status) {
    console.log(`\tCommon:: Verify microphone status as ${status}`);
    expect(await this.getMicrophoneStatus()).toEqual(status);
  }

  async verifyCameraStatus(status: Status) {
    console.log(`\tCommon:: Verify camera status as ${status}`);
    expect(await this.getCameraStatus()).toEqual(status);
  }

  async verifySharingIsStarted() {
    console.log(`\tCommon:: Verify sharing is started`);
    expect(await this.getScreenSharingStatus()).toEqual('On');
  }

  async verifySharingIsStoped() {
    console.log(`\tCommon:: Verify sharing is stoped`);
    expect(await this.getScreenSharingStatus()).toEqual('Off');
  }

  // TODO: Not sure button will have text
  async verifyCopyInviteLinkButtonText(text: string) {
    console.log(`\tCommon:: Verify copy link button to be ${text}`);
    await expect(this.clocators.inviteLink).toHaveText(text);
  }

  async verifyMainStreamViewFullScreen(screen: Screen) {
    console.log(`\tCommon:: Verify main stream view ${screen} screen`);
    const fullScreen = await this.isFullScreen(this.clocators.mainStreamView);
    if (screen === 'full') {
      expect(fullScreen).toBeTruthy();
    } else {
      expect(fullScreen).toBeFalsy();
    }
  }

  async verifyComponentState(locator: Locator, state: State) {
    console.log(`\tCommon:: Verify component state is ${state}`);
    switch (state) {
      case 'visible':
        await expect(locator).toBeVisible();
        break;
      case 'hidden':
        await expect(locator).toBeHidden();
        break;
      case 'enabled':
        await expect(locator).toBeEnabled();
        break;
      case 'disabled':
        await expect(locator).toBeDisabled();
        break;
      default:
        throw Error(`Invalid Component State ${state}`);
    }
  }

  async isButtonToggled(locator: Locator, attributeName: string) {
    const attributeValue = await locator.getAttribute(attributeName);
    if (attributeValue == null) {
      return false;
    }
    return true;
  }

  //  async isMainStreamViewFullScreen(locator: Locator, attributeName: string) {
  async isFullScreen(locator: Locator) {
    const attributeValue = await locator.getAttribute('class');
    if (attributeValue?.includes('video--fullscreen')) {
      return true;
    }
    return false;
  }

  // static async getComputedAttribute(locator: Locator, attributeName: string) {
  //   const attributeValue = await locator.evaluate((e, attributeName) => {
  //     return window.getComputedStyle(e).getPropertyValue(attributeName);
  //   }, attributeName);
  //   return attributeValue;
  // }

  convertDurationtoSeconds(duration: string) {
    const [hours, minutes, seconds] = duration.split(':');
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  // TODO
  // Methods to verify All controls to be hidden when full screen
  // Methods to select/get/verify settings options
  // Add method to verifyStreamInfo Stats
  //
}
