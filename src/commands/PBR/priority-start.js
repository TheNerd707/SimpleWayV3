const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const control = require(`./../../../control.json`)
module.exports = {
  data: new SlashCommandBuilder()
    .setName("priority-start")
    .setDescription("Starts a priority."),
  async execute(interaction, client) {
    if (!client.priorityStatus) {
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

    const abacadaba = new EmbedBuilder()
    .setTitle("Priority started")
    .setDescription(`Started by: <@${interaction.user.id}>`)
    .setColor("Orange");
    
    priorityChannel.send({embeds: [embed]})
    log.send({embeds: [abacadaba]})
  } else {
    interaction.reply({
        content: "There is a priority already.",
        ephemeral: true
    })
  }
},
};
