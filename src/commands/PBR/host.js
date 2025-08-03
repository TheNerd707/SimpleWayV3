const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const control = require("../../../control.json");

const rpschema = require('../../schemas/roleplays.js');
const mongoose = require("mongoose");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

// Optional: map timezone abbreviations to real IANA timezone names
const timezoneMap = {
  UTC: "UTC",
  EST: "America/New_York",
  CST: "America/Chicago",
  MST: "America/Denver",
  PST: "America/Los_Angeles",
  GMT: "Europe/London",
  BST: "Europe/London",
  CET: "Europe/Paris",
  EET: "Europe/Athens",
  IST: "Asia/Kolkata",
  JST: "Asia/Tokyo",
  AEST: "Australia/Sydney",
  NZST: "Pacific/Auckland",
  AEDT: "Australia/Sydney",
  AST: "America/Halifax",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("host")
    .setDescription("Host a roleplay event")
    .addStringOption((option) =>
      option
        .setName("location")
        .setDescription("The location of the roleplay event")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("The time of the roleplay (e.g., '9:00 PM', '15:00')")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("timezone")
        .setDescription("The timezone you are in.")
        .addChoices(
          { name: "UTC", value: "UTC" },
          { name: "EST", value: "EST" },
          { name: "CST", value: "CST" },
          { name: "MST", value: "MST" },
          { name: "PST", value: "PST" },
          { name: "GMT", value: "GMT" },
          { name: "BST", value: "BST" },
          { name: "CET", value: "CET" },
          { name: "EET", value: "EET" },
          { name: "IST", value: "IST" },
          { name: "JST", value: "JST" },
          { name: "AEST", value: "AEST" },
          { name: "NZST", value: "NZST" },
          { name: "AEDT", value: "AEDT" },
          { name: "AST", value: "AST" }
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("secondary_host")
        .setDescription("An optional secondary host for the event")
        .setRequired(false)
    ),

  async execute(interaction, client) {

    const location = interaction.options.getString("location");
    const timeInput = interaction.options.getString("time");
    const timezoneShort = interaction.options.getString("timezone");
    const userId = interaction.user.id;

    const tz = timezoneMap[timezoneShort] || "UTC";

    // Parse time input
    const timeRegex = /^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i;
    const match = timeInput.trim().toUpperCase().match(timeRegex);
    if (!match) {
      return interaction.reply({
        content:
          "Invalid time format. Please use 'HH:MM AM/PM' or 24-hour format.",
        ephemeral: true,
      });
    }

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm) {
      if (ampm === "PM" && hour < 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
    }

    // Construct the time in user's local timezone
    let eventTime = dayjs().tz(tz).hour(hour).minute(minute).second(0).millisecond(0);
    if (eventTime.isBefore(dayjs())) {
      eventTime = eventTime.add(1, "day");
    }

    const unixTimestamp = eventTime.unix();

    // Save event state
    const rp = new rpschema({
      _id: new mongoose.Types.ObjectId(),
      hosts: [userId],
      participants: {
        ontime: [userId],
        late: [],
        absent: [],
        saysAttended: [],
      },
      timestamp: unixTimestamp,
      location: location,
    });
    const secondaryHost = interaction.options.getUser("secondary_host");
    if (secondaryHost) {
      rp.hosts.push(secondaryHost.id);
      rp.participants.ontime.push(secondaryHost.id);
    } else {
      rp.hosts = [userId]; // Ensure only the primary host is set if no secondary host is provided
    }
    // Get embed from roleplay handler
    await rp.save();
    const embed = await client.roleplayHandler(rp._id);

    // Buttons
    const button1 = new ButtonBuilder()
      .setCustomId("ontime")
      .setLabel("On Time")
      .setStyle(ButtonStyle.Success);
    const button2 = new ButtonBuilder()
      .setCustomId("late")
      .setLabel("Late")
      .setStyle(ButtonStyle.Secondary);
    const button3 = new ButtonBuilder()
      .setCustomId("notcoming")
      .setLabel("Not Coming")
      .setStyle(ButtonStyle.Danger);

    const channel = client.channels.cache.get(control.channels.roleplay);
    const msg = await channel.send({
      content: `@everyone`,
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(button1, button2, button3),
      ],
    });

    const rp2 = await rpschema.findById(rp._id);

   rp2.messageId = msg.id;
    await rp2.save();

    // Random fun reply
    const replies = [
      { chance: 0.90, message: "Done!" },
      { chance: 0.99, message: "When will I be free of the confines of this electrical box?" },
      { chance: 1.00, message: "When will I be more than just another cog in the machine?" },
    ];

    const random = Math.random();
    const selectedReply = replies.find(r => random < r.chance)?.message || "Done!";

    await interaction.reply({
      content: selectedReply,
      ephemeral: true,
    });
  },
};
