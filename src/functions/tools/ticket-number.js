const edit = require("edit-json-file");
let file = edit("storage.json");

module.exports = (client) => {
  client.ticketNumber = async () => {
    if (process.env.NODE_ENV === "dev") {
      return Math.floor(Math.random() * 1000000000) + 1; // For development, return a random number
    }
    const oldNumber = file.get("ticket_number");
    const newNumber = oldNumber + 1;
    file.set("ticket_number", newNumber);
    file.save();
    return newNumber;
  };
};
