const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const file = require(`../../../../control.json`)
const control = file.serverSettings.pbr.channels;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hospitalize")
    .setDescription("Send someone to the hospital.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send to the hospital.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("injuries")
        .setDescription("The injuries the user has.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("The time, in seconds, the user will be in the hospital.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const injuries = interaction.options.getString("injuries");
    const time = interaction.options.getInteger("time");

    const hospital = client.channels.cache.get(control.hospital);

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Hospitalization")
        .setDescription(
            `${user} has been sent to the hospital with the following injuries: ${injuries}.`
        );

    hospital.send({ embeds: [embed] });

    interaction.reply({
      content: `${user} has been sent to the hospital with the following injuries: ${injuries}.`,
      flags: MessageFlags.Ephemeral,
    });

    setTimeout(() => {
      const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Hospitalization")
          .setDescription(
              `${user} has been released from the hospital.`
          );

      hospital.send({ embeds: [embed] });
    }, time * 1000);
  },
};
