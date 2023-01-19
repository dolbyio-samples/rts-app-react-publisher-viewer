import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData } from '../../hooks/utils';

export function replacePlaceholder(text: string, dataSource: ScenarioWorld): string {
  const replaceRegEx = /\$\{(.*?)\}/g;

  const foundMatches = text.matchAll(replaceRegEx);
  for (const match of foundMatches) {
    const placeholderValue = getData(dataSource, match[1]);
    text = text.replace(`$\{${match[1]}}`, placeholderValue);
  }
  return text;
}

export function isStreamNameDynamic(viewerURL: string) {
  const regEx = /streamName=\d{10,15}/;
  return regEx.test(viewerURL);
}

export function arrayContainsAll(mainArray: string[], subArray: string[]) {
  return subArray.every((elem) => mainArray.includes(elem));
}
