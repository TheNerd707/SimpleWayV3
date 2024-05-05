const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Returns an embed.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle(`Test Embed`)
      .setDescription("This only exists to show im great at coding")
      .setColor(0x18e1ee)
      .setImage(client.user.displayAvatarURL())
      .setTimestamp()
      .addFields([
        {
          name: "Im so cool",
          value: "Yes I am",
          inline: true,
        },
        {
          name: "Nova smells",
          value: "*Its true*",
          inline: true,
        },
      ]);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
