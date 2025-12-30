const { ActivityType } = require('discord.js')
const chalk = require("chalk");
module.exports = {
    name: 'clientReady',
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
            },
            {
                type: ActivityType.Playing,
                text: 'with code.',
                status: "dnd"
            },
            {
                type: ActivityType.Watching,
                text: 'YouTube.',
                status: "idle"
            }
        ];


        setInterval(() => {
            client.pickPresence(options);
          }, 10 * 1000);
        console.log(chalk.greenBright("[Bot Status]: Connected"));
    }
}