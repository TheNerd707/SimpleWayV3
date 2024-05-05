require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(process.env.token);

const clientId = '1190867838735483022';
const guildId = "1091518774953377893";

rest
  .put(Routes.applicationCommands(clientId), { body: [] })
  .then(() => console.log("Successfully deleted all global commands."))
  .catch(console.error);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
.then(() => console.log("Successfully deleted all guild commands."))
.catch(console.error);