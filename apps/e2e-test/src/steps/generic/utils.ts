import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import { getData } from '../../hooks/utils';
import { SelectorMapper, TargetSelector } from '../../utils/selector-mapper';

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

export function getValidationCondition(selectorMap: SelectorMapper, pageName: string) {
  const validationCondition = selectorMap.getSelector(pageName, 'validation') as string;
  const validationArray = validationCondition.split(':');
  return {
    selector: validationArray[0],
    condition: validationArray.length > 1 ? validationArray[1] : 'displayed',
  };
}

export function replaceAttributeTargetSelector(targetSelector: TargetSelector, attributeValue: string): TargetSelector {
  if (typeof targetSelector === 'string') {
    return targetSelector.replace('<REPLACE>', attributeValue);
  } else {
    const updatedTargetLocator: string[] = [];
    for (const selector of targetSelector) {
      (updatedTargetLocator as string[]).push(selector.replace('<REPLACE>', attributeValue));
    }
    return updatedTargetLocator;
  }
}
