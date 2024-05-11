const edit = require("edit-json-file");
let file = edit("storage.json");
module.exports = (client) => {
  client.ticketNumber = async () => {
    const oldNumber = file.get("ticket_number");
    const newNumber = oldNumber + 1;
    file.set("ticket_number", newNumber);
    file.save();
    return newNumber;
  };
};
