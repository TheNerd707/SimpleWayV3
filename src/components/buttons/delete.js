const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: {
      name: 'delete'
    },
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setCustomId("delete2")
        .setTitle("Reason?");
  
      const textInput = new TextInputBuilder()
        .setCustomId("delete3")
        .setLabel("What was the reason for the ticket?")
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
  
      modal.addComponents(new ActionRowBuilder().addComponents(textInput));
  
      await interaction.showModal(modal);
    }
  };
  