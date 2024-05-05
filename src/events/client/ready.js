const { ActivityType } = require('discord.js')
const chalk = require("chalk");
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        const options = [
            {
                type: ActivityType.Watching,
                text: "over some nerds.",
                status: "online"
            },
            {
                type: ActivityType.Listening,
                text: 'slash commands',
                status: "online"
            }
        ];


        setInterval(() => {
            client.pickPresence(options);
          }, 10 * 1000);
        console.log(chalk.greenBright("[Bot Status]: Connected"));
    }
}