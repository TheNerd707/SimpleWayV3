const { EmbedBuilder } = require("discord.js");
const control = require("../../../control.json");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    const serverKey = Object.keys(control.servers).find(
      (key) => control.servers[key] === member.guild.id
    );
    if (!serverKey) return;

    const welcomeChannelId = control.serverSettings[serverKey]?.channels.welcome;
    if (!welcomeChannelId) return;

    const welcomeChannel = await member.guild.channels
      .fetch(welcomeChannelId)
      .catch(() => null);
    if (!welcomeChannel) return;

    let welcomeEmbed = new EmbedBuilder();
    if (serverKey === "pbr") {
      welcomeEmbed
        .setColor("#fc1703")
        .setTitle("Welcome to Project Black Rose!")
        .setDescription(
          `<@${member.user.id}>\nMake sure to check out <#1194767732592353321> and <#1194283161279004713>`
        );
    } else {
      welcomeEmbed
        .setColor("#fc1703")
        .setTitle("Welcome!")
        .setDescription(`<@${member.user.id}> joined the server!`);
    }

    const webhooks = await welcomeChannel.fetchWebhooks();

    if (webhooks.size === 0) {
      const newWebhook = await welcomeChannel.createWebhook({
        name: "PBR | Project Black Rose",
        avatar:
          "https://cdn.discordapp.com/attachments/1052328721882816523/1236165364975407165/64117E29-FAD8-4EE8-BFFC-5E214D9190E4.png?ex=6812f1b5&is=6811a035&hm=322fc9318a78d534b56693de4f7a722f8c64c23197edd14e93ce41afdef212b3&",
      });
      await newWebhook.send({ embeds: [welcomeEmbed] });
    } else {
      const existingWebhook = webhooks.first();
      await existingWebhook.send({
        embeds: [welcomeEmbed],
        username: "PBR | Project Black Rose",
        avatarURL:
          "https://cdn.discordapp.com/attachments/1052328721882816523/1236165364975407165/64117E29-FAD8-4EE8-BFFC-5E214D9190E4.png?ex=6812f1b5&is=6811a035&hm=322fc9318a78d534b56693de4f7a722f8c64c23197edd14e93ce41afdef212b3&",
      });
    }

    const roleId = control.serverSettings[serverKey]?.roles.unwhitelisted;
    if (roleId) {
      const role = await member.guild.roles.fetch(roleId);
      if (role) {
        await member.roles.add(role).catch((err) => {
          console.error(
            `Failed to assign role to ${member.user.tag}:`,
            err
          );
        });
      }
    }
  },
};
