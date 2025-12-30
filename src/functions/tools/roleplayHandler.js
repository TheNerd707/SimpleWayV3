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

    return embed;
  };
};
