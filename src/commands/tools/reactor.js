const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactor")
    .setDescription("Returns a reaction.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const message = await interaction.reply({
      content: `React Here!`,
      fetchReply: true,
    });

    const emoji = client.emojis.cache.find(
      (emoji) => emoji.id == "1191192762876444692"
    );
    message.react(emoji);

    message
      .awaitReactions({ max: 4, time: 10000, errors: ["time"] })
      .then((collected) => console.log(collected.size))
      .catch((collected) => {
        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
      });
  },
};
