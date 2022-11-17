import { Locator, Page } from 'playwright';

export default class CommonLocators {
  private page: Page;

  readonly companyNameLbl: Locator;

  readonly timerLbl: Locator;

  readonly streamingStatusLbl: Locator;

  readonly microphoneBtn: Locator;

  readonly cameraBtn: Locator;

  readonly shareBtn: Locator;

  readonly settingsBtn: Locator;

  readonly inviteLink: Locator;

  readonly streamInfoBtn: Locator;

  readonly fullScreenBtn: Locator;

  readonly mainStreamView: Locator;

  readonly galleryView: Locator;

  readonly appVersion: Locator;

  readonly streamInformationStats: Locator;

  constructor(page: Page) {
    this.page = page;
    this.companyNameLbl = page.locator('[test-id=actionBar] [test-id=headingName]');
    this.timerLbl = page.locator('[test-id=timer] p');
    this.streamingStatusLbl = page.locator('[test-id=live-indicator]');
    this.microphoneBtn = page.locator('[test-id=toggleMicrophoneButton]');
    this.cameraBtn = page.locator('[test-id=toggleCameraButton]');
    this.shareBtn = page.locator('[test-id=toggleShareButton]');
    this.settingsBtn = page.locator('[test-id=settingsButton]');
    // TODO: Replace with test-id once fixed
    this.inviteLink = page.locator('[test-id=]');
    // TODO: Remove first and last when the gallery view is implemented
    this.streamInfoBtn = page.locator('[test-id=streamInfoButton]').first();
    this.fullScreenBtn = page.locator('[test-id=fullScreenButton]').first();
    this.mainStreamView = page.locator('[test-id=video-view]').first();
    this.galleryView = page.locator('[test-id=video-view]').last();
    this.appVersion = page.locator('[test-id=appVersion]').last();
    // TODO: Replace with test-id once stream info drawer is defined
    this.streamInformationStats = page.locator('[test-id=]');
  }
}
