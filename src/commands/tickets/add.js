const { SlashCommandBuilder } = require("discord.js");
const ticketDB = require("../../schemas/ticket");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds a member to the current ticket.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add to the ticket.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const channelId = interaction.channel.id;
    const user = interaction.options.getUser("user");
    const member = await interaction.guild.members.fetch(user.id);
    const ticket = await ticketDB.findOne({
      channelId: channelId,
    });
    if (!ticket) {
      return await interaction.reply({
        content: "This is not a ticket. If it is a ticket, I am a bad programmer.",
        flags: 64,
      });
    }
    if (ticket.members.includes(user.id)) {
      return await interaction.reply({
        content: "This user is already in the ticket. Please don't be annoying.",
        flags: 64,
      });
    }
    ticket.members.push(user.id);
    await ticket.save();
    await client.channels.cache.get(channelId).permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });
    await interaction.reply({
      content: `Successfully added ${user} to the ticket.`,
    });

  },
};
