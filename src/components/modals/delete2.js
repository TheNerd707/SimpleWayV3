const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: {
        name: `delete2`
    },
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        .setTitle("TICKET CLOSED")
        .addFields([
            {
                name: "Closed By",
                value: interaction.user.username, 
            },
            {
                name: "Reason",
                value: interaction.fields.getTextInputValue('delete3')
            }
        ]);
        interaction.reply({embeds: [embed]})
        interaction.guild.channels.edit(interaction.channel.id, {
            parent: interaction.guild.channels.cache.get("1201228376850059334"),
        })
        interaction.channel.lockPermissions()
    }
}