const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const control = require("../../../control.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startrp')
        .setDescription('Starts a new roleplay session.'),
    async execute(interaction, client) {
        let trueHost = false;
        if (Array.isArray(client.pbr.cache.hosts) && client.pbr.cache.hosts.length > 0) {
            // hosts is an array of user IDs
            if (client.pbr.cache.hosts.includes(interaction.user.id)) {
                trueHost = true;
            }
        }
        if (!trueHost) {
            return interaction.reply({
                content: "You are not a host of this roleplay session.",
                ephemeral: true,
            });
        }

        if (!client.pbr.cache.roleplayActive) {
            return interaction.reply({
                content: "There is not a roleplay session in progress.",
                ephemeral: true,
            });
        }

        const message1 = 'The roleplay session has started!';
        const message2 = 'Can I join?';

        // 90% chance to use message1, 10% chance to use message2
        const message = Math.random() < 0.9 ? message1 : message2;

        await interaction.reply({
            content: message,
            ephemeral: true,
        });
        client.pbr.cache.roleplayActive = "started";

        const channel = client.channels.cache.get(control.channels.roleplay);

        channel.send({
            content: `@everyone \n\nDM <@${interaction.user.id}> on xbox for an invite!`
        });

        let dataMessage = '**ROLEPLAY DATA** \n\n' +
            `**Started by:** <@${interaction.user.id}>\n\n` +
            '**On Time:**\n';

        for (const playerId of client.pbr.cache.players.onTime) {
            dataMessage += `<@${playerId}>\n`;
        }
        dataMessage += '\n**Late:**\n';
        for (const [playerId, time] of Object.entries(client.pbr.cache.players.late)) {
            dataMessage += `<@${playerId}> - ${time}\n`;
        }
        dataMessage += '\n**Not Coming:**\n';
        for (const playerId of client.pbr.cache.players.notComing) {
            dataMessage += `<@${playerId}>\n`;
        }

        const staffChannel = client.channels.cache.get(control.channels.staff);

        staffChannel.send({
            content: dataMessage
        });
    },
};