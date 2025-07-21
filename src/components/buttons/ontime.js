const control = require("../../../control.json");

module.exports = {
  data: {
    name: 'ontime'
  },
  async execute(interaction, client) {
    const { member} = interaction;
    if (!client.pbr.cache.roleplayActive) {
      return interaction.reply({
        content: "There is no roleplay event in progress.",
        ephemeral: true,
      });
    }
    if (client.pbr.cache.players.onTime.includes(member.id)) {
      return interaction.reply({
        content: "You have already marked yourself as on time.",
        ephemeral: true,
      });
    }
    if (client.pbr.cache.players.late.hasOwnProperty(member.id)) {
      delete client.pbr.cache.players.late[member.id];
    }
    if (client.pbr.cache.players.notComing.includes(member.id)) {
      client.pbr.cache.players.notComing = client.pbr.cache.players.notComing.filter(id => id !== member.id);
    }

    client.pbr.cache.players.onTime.push(member.id);
    const embed = await client.roleplayHandler();
    const message = await client.channels.cache.get(control.channels.roleplay).messages.fetch(client.pbr.cache.message);
    await message.edit({ embeds: [embed] });
    await interaction.reply({
        content: "You have been marked as on time.",
        ephemeral: true,
    });
  }
};
