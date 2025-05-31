const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const file = require(`./../../../control.json`);
const control = file.priority;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jail")
    .setDescription("Send someone to the prison.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send to prison.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason the user is being convected.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription("The time, in seconds, the user will be in prison.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const time = interaction.options.getInteger("time");

    const prison = client.channels.cache.get(control.prison);

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Prison")
      .setDescription(
        `${user} has been sent to prison for the following reason(s): ${reason}.`
      );

    prison.send({ embeds: [embed] });

    interaction.reply({
      content: `${user} has been sent to prison for the following reason(s): ${reason}.`,
      flags: MessageFlags.Ephemeral,
    });

    setTimeout(() => {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Prison")
        .setDescription(`${user} has been released from prison.`);

      prison.send({ embeds: [embed] });
    }, time * 1000);
  },
};
