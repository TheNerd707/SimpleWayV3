const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = (client) => {
  client.send = async () => {
    const embed1 = new EmbedBuilder()
      .setTitle("**PBR | ADMINISTRATIVE SUPPORT**")
      .setDescription(
        `*Please make an Administrative Support ticket only for the following reasons:*\n\n- Technical Difficulties w/\n      - CAD\n      - Community Nickname\n      - Community Roles\n- Community Related Document(s)\n- Community Related Server(s)`
      )
      .setColor("Green");

    const embed2 = new EmbedBuilder()
      .setTitle("**PBR | MODERATION SUPPORT**")
      .setDescription(
        `*Please make a Moderation Support ticket only for the following reasons:*\n\n- Reporting a Staff Member (Please specify in ticket)\n- Reporting a Community Member\n- Appeal Server Related Disciplinary Action(s)`
      )
      .setColor("#fc1703");

    const embed3 = new EmbedBuilder()
      .setTitle("**PBR | MISCELLANEOUS SUPPORT**")
      .setDescription(
        "*Please make a Miscellaneous Support ticket for any of the reasons that are _not_ listed in other support categories.*"
      )
      .setColor("Blue");

    const button1 = new ButtonBuilder()
    .setCustomId("admin")
    .setLabel("ADMINISTRATIVE")
    .setStyle(ButtonStyle.Success);
    const button2 = new ButtonBuilder()
    .setCustomId("mod")
    .setLabel("MODERATION")
    .setStyle(ButtonStyle.Danger);
    const button3 = new ButtonBuilder()
    .setCustomId("mis")
    .setLabel("MISCELLANEOUS")
    .setStyle(ButtonStyle.Primary);

    const channel = client.channels.cache.get("1194131766756266034");
    channel.send({ embeds: [embed1, embed2, embed3],
        components: [new ActionRowBuilder().addComponents(button1, button2, button3)], });
  };
};
