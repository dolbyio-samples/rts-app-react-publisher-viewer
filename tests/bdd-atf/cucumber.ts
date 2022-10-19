module.exports = {
    default: [
      "./features/**/*.feature",
      "--require-module ts-node/register",
      "--require ./support/**/*.ts",
      "--require ./steps/**/*.ts",
      "--format progress-bar",
      "-f json:./reports/cucumber_report.json",
      "--publish-quiet",
    ].join(" "),
};