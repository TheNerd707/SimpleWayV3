const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    ActionRowBuilder,
    TextInputStyle,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("close")
      .setDescription("Closes the ticket."),
    async execute(interaction) {
      const modal = new ModalBuilder()
        .setCustomId("delete2")
        .setTitle("Reason?");
  
      const textInput = new TextInputBuilder()
        .setCustomId("delete3")
        .setLabel("What was the reason for the ticket?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
  
      modal.addComponents(new ActionRowBuilder().addComponents(textInput));
  
      await interaction.showModal(modal); // Always show modal within 3s
    },
  };
  