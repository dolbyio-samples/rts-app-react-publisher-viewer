const all = [
  "./features/**/*.feature",
  "--require-module ts-node/register",
  "--require ./support/**/*.ts",
  "--require ./steps/**/*.ts",
  "--format progress-bar",
  "-f json:./reports/cucumber_report.json",
  "--publish-quiet",
].join(" ");

const smoke = `${all} --tags @smoke`;
const regression = `${all} --tags @regression`;

module.exports = { default: all, smoke, regression };
