const { WebhookClient, EmbedBuilder } = require('discord.js')
const chalk = require("chalk");
module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        const role = member.guild.roles.cache.get("1194131855323185226")
        const perClunk = new EmbedBuilder()
        .setColor("#fc1703")
        .setTitle("Welcome to Project Black Rose!")
        .setDescription(`<@${member.user.id}>\nMake sure to check out <#1194767732592353321> and <#1194283161279004713>`);
    member.roles.add(role);   
    const web = new WebhookClient({ url: "https://discord.com/api/webhooks/1203593012588847144/b2-95y-kWqeQjXIWsdWkdJeyD5lmHD7RhAtAaNaCY--sCKpghi2KPejo7glIy6Iaec1K"})
    web.send({embeds: [perClunk]})
    
}
}