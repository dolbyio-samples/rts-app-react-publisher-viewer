import fs from 'fs';
import path from 'path';

import { load } from 'js-yaml';

import { logger } from '../logger';

export type TargetSelector = string | string[];
type PageSelectorMap = Map<string, TargetSelector>;
type PageSelectorObject = {
  [key: string]: TargetSelector;
};
type SelectorMap = Map<string, PageSelectorMap>;

export class SelectorMapper {
  private readonly supportFiles: string[] = ['.yaml', '.yml', '.json'];

  private selectorMap: SelectorMap;

  private pageList: string[];

  private componentList: string[];

  private cache: Map<string, TargetSelector>;

  constructor(mappingsDir: string) {
    this.pageList = [];
    this.componentList = [];
    this.selectorMap = this.readMappingFiles(mappingsDir);
    this.cache = new Map();
  }

  private readMappingFiles(mappingsDir: string): SelectorMap {
    logger.info('Read Mapping Files');
    const selectorMap: SelectorMap = new Map();
    const files = this.getFiles(mappingsDir);
    this.setPageComponentList(files);

    files.forEach((file) => {
      const parsedFile = path.parse(file);
      if (this.supportFiles.includes(parsedFile.ext.toLowerCase())) {
        const data = SelectorMapper.readFromFile(`${mappingsDir}/${file}`);
        this.validateDataMap(parsedFile.name.toLowerCase(), data);
        selectorMap.set(parsedFile.name.toLowerCase(), data);
      }
    });
    return selectorMap;
  }

  private getFiles(path: string): string[] {
    const files: string[] = [];
    fs.readdirSync(path).forEach((file) => {
      const fullPath = `${path}/${file}`;
      if (fs.lstatSync(fullPath).isDirectory()) {
        this.getFiles(fullPath).forEach((name) => files.push(`${file}/${name}`));
      } else {
        files.push(file);
      }
    });
    return files;
  }

  private setPageComponentList(files: string[]) {
    files.forEach((file) => {
      const name = path.parse(file).name.toLowerCase();
      // eslint-disable-next-line no-unused-expressions
      file.startsWith('components/') ? this.componentList.push(name) : this.pageList.push(name);
    });
  }

  private static readFromFile(filePath: string): PageSelectorMap {
    logger.debug(`Read File: ${filePath}`);
    const parsedFile = path.parse(filePath);
    if (parsedFile.ext.toLowerCase() === '.json') {
      return SelectorMapper.readJSONFile(filePath);
    }
    return SelectorMapper.readYAMLFile(filePath);
  }

  private validateDataMap(componentOrPageName: string, data: PageSelectorMap) {
    if (this.selectorMap?.has(componentOrPageName))
      throw new Error(`Page/Component ${componentOrPageName} already exists in SelectorMap`);

    if (this.pageList.includes(componentOrPageName)) {
      // Page Map Validations
      if (data.has('COMPONENTS')) {
        const components = data.get('COMPONENTS') as string[];
        if (components.length === 0) throw new Error(`Page ${componentOrPageName} cannot have empty components`);
        components.forEach((component) => {
          if (this.pageList.includes(component))
            throw new Error(`Page ${componentOrPageName} cannot refer another Page ${component}`);
          if (!this.componentList.includes(component))
            throw new Error(`Invalid component ${component} reference in Page ${componentOrPageName}`);
        });
      }
    } else {
      // Component Map Validations
      // eslint-disable-next-line no-lonely-if
      if (data.has('COMPONENTS')) throw new Error(`Component ${componentOrPageName} should not contain COMPONENTS key`);
    }
  }

  private static readJSONFile(filePath: string): PageSelectorMap {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContents);
    const dataMap: PageSelectorMap = new Map(Object.entries(jsonData));
    return dataMap;
  }

  private static readYAMLFile(filePath: string): PageSelectorMap {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const yamlData = load(fileContents) as PageSelectorObject;
    const dataMap: PageSelectorMap = new Map(Object.entries(yamlData));
    return dataMap;
  }

  getSelector(pageName: string, selectorName: string): TargetSelector {
    logger.info(`Get Selector '${selectorName}' from '${pageName}' page`);
    if (this.cache.has(`${pageName}-${selectorName}`)) {
      return this.cache.get(`${pageName}-${selectorName}`) as TargetSelector;
    }

    let targetSelector!: TargetSelector;
    if (this.selectorMap.has(pageName)) {
      const pageSelectorMap = this.selectorMap.get(pageName) as PageSelectorMap;
      if (!pageSelectorMap.has(selectorName) && !pageSelectorMap.has('COMPONENTS')) {
        throw new Error(`Selector '${selectorName}' not found in '${pageName}' page`);
      }
      targetSelector = this.searchSelector(pageName, selectorName);
    } else {
      throw new Error(`Invalid page name: ${pageName}`);
    }

    if (targetSelector.length === 0) {
      throw new Error(`Selector '${selectorName}' value is not defined or blank`);
    }

    logger.info(`Selector Value: '${targetSelector}'`);
    this.cache.set(`${pageName}-${selectorName}`, targetSelector);
    return targetSelector;
  }

  private searchSelector(pageName: string, selectorName: string) {
    logger.debug(`Search Selector '${selectorName}' in '${pageName}' page`);

    let targetSelector!: TargetSelector;
    const pageSelectorMap = this.selectorMap.get(pageName) as PageSelectorMap;

    if (pageSelectorMap.has(selectorName)) {
      targetSelector = pageSelectorMap.get(selectorName) as TargetSelector;
      targetSelector = this.checkReference(pageName, targetSelector);
    } else {
      const components = pageSelectorMap.get('COMPONENTS') as string[];
      if (!components.includes('common-components')) components.push('common-components');
      targetSelector = this.searchSelectorInComponents(pageName, selectorName, components);
      targetSelector = this.checkReference(pageName, targetSelector);
    }

    return targetSelector;
  }

  private searchSelectorInComponents(pageName: string, selectorName: string, components: string[]): TargetSelector {
    logger.debug(`Component Search Selector: ${selectorName}`);

    // eslint-disable-next-line no-restricted-syntax
    for (const component of components) {
      const componentMap = this.selectorMap.get(component) as PageSelectorMap;
      if (componentMap.has(selectorName)) {
        logger.debug(`Selector ${selectorName} found in ${component}`);
        return componentMap.get(selectorName) as TargetSelector;
      }
    }
    throw new Error(`Selector ${selectorName} not found in ${components} components of '${pageName} page'`);
  }

  private checkReference(pageName: string, targetSelector: TargetSelector) {
    logger.debug(`Checking Selector Reference '${targetSelector}'`);

    if (Array.isArray(targetSelector)) {
      let modifiedSelector: string[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const selector of targetSelector) {
        const target = this.getReference(pageName, selector);
        modifiedSelector = modifiedSelector.concat(target);
      }
      return modifiedSelector;
    }
    return this.getReference(pageName, targetSelector);
  }

  private getReference(pageName: string, selectorName: string): TargetSelector {
    logger.debug(`Get Selector Reference '${selectorName}'`);
    let targetSelector!: TargetSelector;
    if (selectorName.startsWith('$ref:')) {
      const refSelector = selectorName.split('$ref:')[1].trim();
      targetSelector = this.searchSelector(pageName, refSelector);
    } else {
      targetSelector = selectorName;
    }

    return targetSelector;
  }
}
