import { Then } from '@cucumber/cucumber';
import { ScenarioWorld } from '../../hooks/ScenarioWorld';
import 'source-map-support/register';

Then(/^(?:I |)wait for "([^"]*)" seconds$/, async function (this: ScenarioWorld, waitForSeconds: number) {
  await new Promise((f) => setTimeout(f, waitForSeconds * 1000));
});
