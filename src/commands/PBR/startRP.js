const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const control = require("../../../control.json");
const roleplay = require(`./../../schemas/roleplays`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startrp')
        .setDescription('Starts a new roleplay session.'),
    async execute(interaction, client) {
        const rp = await roleplay.findOne({}).sort({ timestamp: -1 });
        const message1 = 'The roleplay session has started!';
        const message2 = 'Can I join?';

        // 90% chance to use message1, 10% chance to use message2
        const message = Math.random() < 0.9 ? message1 : message2;

        await interaction.reply({
            content: message,
            ephemeral: true,
        });

        const channel = client.channels.cache.get(control.channels.roleplay);

        channel.send({
            content: `@everyone \n\nDM <@${interaction.user.id}> on xbox for an invite!`
        });

        let dataMessage = '**ROLEPLAY DATA** \n\n' +
            `**Started by:** <@${interaction.user.id}>\n\n` +
            '**On Time:**\n';

        for (const playerId of rp.participants.ontime) {
            dataMessage += `<@${playerId}>\n`;
        }
        dataMessage += '\n**Late:**\n';
        for (const late of rp.participants.late) {
            const playerId = late.userId;
            const time = late.time;
            dataMessage += `<@${playerId}> - ${time}\n`;
        }
        dataMessage += '\n**Not Coming:**\n';
        for (const playerId of rp.participants.absent) {
            dataMessage += `<@${playerId}>\n`;
        }

        const staffChannel = client.channels.cache.get(control.channels.staff);

        staffChannel.send({
            content: dataMessage
        });
        rp.status = "ongoing";
        await rp.save();
    },
};