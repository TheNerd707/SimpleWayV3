const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const control = require("../../../control.json");

const applicationDB = require("../../schemas/applications");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("close-app")
    .setDescription("Closes the application.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const channel = await client.channels.fetch(interaction.channelId);
    const application = await applicationDB.findOne({ channelId: channel.id });
    if (!application) {
      return interaction.reply({
        content: "This channel is not an application channel.",
        ephemeral: true,
      });
    }
    if (application.status === "completed") {
      return interaction.reply({
        content: "This application has already been closed.",
        ephemeral: true,
      });
    }
    application.status = "completed";
    await application.save(
    );

    const embed = new EmbedBuilder()
      .setTitle("Application Closed")
        .setDescription("This application has been closed by an administrator.")
        .addFields(
          { name: "User", value: `<@${application.user}>`, inline: true },
          { name: "Closed By", value: interaction.user.tag, inline: true }
        )
    const logchannel = client.channels.cache.get(control.priority.log);
    if (logchannel) {
      logchannel.send({ embeds: [embed] });
    }
    await channel.delete();
  },
};
