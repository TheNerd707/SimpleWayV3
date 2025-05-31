//I did not like myself the day I wrote this.

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const file = require(`./../../../control.json`);
const control = file.priority;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("priority-start")
    .setDescription("Starts a priority."),
  async execute(interaction, client) {
    if (!client.priorityStatus && !client.cooldown) {
      const priorityChannel = client.channels.cache.get(control.priority)
      const log = client.channels.cache.get(control.log)
    client.priorityStatus = true;
    interaction.reply({
      content: "Priority started",
      ephemeral: true
    });
    const embed = new EmbedBuilder()
    .setTitle("PRIORITY")
    .setDescription("A priority has been claimed")
    .setColor("Purple");

    const abacadaba = new EmbedBuilder() //why? The name :(
    .setTitle("Priority started")
    .setDescription(`Started by: <@${interaction.user.id}>`)
    .setColor("Orange");

    priorityChannel.send({embeds: [embed]})
    log.send({embeds: [abacadaba]}) 

  } else {
    interaction.reply({
        content: "There is a priority or priority cooldown already.",
        flags: MessageFlags.Ephemeral,
    })
  }
},
};