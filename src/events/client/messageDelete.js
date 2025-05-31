const control = require("../../../control.json");
const ticketsDB = require("../../schemas/ticket");
module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    if (message.channel.parentId != control.channels.ticketParent) return;
    if (message.channel.id === "1366780366790332516") {
      let newMessage = {};
      newMessage.embeds = message.embeds;
      newMessage.components = message.components;
      newMessage.content = message.content;
      newMessage.attachments = message.attachments.map(
        (attachment) => attachment.url
      );
      newMessage.content = `This transcript was deleted by someone.`;
      message.channel.send(newMessage);
      return;
    }
    const ticket = await ticketsDB.findOne({
      channelId: message.channel.id,
    });
    if (!ticket) {
      console.log(`Ticket not found for channel ${message.channel.id}`);
      return;
    }
    const msg = ticket.messages.find((msg) => msg.id === message.id);
    if (msg) {
      msg.status = "deleted";
      ticket.markModified("messages");
      await ticket.save();
    } else {
      console.log(`Message with id ${message.id} not found in ticket.messages`);
    }
  },
};
