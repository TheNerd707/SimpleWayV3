const {
  SlashCommandBuilder,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const control = require("../../../control.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transcripts")
    .setDescription("View the transctipt of a ticket.")
    .addStringOption((option) =>
      option
        .setName("ticket-id")
        .setDescription("The ID of the ticket to view the transcript for.")
    )
    .addStringOption((option) =>
      option
        .setName("ticket-number")
        .setDescription("The channel of the ticket to view the transcript for.")
    ),
  async execute(interaction, client) {
    const guild = await client.guilds.fetch(interaction.guildId);
    if (guild.id === control.guild.id)
      return interaction.reply({
        content: "This command is not available in this server.",
        ephemeral: true,
      });
    const ticketId = interaction.options.getString("ticket-id");
    const ticketNumber = interaction.options.getString("ticket-number");

    if (!ticketId && !ticketNumber) {
      return interaction.reply({
        content: "Please provide either a ticket ID or a ticket number.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const ticketsDB = require("../../schemas/ticket");
    let ticket;

    if (ticketId) {
      ticket = await ticketsDB.findOne({ channelId: ticketId });
    } else if (ticketNumber) {
      ticket = await ticketsDB.findOne({ ticketNumber: ticketNumber });
    }

    if (!ticket) {
      return interaction.editReply({
        content: "Ticket not found.",
        ephemeral: true,
      });
    }

    const transcriptsChannel = await guild.channels.create({
      name: `transcripts-${ticket.ticketNumber}`,
      type: ChannelType.GuildText,
      parent: guild.channels.cache.get("1378794213822431292"), // Replace with your transcripts category ID
    });

    for (const message of ticket.messages) {
      // Handle message.content being a string or a nested object with edits
      let msgContent = "";
      let allEdits = [];

      function extractEdits(content) {
        if (typeof content === "string") {
          allEdits.push(content);
        } else if (typeof content === "object" && content !== null) {
          // If there's an 'original', go deeper
          if (content.original !== undefined) {
            extractEdits(content.original);
          }
          // If there's an 'edited', add it
          if (content.edited !== undefined && content.edited !== null) {
            extractEdits(content.edited);
          }
          // If there's an 'editedAgain', add it
          if (
            content.editedAgain !== undefined &&
            content.editedAgain !== null
          ) {
            extractEdits(content.editedAgain);
          }
          // If there's an 'edits' array, add all
          if (Array.isArray(content.edits)) {
            for (const edit of content.edits) {
              extractEdits(edit);
            }
          }
        }
      }

      extractEdits(message.content);

      if (allEdits.length === 1) {
        msgContent = allEdits[0];
      } else if (allEdits.length > 1) {
        msgContent = allEdits
          .map((edit, idx) =>
            idx === 0 ? `Original: ${edit}` : `Edit ${idx}: ${edit}`
          )
          .join("\n");
      } else {
        msgContent = "";
      }
      const attachments = message.attachments.map((att) => att.url).join("\n");
      const author = client.users.cache.get(message.author) || {
        username: "Unknown",
        avatarURL: () => null,
      };
      if (!author) continue; // Skip if author is not found
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${author.username} (${message.author})`,
          iconURL: author.avatarURL(),
        })
        .setDescription(msgContent)
        .setTimestamp(new Date(message.createdAt)) // message.createdAt is already in ISO format
        .setFooter({
          text: `Message ID: ${message.id}`,
        });

      await transcriptsChannel.send({
        content: attachments ? `${attachments}` : "",
        embeds: [embed],
      });
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait half a second between each message
    }

    return interaction.editReply({
      content: `Transcript for Ticket ${ticket.ticketNumber} has been created in <#${transcriptsChannel.id}>.`,
      ephemeral: true,
    });
  },
};
