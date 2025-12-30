const control = require("../../../control.json");
const rpschema = require('../../schemas/roleplays.js');

module.exports = {
    data: {
        name: 'notcoming'
    },
    async execute(interaction, client) {
        const { member } = interaction;
        const rp = await rpschema.findOne({}).sort({ timestamp: -1 });

        if (!rp) {
            return interaction.reply({
                content: "There is no roleplay event in progress.",
                ephemeral: true,
            });
        }
        if (rp.participants.absent.includes(member.id)) {
            return interaction.reply({
                content: "You have already marked yourself as not coming.",
                ephemeral: true,
            });
        }
        // Remove from ontime if present
        if (rp.participants.ontime.includes(member.id)) {
            rp.participants.ontime = rp.participants.ontime.filter(id => id !== member.id);
        }
        // Remove from late if present
        rp.participants.late = rp.participants.late.filter(late => late.userId !== member.id);

        rp.participants.absent.push(member.id);
        console.log(rp.participants);
        await rp.save();
        const embed = await client.roleplayHandler(rp._id);

        const message = await client.channels.cache.get(control.serverSettings.pbr.channels.roleplay).messages.fetch(rp.messageId);
        
        
        await message.edit({ embeds: [embed] });
        await interaction.reply({
            content: "You have been marked as not coming.",
            ephemeral: true,
        });
    }
};