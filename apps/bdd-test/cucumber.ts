const reportPath = process.env.REPORT_PATH || './apps/bdd-test/reports';

const all = [
  './apps/bdd-test/features/**/*.feature',
  '--require-module ts-node/register',
  '--require ./apps/bdd-test/support/**/*.ts',
  '--require ./apps/bdd-test/steps/**/*.ts',
  `-f json:${reportPath}/cucumber_report.json`,
  '--publish-quiet',
].join(' ');

const smoke = `${all} --tags @smoke`;
const publisher = `${all} --tags @publisher`;
const viewer = `${all} --tags @viewer`;
const only = `${all} --tags @only`;

module.exports = { default: all, smoke, publisher, viewer, only };
