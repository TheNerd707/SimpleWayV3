const control = require('../../../control.json');
const ticketsDB = require('../../schemas/ticket');
module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.channel.parentId === "1194131359657107456") {
            client.applicationHandler(message)
            return;
        }
        if (message.channel.parentId != control.channels.ticketParent) return;
        if (message.channel.id === "1366780366790332516") return;
        const ticket = await ticketsDB.findOne({
            channelId: message.channel.id,
        });
        if (!ticket) {
            console.log(`Ticket not found for channel ${message.channel.id}`);
            return;
        };
        ticket.messages.push({
            type: "user",
            author: message.author.id,
            id: message.id,
            content: message.content,
            attachments: message.attachments.map((attachment) => attachment.url),
            createdAt: message.createdAt,
            status: "active",
        })
        await ticket.save();
    }
}