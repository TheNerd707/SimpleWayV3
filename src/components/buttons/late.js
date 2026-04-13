const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const control = require("../../../control.json");
const rpschema = require('../../schemas/roleplays.js');

module.exports = {
    data: {
        name: 'late'
    },
    async execute(interaction, client) {
        interaction.deferReply({ ephemeral: true });
        const { member } = interaction;
       const rp = await rpschema.findOne({}).sort({ timestamp: -1 });
        if (!rp) {
            return interaction.editReply({
                content: "There is no roleplay event in progress.",
                ephemeral: true,
            });
        }
        for (const late of rp.participants.late) {
            if (late.userId === member.id) {
                return interaction.editReply({
                    content: "You have already marked yourself as late.",
                    ephemeral: true,
                });
            }
        }
        if (rp.participants.ontime.includes(member.id)) {
            rp.participants.ontime = rp.participants.ontime.filter(id => id !== member.id);
        }
        if (rp.participants.absent.includes(member.id)) {
            rp.participants.absent = rp.participants.absent.filter(id => id !== member.id);
        }
        await rp.save();

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