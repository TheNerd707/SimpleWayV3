const ticketDB = require('../../schemas/ticket')

module.exports = (client) => {
  client.ticketNumber = async () => {
    const tickets = await ticketDB.find({}).sort({ ticketNumber: -1 }).limit(1);
    if (tickets.length === 0) {
      return 1; // If no tickets exist, start with ticket number 1
    }
    return tickets[0].ticketNumber + 1; // Increment the highest ticket number by 1
  };

};
