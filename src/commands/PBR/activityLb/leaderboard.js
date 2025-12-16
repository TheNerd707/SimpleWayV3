const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const MasterActivity = require("../../../schemas/masterActivity");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("activity-leaderboard")
    .setDescription("Displays the activity leaderboard for the current month."),
  async execute(interaction, client) {
    await interaction.deferReply();
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const masterActivity = await MasterActivity.findOne({ month: month, year: year }).populate("leaderboard.user");
    if (!masterActivity || masterActivity.leaderboard.length === 0) {
      return interaction.editReply("The activity leaderboard is currently empty for this month.");
    }

    const sortedLeaderboard = masterActivity.leaderboard.sort((a, b) => b.totalTime - a.totalTime);
    
    const embed = new EmbedBuilder()
    .setTitle("ACTIVITY LEADERBOARD");

    let description = "ACTIVITY LEADERBOARD\n\n";

    for (let i = 0; i < 10; i++) {
      const record = sortedLeaderboard[i];
      if (!record) break;
      
      const hours = Math.floor(record.totalTime / (1000 * 60 * 60));
      const minutes = Math.floor((record.totalTime % (1000 * 60 * 60)) / (1000 * 60));
      description += `**${i + 1}.** <@${record.user.discordID}> - ${hours} hours, ${minutes} minutes\n`;
    }

    description += "\n Time Left: " + (30 - now.getDate()) + " days";

    embed.setDescription(description)
      .setColor("Blue")
      .setTimestamp();
  
    return interaction.editReply({ embeds: [embed] });
  },
};
