const { ChannelType, MessageFlags, EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const control = require("../../../control.json");

module.exports = {
  data: {
    name: "apply",
  },
  async execute(interaction, client) {
    
    const { guild, member } = interaction;
    const everyone = control.servers.pbr;
    
    const { ViewChannel, SendMessages} = PermissionFlagsBits;

    const channel = await guild.channels.create({
      name: `application - ${member.user.username}`,
      type: ChannelType.GuildText,
      parent: guild.channels.cache.get(control.serverSettings.pbr.channels.apply),

      permissionOverwrites: [
        {
          id: member.id,
          allow: [ViewChannel, SendMessages],
        },
        {
          id: control.serverSettings.pbr.roles.staff,
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
        "Welcome to Project Black Rose! The first step to becoming a member of our community, is to fill out our written application. Please press the button bellow to be directed to the Google Form."
      )
      .setColor("#fc1703");
    const embed2 = new EmbedBuilder()
      .setDescription(
        "After submitting the form, please type in this channel \"I've submitted my application!\" so a staff member can review it as soon as possible."
      )
      .setColor("#fc1703");
    const button = new ButtonBuilder()
      .setLabel("APPLICATION FORM")
      .setStyle(ButtonStyle.Link)
      .setURL("https://docs.google.com/forms/d/e/1FAIpQLScQPafsB8RyrrH_mA8q5VlC8IcxCngTqjVsBQvvTYmErFt3WQ/viewform?usp=sharing&ouid=105697972903739172539");
    await channel.send({
      content: `<@${member.id}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button)],
    });
     setTimeout(async () => {
      await channel.send({ embeds: [embed2] });
    }, 30000);
  },
};
