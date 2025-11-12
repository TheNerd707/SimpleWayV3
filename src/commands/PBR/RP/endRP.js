const { SlashCommandBuilder } = require("discord.js");
const control = require("../../../../control.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("endrp")
    .setDescription("Ends the current roleplay session."),
  async execute(interaction, client) {
    if (client.pbr.cache.roleplayActive !== "started") {
      return interaction.reply({
        content: "There is no roleplay session currently active.",
        ephemeral: true,
      });
    }
    const status = await client.getUserStatus(interaction.user.id)
    if (status !== "s") {
      return interaction.reply({
        content: "You do not have permission to end the roleplay session.",
        ephemeral: true,
      });
    }
    // End the roleplay session
    client.pbr = {};
    client.pbr.cache = {
      message: null,
      roleplayActive: false,
      hosts: [],
      timestamp: null,
      location: null,
      players: {
        onTime: [],
        late: {},
        notComing: [],
      },
    };
    await interaction.reply({
      content: "The roleplay session has been ended.",
      ephemeral: true,
    });

    const channel = client.channels.cache.get(control.channels.roleplay);

    await channel.send({
      content: "The roleplay session has been ended."
    });
  },
};
