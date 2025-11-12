const control = require("../../../control.json");

module.exports = (client) => {
  client.getUserStatus = async (userId) => {
    try {
      const guild = await client.guilds.fetch(control.guild.id);
      const user = await guild.members.fetch(userId);
      if (!user) throw new Error("User not found");

      const roles = user.roles.cache.map((role) => role.id);
      const isWhitelisted = roles.includes(control.roles.whitelisted);
      const isStaff = roles.includes(control.roles.staff);

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
