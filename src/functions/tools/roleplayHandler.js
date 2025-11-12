const { EmbedBuilder } = require("discord.js");
const control = require("../../../control.json");
const rpschema = require('../../schemas/roleplays.js');
const mongoose = require("mongoose");

module.exports = (client) => {
  client.roleplayHandler = async (_id) => {
    const rp = await rpschema.findById(_id);
    if (!rp) {
      throw new Error("Roleplay not found");
    }

    const hosts = rp.hosts;
    const timestamp = rp.timestamp;
    const location = rp.location;
    const players = rp.participants;

    // Count the total number of late players (keys in the 'late' object)
    const onTimeCount = Object.keys(players.ontime).length;
    const notComingCount = Object.keys(players.absent).length;
    const lateCount = players.late.length;

    const embed = new EmbedBuilder()
      .setColor(16520963)
      .setTitle("Roleplay Announcement!")
      .setDescription(
        `<t:${timestamp}:t> \n\nHosts: <@${hosts.join(
          ">, <@"
        )}> \nDate: <t:${timestamp}:D> \nLocation: ${location} ( see https://discord.com/channels/1194127476536905838/1322967678440443904 ) \nJoining on time: ${
          onTimeCount
        } \nJoining late: ${lateCount} \nNot coming: ${
          notComingCount
        } \n\n-# *NOTICE: the timestamp automatically corrects to your time zone!*`
      );
    const channel = client.channels.cache.get(control.channels.roleplay);
    const webhook = await channel.fetchWebhooks();
    if (webhook.size === 0) {
      await channel.createWebhook({
        name: "PBR | Project Black Rose",
        avatar:
          "https://cdn.discordapp.com/attachments/1052328721882816523/1236165364975407165/64117E29-FAD8-4EE8-BFFC-5E214D9190E4.png?ex=6812f1b5&is=6811a035&hm=322fc9318a78d534b56693de4f7a722f8c64c23197edd14e93ce41afdef212b3&",
      });
    }

    return embed;
  };
};
