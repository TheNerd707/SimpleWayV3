const control = require("../../../control.json");
const ticketsDB = require("../../schemas/ticket");
module.exports = {
  name: "messageUpdate",
  async execute(old, message, client) {
    if (message.channel.parentId != control.serverSettings.pbr.channels.ticketParent) return;
    if (message.channel.id === control.serverSettings.pbr.channels.transcrips) return; // Ignore the transcript channel
    const ticket = await ticketsDB.findOne({
      channelId: message.channel.id,
    });
    if (!ticket) {
      console.log(`Ticket not found for channel ${message.channel.id}`);
      return;
    }
    const msg = ticket.messages.find((msg) => msg.id === message.id);
    if (msg) {
      if (msg.content.edited) {
        if (!Array.isArray(msg.content.moreEdits)) {
          msg.content.moreEdits = [];
        }
        msg.content.moreEdits.push(message.content);
      } else {
        msg.content = {
        original: msg.content,
        edited: message.content,
        };
      }
      console.log(message.content)
      console.log(msg)
      ticket.markModified("messages");
      await ticket.save();
    } else {
      console.log(`Message with id ${message.id} not found in ticket.messages`);
    }
  },
};
