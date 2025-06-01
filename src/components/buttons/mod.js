const {
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const control = require(`./../../../control.json`);
const ticketsDB = require(`../../schemas/ticket`);
const Mongoose = require("mongoose");
module.exports = {
  data: {
    name: "mod",
  },
  async execute(interaction, client) {
    const { guild, member, user } = interaction;
    const { ViewChannel, ReadMessageHistory, SendMessages } =
      PermissionFlagsBits;
    const staff = control.roles.ia;
    const everyone = control.guild.id;
    const num = await client.ticketNumber();
    const channel = await guild.channels.create({
      name: `moderation - ${num}`,
      type: ChannelType.GuildText,
      parent: guild.channels.cache.get(control.channels.ticketParent),

      permissionOverwrites: [
        {
          id: member.id,
          allow: [ViewChannel, SendMessages, ReadMessageHistory],
        },
        {
          id: staff,
          allow: [ViewChannel, SendMessages, ReadMessageHistory],
        },
        {
          id: everyone,
          deny: [ViewChannel, SendMessages, ReadMessageHistory],
        },
      ],
    });
    interaction.reply({
      content: `Ticket opened. <#${channel.id}>`,
      flags: 64,
    });

    const embed = new EmbedBuilder()
      .setTitle("**PBR | MODERATION SUPPORT**")
      .setDescription(
        "Please provide the reason for opening the ticket and any evidence on the matter if you have any."
      );

    const button1 = new ButtonBuilder()
      .setCustomId("delete")
      .setLabel("CLOSE")
      .setStyle(ButtonStyle.Danger);

    channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button1)],
    });
    const ticket = new ticketsDB({
      _id: new Mongoose.Types.ObjectId(),
      channelId: channel.id,
      userId: member.id,
      type: "moderation",
    });
    await ticket.save();
  },
};
