const chalk = require("chalk");

module.exports = {
  name: "disconected",
  execute() {
    console.log(chalk.red("[Database Status]: disconeced"));
  },
};
