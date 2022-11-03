const all = [
  './features/**/*.feature',
  '--require-module ts-node/register',
  '--require ./support/**/*.ts',
  '--require ./steps/**/*.ts',
  '-f json:./reports/cucumber_report.json',
  '--publish-quiet',
].join(' ');

const smoke = `${all} --tags @smoke`;
const regression = `${all} --tags @regression`;
const only = `${all} --tags @only`;

module.exports = { default: all, smoke, regression, only };
