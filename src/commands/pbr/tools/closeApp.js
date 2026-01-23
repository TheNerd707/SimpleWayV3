const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const control = require("../../../../control.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("closeapp")
    .setDescription("Closes the application."),
  async execute(interaction, client) {
    const user = interaction.user;
    const userStatus = await client.getUserStatus(user.id, interaction.guildId);
    if (userStatus.status != "s") {
      return interaction.reply({
        content: "❌ You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: "Closing the application...",
      ephemeral: true,
    });

    const channel = client.channels.cache.get(interaction.channelId);
    if (channel) {
        channel.delete();
    }

    const logChannel = client.channels.cache.get(control.serverSettings.pbr.channels.log);

    const embed = new EmbedBuilder()
        .setTitle("Application Closed")
        .setDescription(`An application has been closed by ${user.tag} (${user.id}). This application was for ${channel.name.slice(12)}.`)
        .setColor("Red")
        .setTimestamp();
    if (logChannel) {
        logChannel.send({ embeds: [embed] });
    }
  },
};
