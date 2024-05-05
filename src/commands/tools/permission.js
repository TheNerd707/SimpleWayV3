const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("permission")
    .setDescription("This command reqrires specal perms.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const { roles } = interaction.member;
    const role = await interaction.guild.roles
      .fetch("1091746373709332591")
      .catch(console.error);

    const testRole = await interaction.guild.roles
      .create({
        name: `Test`,
        permissions: [PermissionsBitField.Flags.KickMembers],
      })
      .catch(console.error);

    if (roles.cache.has("1091746373709332591")) {
      await interaction.deferReply({
        fetchReply: true,
      });

      await roles.remove(role).catch(console.error);
      await interaction.editReply({
        content: `Removed ${role.name} role from you.`,
      });
    } else {
      await interaction.reply({
        content: `You dont have the role`,
      });
    }

    await roles.add(testRole).catch(console.error);

    await testRole
      .setPermissions([PermissionsBitField.Flags.BanMembers])
      .catch(console.error);

    const channel = await interaction.guild.channels.create({
      name: `test`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: testRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        },
      ],
    });
  },
};
