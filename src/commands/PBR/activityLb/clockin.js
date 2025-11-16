const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../../schemas/user");
const Timecard = require("../../../schemas/timecard");
const roleplay = require("../../../schemas/roleplays");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clockin")
    .setDescription("Clocks you in to the activity leaderboard.")
    .addStringOption(option => 
        option.setName("department")
        .setDescription("Your department for clocking in.")
        .setRequired(true)
        .addChoices(
            { name: "LEO", value: "cops" },
            { name: "Civilian", value: "civilians" },
            { name: "SAFR", value: "safr" },
        )),
  async execute(interaction, client) {
    await interaction.deferReply();

    const userId = interaction.user.id;
    const department = interaction.options.getString("department");

    let user = await User.findOne({ discordID: userId });

    if (!user) {
        user = new User({
        _id: new mongoose.Types.ObjectId(),
        discordID: userId, 
        token: "12345",
    });
    }
    const existingTimecard = await Timecard.findOne({ discordID: userId, timeOut: { $exists: false } });

    if (existingTimecard) {
      return interaction.editReply("You are already clocked in.");
    }

    const newTimecard = new Timecard({
      _id: new mongoose.Types.ObjectId(),
      discordID: userId,
      timeIn: Date.now(),
      department: department
    });

    await newTimecard.save();

    user.timecards.push(newTimecard._id);

    await user.save();

    const rp = await roleplay.findOne({}).sort({ timestamp: -1 });
    if (rp && !rp.participants.clockedIn.includes(userId)) {
    const now = Math.floor(Date.now() / 1000); // Discord uses seconds since epoch
    rp.participants.clockedIn.push({
        userId: userId,
        time: now
    });
    rp.participants.attendance[department].push(userId);
      await rp.save();
    }
    const embed = new EmbedBuilder()
      .setTitle("Clocked In")
      .setDescription(`You have successfully clocked in <t:${Math.floor(newTimecard.timeIn / 1000)}:R> ago.`)
      .setColor("Green")
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};  