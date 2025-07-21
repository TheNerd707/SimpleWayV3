const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const control = require("../../../control.json");

module.exports = {
    data: {
        name: 'late'
    },
    async execute(interaction, client) {
        const { member } = interaction;
        if (!client.pbr.cache.roleplayActive) {
            return interaction.reply({
                content: "There is no roleplay event in progress.",
                ephemeral: true,
            });
        }
        if (client.pbr.cache.players.late.hasOwnProperty(member.id)) {
            return interaction.reply({
                content: "You have already marked yourself as late.",
                ephemeral: true,
            });
        }
        if (client.pbr.cache.players.onTime.includes(member.id)) {
            client.pbr.cache.players.onTime = client.pbr.cache.players.onTime.filter(id => id !== member.id);
        }
        if (client.pbr.cache.players.notComing.includes(member.id)) {
            client.pbr.cache.players.notComing = client.pbr.cache.players.notComing.filter(id => id !== member.id);
        }

        // Show modal to ask for reason
        const modal = new ModalBuilder()
            .setCustomId('lateReasonModal')
            .setTitle('Mark as Late');

        const timeInput = new TextInputBuilder()
            .setCustomId('time')
            .setLabel('What time will you be arriving (timezone)?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(timeInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
    }
};