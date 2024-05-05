const chalk = require("chalk");

module.exports = {
  name: "err",
  execute(err) {
    console.log(chalk.green(`[Database Status]: Disconected (error):\n${err}`));
  },
};
