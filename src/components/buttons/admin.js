const {
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const ticketsDB = require(`../../schemas/ticket`);
const control = require(`./../../../control.json`);
const Mongoose = require("mongoose");
module.exports = {
  data: {
    name: "admin",
  },
  async execute(interaction, client) {
    const { guild, member, user } = interaction;
    const { ViewChannel, ReadMessageHistory, SendMessages } =
      PermissionFlagsBits;
    const staff = control.serverSettings.pbr.roles.admin;
    const everyone = control.servers.pbr;
    const num = await client.ticketNumber();
    const channel = await guild.channels.create({
      name: `administrative - ${num}`,
      type: ChannelType.GuildText,
      parent: guild.channels.cache.get(control.serverSettings.pbr.channels.ticketParent),

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
      flags: MessageFlags.Ephemeral,
    });
    const embed = new EmbedBuilder()
      .setTitle("**PBR | ADMINISTRATIVE SUPPORT**")
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
      ticketNumber: num,
      channelId: channel.id,
      userId: member.id,
      type: "administrative",
    })
    await ticket.save()
  },
};
