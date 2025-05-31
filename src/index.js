//Main File
require("dotenv").config();
const { databaseToken } = process.env;
const { connect } = require("mongoose");
const readline = require("readline");
const { stdin: input, stdout: output } = require("node:process");
const chalk = require("chalk");
const rl = readline.createInterface({ input, output });
rl.on("line", (input) => {
  if (input === "Send") client.send();
  if (input === "sendApp") client.sendApp();
});

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.sessionToken, // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events,
  AuditLogEvent,
} = require("discord.js");
const fs = require("fs");

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

//Needed for certant cmds
client.priorityStatus = false;

//Needed for function handalers to work
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.textCommands = new Collection();
client.applications = new Collection();
client.commandArray = [];

//Function Handaler
const functionFolders = fs
  .readdirSync(`./src/functions`)
  .filter((folder) => folder !== "breaker");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(`.js`));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login(process.env.token);
(async () => {
  connect("mongodb://192.168.0.21:27017/pbr").catch(console.error);
})();

require("./server/main.js")(app, client);

app.listen(3000, () => {
  console.log(chalk.green("[Server Status]: Online"));
});
