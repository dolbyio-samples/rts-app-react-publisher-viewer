const all = [
  './apps/bdd-test/features/**/*.feature',
  '--require-module ts-node/register',
  '--require ./apps/bdd-test/support/**/*.ts',
  '--require ./apps/bdd-test/steps/**/*.ts',
  '-f json:./apps/bdd-test/reports/cucumber_report.json',
  '--publish-quiet',
].join(' ');

const smoke = `${all} --tags @smoke`;
const publisher = `${all} --tags @publisher`;
const viewer = `${all} --tags @viewer`;
const only = `${all} --tags @only`;

module.exports = { default: all, smoke, publisher, viewer, only };
