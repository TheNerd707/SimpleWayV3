const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = (client) => {
    client.sendApp = async () => {
        const channel = await client.channels.fetch("1194283161279004713");
        const embed = new EmbedBuilder()
            .setTitle("Join Us!")
            .setDescription("Click the button bellow if you wish to join our community!")
            .setColor("#fc1703");
        const button = new ButtonBuilder()
            .setCustomId("apply")
            .setLabel("Apply")
            .setStyle(ButtonStyle.Danger);
        channel.send({
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(button)]
        })
    }
}