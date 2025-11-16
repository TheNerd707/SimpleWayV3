const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../../schemas/user");
const Timecard = require("../../../schemas/timecard");
const roleplay = require("../../../schemas/roleplays");
const MasterActivity = require("../../../schemas/masterActivity");
const mongoose = require("mongoose");
const controls = require("../../../../control.json");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("clockout")
    .setDescription("Clocks you out of the activity leaderboard."),
    async execute(interaction, client) {
        await interaction.deferReply(); 
        const userId = interaction.user.id;
        
        const user = await User.findOne({ discordID: userId });
        if (!user) {
            return interaction.editReply("You are not clocked in.");
        }

        const existingTimecard = await Timecard.findOne({ discordID: userId, timeOut: { $exists: false } });
        if (!existingTimecard) {
            return interaction.editReply("You are not clocked in.");
        }

        existingTimecard.timeOut = Date.now();
        await existingTimecard.save();

        const rp = await roleplay.findOne({}).sort({ timestamp: -1 });
        if (rp && rp.participants.clockedIn.some(entry => entry.userId === userId)) {
            rp.participants.clockedIn = rp.participants.clockedIn.filter(entry => entry.userId !== userId);
            rp.participants.attendance[existingTimecard.department] = rp.participants.attendance[existingTimecard.department].filter(id => id !== userId);
            await rp.save();
        }
        const roles = interaction.member.roles.cache.map(role => role.id);
        let roleScalar = 1;
        if (roles.includes(controls.roles.booster)) {
            roleScalar += 0.25;
        }
        if (roles.includes(controls.roles.staff)) {
            roleScalar -= 0.2;
        }
        let preworkDuration = existingTimecard.timeOut - existingTimecard.timeIn;
        let workDuration = preworkDuration * (user.scalar || 1) * (client.pbr.scalar || 1) * roleScalar;
        let masterActivity = await MasterActivity.findOne({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
        if (!masterActivity) {
            masterActivity = new MasterActivity({
                _id: new mongoose.Types.ObjectId(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                records: [],
            });
        }
        
        let record = masterActivity.leaderboard.find(r => r.user.toString() === user._id.toString());
        if (!record) {
            record = {
                user: user._id,
                totalTime: workDuration,
            };
            masterActivity.leaderboard.push(record);
        }
        record.totalTime += workDuration;
        await masterActivity.save();
        const hours = Math.floor(workDuration / (1000 * 60 * 60));
      const minutes = Math.floor((workDuration % (1000 * 60 * 60)) / (1000 * 60));
        
        const embed = new EmbedBuilder()
            .setTitle("Clocked Out")
            .setDescription(`You have successfully clocked out. You worked for ${hours} hours and ${minutes} minutes.`)
            .setColor("Red")
            .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
    }
};