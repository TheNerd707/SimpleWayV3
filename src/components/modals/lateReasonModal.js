const control = require("../../../control.json");

module.exports = {
    data: {
        name: 'lateReasonModal'
    },
    async execute(interaction, client) {
        const { member } = interaction;
        const time = interaction.fields.getTextInputValue('time');

        // Mark the user as late and store the time
        client.pbr.cache.players.late[member.id] = time;

        await interaction.reply({
            content: `You have been marked as late. Expected arrival time: **${time}**.`,
            ephemeral: true,
        });

        // Update the roleplay message
        const embed = await client.roleplayHandler();
        const message = await client.channels.cache.get(control.channels.roleplay).messages.fetch(client.pbr.cache.message);
        await message.edit({ embeds: [embed] });
    }
};
