const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../../schemas/user");
const Timecard = require("../../../schemas/timecard");
const roleplay = require("../../../schemas/roleplays");
const MasterActivity = require("../../../schemas/masterActivity");
const controls = require("../../../../control.json");
const mongoose = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("force-clockout")
    .setDescription(
      "Clocks out all users who are currently clocked in or one user."
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to force clock out, leave blank for all.")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const targetUser = interaction.options.getUser("target");
    let usersToClockOut = [];

    const status = await client.getUserStatus(interaction.user.id, interaction.guildId);
    if (status.status !== "s" && status.status !== "ia") {
      return interaction.editReply(
        "You do not have permission to use this command."
      );
    }

    const rp = await roleplay.findOne({}).sort({ timestamp: -1 });

    if (targetUser) {
      const user = await User.findOne({ discordID: targetUser.id });
      if (user) {
        usersToClockOut.push(user);
      } else {
        return interaction.editReply("The specified user is not clocked in.");
      }
    } else {
      const timecards = await Timecard.find({ timeOut: { $exists: false } });
      const discordIDs = timecards.map((tc) => tc.discordID);
      usersToClockOut = await User.find({ discordID: { $in: discordIDs } });
    }

    if (usersToClockOut.length === 0) {
      return interaction.editReply("No users are currently clocked in.");
    }
    const masterActivity = await MasterActivity.findOne({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    if (!masterActivity) {
      return interaction.editReply("No activity records found for this month.");
    }
    for (const user of usersToClockOut) {
      const existingTimecard = await Timecard.findOne({
        discordID: user.discordID,
        timeOut: { $exists: false },
      });
      if (existingTimecard) {
        let userId = user.discordID
        if (
          rp &&
          rp.participants.clockedIn.some((entry) => entry.userId === userId)
        ) {
          rp.participants.clockedIn = rp.participants.clockedIn.filter(
            (entry) => entry.userId !== userId
          );
          rp.participants.attendance[existingTimecard.department] =
            rp.participants.attendance[existingTimecard.department].filter(
              (id) => id !== userId
            );
          await rp.save();
        }
        user.lastRP = Date.now();
        await user.save();
        existingTimecard.timeOut = Date.now();
        await existingTimecard.save();
        const roles = client.guilds.cache
          .get(interaction.guildId)
          .members.cache.get(user.discordID)
          .roles.cache.map((role) => role.id);
        let roleScalar = 1;
        if (roles.includes(controls.serverSettings.pbr.roles.management)) {
          roleScalar += 0.25;
        }
        if (roles.includes(controls.serverSettings.pbr.roles.staff)) {
          roleScalar -= 0.2;
        }
        let preworkDuration =
          existingTimecard.timeOut - existingTimecard.timeIn;
        let workDuration =
          preworkDuration *
          (user.scalar || 1) *
          (client.pbr?.scalar || 1) *
          roleScalar;
        let record = masterActivity.leaderboard.find(
          (r) => r.user.toString() === user._id.toString()
        );
        if (!record) {
          record = {
            user: user._id,
            totalTime: workDuration,
          };
          masterActivity.leaderboard.push(record);
        } else {
          record.totalTime += workDuration;
        }
      }
    }
    await masterActivity.save();

    return interaction.editReply(
      `Successfully clocked out ${usersToClockOut.length} user(s).`
    );
  },
};
