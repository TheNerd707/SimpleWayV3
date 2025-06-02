const { WebhookClient, EmbedBuilder } = require('discord.js')
const chalk = require("chalk");
const control = require("../../../control.json");
module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        if (member.guild.id != control.guild.id) return;

        const role = member.guild.roles.cache.get(control.roles.unwhitelisted);
        member.roles.add(role);
        const perClunk = new EmbedBuilder()
        .setColor("#fc1703")
        .setTitle("Welcome to Project Black Rose!")
        .setDescription(`<@${member.user.id}>\nMake sure to check out <#1194767732592353321> and <#1194283161279004713>`);
    
        const channel = member.guild.channels.cache.get(control.channels.welcome);
        const webhook = await channel.fetchWebhooks()
        
        if (webhook.size === 0) {
            const newWebhook = await channel.createWebhook({
                name: 'PBR | Project Black Rose',
                avatar: 'https://cdn.discordapp.com/attachments/1052328721882816523/1236165364975407165/64117E29-FAD8-4EE8-BFFC-5E214D9190E4.png?ex=6812f1b5&is=6811a035&hm=322fc9318a78d534b56693de4f7a722f8c64c23197edd14e93ce41afdef212b3&',
            });
            await newWebhook.send({ embeds: [perClunk] });
        } else {
            const existingWebhook = webhook.first();
            await existingWebhook.send({ embeds: [perClunk], username: 'PBR | Project Black Rose', avatarURL: 'https://cdn.discordapp.com/attachments/1052328721882816523/1236165364975407165/64117E29-FAD8-4EE8-BFFC-5E214D9190E4.png?ex=6812f1b5&is=6811a035&hm=322fc9318a78d534b56693de4f7a722f8c64c23197edd14e93ce41afdef212b3&' });
        }
    
}
}