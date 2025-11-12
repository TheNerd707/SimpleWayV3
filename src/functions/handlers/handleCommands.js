const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const control = require("../../../control.json");

module.exports = (client) => {
  client.handleCommands = async () => {
    async function commandHandler(filePath) {
      if (filePath.endsWith(".js")) {
        const command = require(`../../.${filePath}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        console.log(
          `Command: ${command.data.name} has passed through the handler.`
        );
      } else {
        const commandFiles = fs.readdirSync(filePath);
        for (const file of commandFiles) {
          await commandHandler(`${filePath}/${file}`);
        }
      }
    }
    await commandHandler("./src/commands");

    const clientID = process.env.clientId;
    const guildID = control.guild.id;
    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
      if (process.env.NODE_ENV === "prod") {
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationCommands(clientID), {
          body: client.commandArray,
        });
      }
      if (process.env.NODE_ENV === "dev") {
        console.log("Started refreshing application (/) commands for guild.");
        await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
          body: client.commandArray,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
};
