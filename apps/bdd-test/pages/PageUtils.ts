import { ScenarioWorld } from '../support/ScenarioWorld';

import { PublisherPreviewPage } from './PublisherPreviewPage';
import { PublisherStreamPage } from './PublisherStreamPage';

export function getPageObject(scWorld: ScenarioWorld, pageName: string) {
  switch (pageName) {
    case 'PublisherPreviewPage':
      if (scWorld.globalVariables[pageName] === undefined) {
        const previewPage = new PublisherPreviewPage(scWorld.publisherPage);
        scWorld.globalVariables[pageName] = previewPage;
        return previewPage;
      }
      return scWorld.globalVariables[pageName];
      break;
    case 'PublisherStreamPage':
      if (scWorld.globalVariables[pageName] === undefined) {
        const streamPage = new PublisherStreamPage(scWorld.publisherPage);
        scWorld.globalVariables[pageName] = streamPage;
        return streamPage;
      }
      return scWorld.globalVariables[pageName];
      break;
    case 'ViewerConnectPage':
      break;
    case 'ViewerStreamPage':
      break;
    default:
      throw Error(`Invalid Page Name: ${pageName}`);
  }
}
