const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const control = require("../../../control.json");
const chalk = require("chalk");

module.exports = async (client) => {
  async function getFiles(folder) {
    if (folder.endsWith(".js")) {
      return [folder];
    } else {
      let commandFiles = [];
      const files = fs.readdirSync(folder);
      for (const file of files) {
        const filePath = `${folder}/${file}`;
        const stat = fs.lstatSync(filePath);
        if (stat.isDirectory()) {
          const nestedFiles = await getFiles(filePath);
          commandFiles = commandFiles.concat(nestedFiles);
        } else if (file.endsWith(".js")) {
          commandFiles.push(filePath);
        }
      }
      return commandFiles;
    }
  }
  client.handleCommands = async () => {
    const clientID = process.env.clientId;
    for (const server in control.servers) {
      const serverId = control.servers[server];
      console.log(chalk.magenta(`Loading commands for server ${server}`));
      const commandFiles = await getFiles(`./src/commands/${server}`);
      for (const file of commandFiles) {
        const command = require(`../../../${file}`);
        client.commands[server].set(command.data.name, command);
        client.commandArray[server].push(command.data.toJSON());
        console.log(chalk.green(`Loaded command ${command.data.name} for server ${server}`));
      }
      const rest = new REST({ version: "9" }).setToken(process.env.token);
      try {
        if (client.commandArray[server].length === 0) {
          console.log(chalk.yellow(`No commands to load for server ${server}, skipping...`));
          continue;
        }
        console.log(
          chalk.magenta(`Started refreshing ${client.commandArray[server].length} application (/) commands for server ${server}.`)
        );
        const data = await rest.put(
          Routes.applicationGuildCommands(clientID, serverId),
          { body: client.commandArray[server] }
        );
        console.log(chalk.green(
          `Successfully reloaded ${data.length} application (/) commands for server ${server}.`
        ));
      } catch (error) {
        console.error(error);
      }
    }
    const globalCommandFiles = await getFiles(`./src/commands/global`);
    console.log(chalk.magenta(`Loading commands for server global`));
    for (const file of globalCommandFiles) {
      const command = require(`../../../${file}`);
      client.commands["global"].set(command.data.name, command);
      client.commandArray["global"].push(command.data.toJSON());
      console.log(chalk.green(`Loaded global command ${command.data.name}`));
    }
    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
        if (client.commandArray["global"].length === 0) {
            console.log(chalk.yellow(`No global commands to load, skipping...`));
            return;
        }
      console.log(
        chalk.magenta(`Started refreshing ${client.commandArray["global"].length} global application (/) commands.`)
      );
      const data = await rest.put(Routes.applicationCommands(clientID), {
        body: client.commandArray["global"],
      });
      console.log(chalk.green(
        `Successfully reloaded ${data.length} global application (/) commands.`
      ));
    } catch (error) {
      console.error(error);
    }
  };
};
