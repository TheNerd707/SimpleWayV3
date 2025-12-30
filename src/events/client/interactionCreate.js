const {InteractionType} = require("discord.js");
const control = require(`../../../control.json`);
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const globalCommands = client.commands["global"];
      const name = Object.keys(control.servers).find(key => control.servers[key] === interaction.guildId) || "global";
      let command = client.commands[name].get(interaction.commandName);
      if (!command) {
        command = globalCommands.get(interaction.commandName);
      }
      if (!command) {
        return;
      };
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return;
      try {
        await button.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this button interaction!",
          ephemeral: true,
        });
      }
    }else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error("There is no code for this menu.");
      console.log(`Menu '${customId}' was ran.`);
      try {
        await menu.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error("There is no code for this modal.");

      try {
        await modal.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commandName } = interaction;
      const contextCommand = client.commands.get(interaction.guildId).get(interaction.commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } 
  },
};
