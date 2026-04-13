const control = require("../../../control.json");
const rpschema = require('../../schemas/roleplays.js');
module.exports = {
  data: {
    name: 'ontime'
  },
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const member = interaction.member;
    const rp = await rpschema.findOne({}).sort({ timestamp: -1 });
    if (!rp) {
      return interaction.editReply({
        content: "There is no roleplay event in progress.",
        ephemeral: true,
      });
    }
    if (rp.participants.ontime.includes(member.id)) {
      return interaction.editReply({
        content: "You have already marked yourself as on time.",
        ephemeral: true,
      });
    }
    // Remove member from late if present
    rp.participants.late = rp.participants.late.filter(late => late.userId !== member.id);


    // Remove member from absent if present
    if (rp.participants.absent.includes(member.id)) {
      rp.participants.absent = rp.participants.absent.filter(id => id !== member.id);
    }
    // Add member to ontime if not already present
    if (!rp.participants.ontime.includes(member.id)) {
      rp.participants.ontime.push(member.id);
    }
    await rp.save();
    const embed = await client.roleplayHandler(rp._id);
    const message = await client.channels.cache.get(control.serverSettings.pbr.channels.roleplay).messages.fetch(rp.messageId);
    await message.edit({ embeds: [embed] });
    await interaction.editReply({
        content: "You have been marked as on time.",
        ephemeral: true,
    });
  }
};
