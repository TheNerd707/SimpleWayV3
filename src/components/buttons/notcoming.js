const control = require("../../../control.json");

module.exports = {
    data: {
        name: 'notcoming'
    },
    async execute(interaction, client) {
        const { member } = interaction;
        if (!client.pbr.cache.roleplayActive) {
            return interaction.reply({
                content: "There is no roleplay event in progress.",
                ephemeral: true,
            });
        }
        if (client.pbr.cache.players.notComing.includes(member.id)) {
            return interaction.reply({
                content: "You have already marked yourself as not coming.",
                ephemeral: true,
            });
        }
        // Remove from onTime if present
        if (client.pbr.cache.players.onTime.includes(member.id)) {
            client.pbr.cache.players.onTime = client.pbr.cache.players.onTime.filter(id => id !== member.id);
        }
        // Remove from late if present
        if (client.pbr.cache.players.late.hasOwnProperty(member.id)) {
            delete client.pbr.cache.players.late[member.id];
        }

        client.pbr.cache.players.notComing.push(member.id);
        const embed = await client.roleplayHandler();
        const message = await client.channels.cache.get(control.channels.roleplay).messages.fetch(client.pbr.cache.message);
        await message.edit({ embeds: [embed] });
        await interaction.reply({
            content: "You have been marked as not coming.",
            ephemeral: true,
        });
    }
};