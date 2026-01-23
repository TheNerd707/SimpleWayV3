const express = require("express");
const router = express.Router();

const control = require("../../../control.json");

router.get("/", (req, res) => {
  res.send("PBR Staff Bot API");
});

module.exports = (client) => {
  // If client is needed, put it here, otherwise keep it outside
  router.post("/user", async (req, res) => {
    const discordID = req.body.discordID;
    if (!discordID) {
      return res.status(400).json({ error: "discordID is required" });
    }
    const user = await client.users.cache.get(discordID);
    if (!user) {
      // Try to fetch the user if not in cache
      client.users.fetch(discordID)
        .then(async fetchedUser => {
          const { status } = await client.getUserStatus(discordID, "1378628677771853834");
          return res.json({ name: fetchedUser.username, avatar: fetchedUser.displayAvatarURL(), status: status });
        })
        .catch(() => {
          console.log("User not found");
          return res.status(404).json({ error: "User not found" });
        });
      return;
    }

    const { status } = await client.getUserStatus(discordID, "1378628677771853834");
    return res.send({ name: user.username, avatar: user.displayAvatarURL(), status: status });
  });

  return router;
};
