//If you are reading this, you are either curious, lost, or dumb. Welcome nonetheless!

//Imports from Libraries
require("dotenv").config();
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const {connect} = require("mongoose");
const fs = require("fs");
const path = require("path");


//setup config file based on environment
if (process.env.NODE_ENV === "dev") {
  const dev = require("../control.dev.json");
  fs.writeFileSync("./control.json", JSON.stringify(dev, null, 4));
} else if (process.env.NODE_ENV === "prod") {
  const prod = require("../control.prod.json");
  fs.writeFileSync("./control.json", JSON.stringify(prod, null, 4));
}
const control = require("../control.json");


//Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.commands = [];
client.commandArray = [];
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

for (const server in control.servers) {
  client.commands[server] = new Collection();
  client.commandArray[server] = [];
}
client.commands['global'] = new Collection();
client.commandArray['global'] = [];


//Function Handaler
const functitionFolders = fs.readdirSync("./src/functions/");
async function funcHandler(path) {
  if (path.endsWith(".js")) {
    require(`../${path}`)(client);
  } else {
    const functionFiles = fs
      .readdirSync(path);
    for (const file of functionFiles) {
      funcHandler(`${path}/${file}`);
    }
  }
}

functitionFolders.forEach(async (folder) => {
  await funcHandler(`./src/functions/${folder}`);
});
client.handleEvents();
client.handleCommands();
client.handleComponents();


//API setup
const express = require("express");
const chalk = require("chalk");
const app = express();

setTimeout(() => {
  console.log(chalk.blueBright("[Status]: Initialization started"));
}, 1000);
setTimeout(() => {
  require("./server/main")(app, client);
  client.login(process.env.token);
(async () => {
  connect("mongodb://pi.local:27017/" + control.db.name).catch(console.error);
})();
}, 5000); //Delay to allow other setups to complete, making sure all commands are loaded before bot goes online. Increase as needed or disable if you are not weird like me