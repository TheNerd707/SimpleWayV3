const chalk = require("chalk");
const express = require("express");

module.exports = (app, client) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Importing routes
  const apiRouter = require("./routes/api")(client);
  app.listen(3010, () => {
    console.log(chalk.green("[Server Status]: Online on port 3010"));
  });

  app.get("/", (req, res) => {
    res.send("PBR Staff Bot API");
  });

  app.use("/api", apiRouter);
};
