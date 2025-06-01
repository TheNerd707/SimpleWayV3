const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const ticketDB = require("../../schemas/ticket");
const control = require("../../../control.json");

module.exports = {
    data: {
        name: `delete2`
    },
    async execute(interaction, client) {
        const ticket = await ticketDB.findOne({
            channelId: interaction.channel.id
        });
        if (!ticket) {
            return await interaction.reply({
                content: "This is not a ticket, dumb",
                flags: 64
            });
        }
        await interaction.reply({
            content: "Deleting ticket...",
            flags: 64
        });
        const reason = interaction.fields.getTextInputValue("delete3");
        ticket.closedReason = reason;
        ticket.closedAt = new Date();
        ticket.closedBy = interaction.user.id;
        await ticket.save();

        channel = await client.channels.fetch(ticket.channelId);
        await channel.delete();
        const user = await client.users.fetch(ticket.userId);
        const url = `https://projectblackrose.org/tickets/${ticket.channelId}`
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Ticket Closed")
            .setDescription(`Ticket closed by <@${interaction.user.id}> for reason: ${reason}`)
            .setTimestamp();
        const button = new ButtonBuilder()
            .setLabel("View Ticket")
            .setURL(url)
            .setStyle(ButtonStyle.Link);
        const logChannel = client.channels.cache.get(control.channels.transcrips);
        await logChannel.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(button)]
        });
        await user.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(button)]
        });
}}