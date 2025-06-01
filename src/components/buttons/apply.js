const { ChannelType, MessageFlags, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const applicationDB = require("../../schemas/applications");
const mongoose = require("mongoose");
const control = require("../../../control.json");

module.exports = {
  data: {
    name: "apply",
  },
  async execute(interaction, client) {
    for (const [key, value] of client.applications) {
      if (value.user === interaction.user.id) {
        return interaction.reply({
          content: "You already have an application open.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    const { guild, member } = interaction;
    const everyone = control.guild.id;
    
    const { ViewChannel, SendMessages} = PermissionFlagsBits;

    const channel = await guild.channels.create({
      name: `application - ${member.user.username}`,
      type: ChannelType.GuildText,
      parent: guild.channels.cache.get(control.channels.apply),

      permissionOverwrites: [
        {
          id: member.id,
          allow: [ViewChannel, SendMessages],
        },
        {
          id: everyone,
          deny: [ViewChannel, SendMessages],
        },
      ],
    });
    interaction.reply({
      content: `Please follow dirrections in <#${channel.id}>`,
      flags: MessageFlags.Ephemeral,
    });

    const embed = new EmbedBuilder()
      .setTitle("**PBR | APPLICATION**")
      .setDescription(
        'Before we begin this short process, please make sure you have read the rules located in <#1194767732592353321>.\n\nOnce you have done so, please type the following: "I have read the rules, and I agree to follow them." If you do not agree, please leave this Discord server.'
      )
      .setColor("#fc1703");
    channel.send({
      content: `<@${member.id}>`,
      embeds: [embed],
    });
    client.applications.set(channel.id, {
      user: member.id,
      status: "rules",
    });
    const app = new applicationDB({
      _id: new mongoose.Types.ObjectId(),
      user: member.id,
      channelId: channel.id,
      messages: [
        {
          user: "ADMIN",
          message: "Application started.",
          time: new Date(),
        },
      ],
    });
    await app.save();
  },
};
