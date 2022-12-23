const reportPath = process.env.REPORT_PATH || './apps/e2e-test/reports';

const all = [
  './apps/e2e-test/features/**/*.feature',
  '--require-module ts-node/register',
  '--require ./apps/e2e-test/src/hooks/**/*.ts',
  '--require ./apps/e2e-test/src/steps/**/*.step.ts',
  `-f json:${reportPath}/cucumber_report.json`,
  '--publish-quiet',
].join(' ');

const smoke = `${all} --tags @smoke`;
const publisher = `${all} --tags @publisher`;
const viewer = `${all} --tags @viewer`;
const local = `${all} --tags @local`;
const only = `${all} --tags @only`;

module.exports = { default: all, smoke, publisher, viewer, local, only };
