const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const file = require(`../../../../control.json`)
const control = file.serverSettings.pbr.channels;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("priority-end")
    .setDescription("Ends a priority."),
  async execute(interaction, client) {
    if (client.priorityStatus && !client.cooldown) {
      const priorityChannel = client.channels.cache.get(control.priority);
      const log = client.channels.cache.get(control.log)
    interaction.reply({
      content: "Priority ended",
      ephemeral: true,
    });
    const embed = new EmbedBuilder()
    .setTitle("Priority")
    .setDescription("The priority has ended")
    .setColor("Red");
    const time = new EmbedBuilder()
    .setTitle("Priority Cooldown")
    .setDescription("A priority cooldown is now in effect.")
    .setColor("DarkBlue");
    const abacadaba = new EmbedBuilder()
    .setTitle("Priority Ended")
    .setDescription(`Ended by: <@${interaction.user.id}>`)
    .setColor("Orange");
    
    priorityChannel.send({embeds: [embed]})
    priorityChannel.send({embeds: [time]})
    log.send({embeds: [abacadaba]})
    client.cooldown = true;

    function end() {
        const embed1 = new EmbedBuilder()
        .setTitle("Cooldown")
        .setDescription("The cooldown is now over")
        .setColor("Green");
        priorityChannel.send({embeds: [embed1]})
        client.priorityStatus = false;
        client.cooldown = false;
    }
    setTimeout(end, 10 * 60 * 1000)

    
  } else {
    interaction.reply({
        content: "There is not a priority.",
        ephemeral: true,
    })
  }
},
};