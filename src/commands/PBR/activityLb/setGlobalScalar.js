const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setglobalscalar")
    .setDescription("Sets the global scalar for activity leaderboard.")
    .addNumberOption((option) =>
      option
        .setName("scalar")
        .setDescription("The new global scalar value.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const newScalar = interaction.options.getNumber("scalar");

    if (newScalar <= 0) {
      return interaction.reply("Scalar must be a positive number.");
    }

    client.pbr.scalar = newScalar;

    return interaction.reply({
      content: `Global scalar has been set to ${newScalar}. It will autimatically recent Monday morning some time between 4-9 AM CST`,
      ephemeral: true,
    });
  },
};
