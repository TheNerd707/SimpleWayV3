const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("Testing ticket system"),
  async execute(interaction, client) {
    const num = await client.ticketNumber()
    interaction.reply(`${num}`)
    
  },
};
