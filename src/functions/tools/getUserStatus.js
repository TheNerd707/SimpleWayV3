const control = require("../../../control.json");

module.exports = (client) => {
  client.getUserStatus = async (userId, server) => {
    try {
      const guild = await client.guilds.fetch(server);
      const user = await guild.members.fetch(userId);
      if (!user) throw new Error("User not found");
      const serverKey = Object.keys(control.servers).find(
        (key) => control.servers[key] === server
      );
      if (!serverKey) throw new Error("Server not found in control.json");

      const roles = user.roles.cache.map((role) => role.id);
      const isWhitelisted = roles.includes(control.serverSettings[serverKey].roles.whitelisted);
      const isStaff = roles.includes(control.serverSettings[serverKey].roles.staff);
      let status = false;
      if (isStaff) {
        status = "s"; // staff
      } else if (isWhitelisted) {
        status = "w"; // whitelisted
      } else {
        status = "u"; // unwhitelisted
      }

      return { status };
    } catch (error) {
      console.log("Error fetching user status:", error);
      return { error: "Failed to fetch user status" };
    }
  };
};
