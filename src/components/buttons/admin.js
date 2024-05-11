const { PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const control = require(`./../../../control.json`);
module.exports = {
  data: {
    name: "admin",
  },
  async execute(interaction, client) {
    const { guild, member, user } = interaction;
    const { ViewChannel, ReadMessageHistory, SendMessages } =
      PermissionFlagsBits;
    const staff = control.admin;
    const everyone = "1194127476536905838";
    const num = await client.ticketNumber();
    const channel = await guild.channels.create({
      name: `administrative - ${num}`,
      type: ChannelType.GuildText,
      parent: guild.channels.cache.get("1195021747485933658"),

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
    interaction.reply({ content: `Ticket opened. <#${channel.id}>`,
    ephemeral: true, });
    const embed = new EmbedBuilder().setTitle("**PBR | ADMINISTRATIVE SUPPORT**")
    .setDescription("Please provide the reason for opening the ticket and any evidence on the matter if you have any.");

    const button1 = new ButtonBuilder()
    .setCustomId("delete")
    .setLabel("CLOSE")
    .setStyle(ButtonStyle.Danger);

    channel.send({embeds: [embed],
   components: [new ActionRowBuilder().addComponents(button1)] })
  },
};
