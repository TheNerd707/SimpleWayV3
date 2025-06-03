const express = require("express");
const path = require("path");
const userDB = require("../schemas/user");

const mongoose = require("mongoose");

const { request } = require("undici");

async function dcLoging(code) {
  try {
    const tokenResponseData = await request(
      "https://discord.com/api/oauth2/token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: process.env.clientId,
          client_secret: process.env.clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: "http://localhost:3000/o-auth/",
          scope: "identify email guilds",
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const tokenResponse = await tokenResponseData.body.json();

    const userResponseData = await request(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `${tokenResponse.token_type} ${tokenResponse.access_token}`,
        },
      }
    );
    const userResponse = await userResponseData.body.json();

    let user = await userDB.findOne({ dcId: userResponse.id });
    if (!user) {
      user = new userDB({
        _id: new mongoose.Types.ObjectId(),
        dcToken: tokenResponse,
        dcId: userResponse.id,
        email: userResponse.email,
      });
      await user.save();
    } else {
      user.dcToken = tokenResponse;
      await user.save();
    }
    return user._id.toString();
  } catch (error) {
    console.error("Error during Discord login:", error);
    throw error;
  }
}

module.exports = (app, client) => {
  app.use("/public", express.static(path.join(__dirname, "public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  /* app.get("/", async (req, res) => {
    const { cookie } = req.query;
    if (cookie === "required") {
      res.render("index", { cookie: true });
      return;
    }
    res.render("index", { cookie: false });
  });
  app.get("/about", (req, res) => {
    res.render("about");
  });
  app.get("/o-auth", async (req, res) => {
    if (req.query.code) {
      const id = await dcLoging(req.query.code);
      res.cookie("id", id, {
        maxAge: 14 * 7 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "Strict",
      });
      req.session.userId = id;
      await new Promise((resolve) => setTimeout(resolve, 500));
      res.redirect("/members");
    } else {
      res.redirect(
        `https://discord.com/oauth2/authorize?client_id=1190867838735483022&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fo-auth%2F&scope=identify+guilds+email`
      );
    }
  });
  app.get("/members", async (req, res) => {
    const cCookie = req.cookies.cookieConsent;
    if (cCookie !== "accepted") {
      return res.redirect("/?cookie=required");
    }
    const userId = req.session.userId || req.cookies.id;
    if (!userId || userId === "undefined") {
      return res.redirect("/o-auth");
    }

    const user = await userDB.findById(userId);
    if (!user) {
      return res.redirect("/o-auth");
    }

    const guild = await client.guilds.fetch(control.guild.id);
    let botAuth = {};
    try {
      const member = await guild.members.fetch(user.dcId);
      if (member) {
        const roles =
          member.roles && member.roles.cache
            ? member.roles.cache.map((role) => role.id)
            : [];
        botAuth = {
          status: "success",
          auth: roles,
        };
      }
    } catch (error) {
      botAuth = {
        status: "error",
        message: "Member not found",
        auth: [],
      };
    }

    if (botAuth.status !== "success") {
      return res.redirect("/no-auth");
    }

    res.send(
      `You are logged in ${user.dcId}${
        req.session.userId ? "" : " (from cookie)"
      } ${botAuth.auth}`
    );
  });

  app.get("/test", async (req, res) => {
    res.render("defalt");
  });

  app.use((req, res, next) => {
    res.status(404).render("not-found");
  });
  */
  app.get("/.well-known/microsoft-identity-association.json", (req, res) => {
    res.json({
      associatedApplications: [
        {
          applicationId: "7f0e2e0a-29b0-43a0-8346-0720613cfb2e",
        },
      ],
    });
  });
};
