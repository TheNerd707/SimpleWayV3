const control = require("../../../control.json");
const rpschema = require('../../schemas/roleplays.js');
module.exports = {
    data: {
        name: 'lateReasonModal'
    },
    async execute(interaction, client) {
        const { member } = interaction;
        const time = interaction.fields.getTextInputValue('time');
        const rp = await rpschema.findOne({}).sort({ timestamp: -1 });

        // Mark the user as late and store the time
        rp.participants.late.push({
            userId: member.id,
            time: time
        });
        await rp.save();

        await interaction.reply({
            content: `You have been marked as late. Expected arrival time: **${time}**.`,
            ephemeral: true,
        });

        // Update the roleplay message
        const embed = await client.roleplayHandler(rp._id);
        const message = await client.channels.cache.get(control.channels.roleplay).messages.fetch(rp.messageId);
        await message.edit({ embeds: [embed] });
    }
};
