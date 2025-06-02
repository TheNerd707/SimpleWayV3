const { EmbedBuilder } = require("discord.js");
const applicationDB = require("../../schemas/applications");

const preamble = new EmbedBuilder()
  .setTitle("Before we start")
  .setDescription(
    "Project Black Rose uses an automated proccess to make sure that applicants do not have to spend time answering simple questions during their interview. Please make sure to keep all responces to __**one**__ message. Don't worry, you are permited to edit the message to add more information if needed at any point."
  );
const question1 = new EmbedBuilder()
  .setTitle("Question 1")
  .setDescription(
    "What is the birthdate listed on your goverment issued identification?"
  )
  .setFooter({
    text: "please note: this will NOT be shared with anyone other than PBR Staff, ~900,000 people share the exact same birthday as you, and your age does NOT guarantee rejection or approval.",
  });
const question2 = new EmbedBuilder()
  .setTitle("Question 2")
  .setDescription("What is your Xbox username?");
const question3 = new EmbedBuilder()
  .setTitle("Question 3")
  .setDescription(
    "Have you ever been a member of Project Black Rose? If so, when? "
  )
  .setFooter({ text: "Remember to keep responces to one message." });
const question4 = new EmbedBuilder()
  .setTitle("Question 4")
  .setDescription(
    "What timezone are you located in? Make sure to not use the acronym and completely spell out the timezone."
  );
const question5 = new EmbedBuilder()
  .setTitle("Question 5")
  .setDescription(
    "Which of the following departments are you most interested in? "
  )
  .setFooter({
    text: "Civilian Department, San Andreas State Police, Los Santos Sheriff's Department, or San Andreas Fire & Rescue",
  });
const finish = new EmbedBuilder()
  .setTitle("Thank you!")
  .setDescription(
    "Your answers have been submited. Please wait while a member of our applicants department reviews your answers. Information about your interview will be sent in this channel."
  );
module.exports = (client) => {
  client.applicationHandler = async (message) => {
    const { channel, author, content } = message;
    const ticket = await applicationDB.findOne({ channelId: channel.id });
    if (!ticket) return;
    ticket.messages.push({
      user: author.id,
      message: content,
      time: new Date(),
      id: message.id,
    });
    if (ticket.status === "rules") {
      if (
        content.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "") !=
        "i have read the rules and i agree to follow them"
      ) {
        ticket.tries = (ticket.tries || 0) + 1;
        if (ticket.tries < 4) {
          message.reply(
            "Please try again, make sure to check spelling and spacing."
          );
        } else {
            // Attach a file with the reply
            message.reply({
            content: "I understand that hooman intelligence is limited; however, this is not that difficult."
            });
        }
        ticket.save();
        return;
      } else {
        channel.send({
          embeds: [preamble, question1],
        });

        ticket.status = "1";
        ticket.messages.push({
            user: "ADMIN",
            compleation: "0",
        })
        ticket.save();
        return;
      }
    } else if (ticket.status === "1") {
      channel.send({
        embeds: [question2],
      });
      ticket.status = "2";
      ticket.messages.push({
            user: "ADMIN",
            compleation: "1",
        })
        ticket.save();
      return;
    } else if (ticket.status === "2") {
      channel.send({
        embeds: [question3],
      });
      ticket.status = "3";
      ticket.messages.push({
            user: "ADMIN",
            compleation: "2",
        })
        ticket.save();
      return;
    } else if (ticket.status === "3") {
      channel.send({
        embeds: [question4],
      });
      ticket.status = "4";
      ticket.messages.push({
            user: "ADMIN",
            compleation: "3",
        })
        ticket.save();
      return;
    } else if (ticket.status === "4") {
      channel.send({
        embeds: [question5],
      });
      ticket.status = "5";
      ticket.messages.push({
            user: "ADMIN",
            compleation: "4",
        })
        ticket.save();
      return;
    } else if (ticket.status === "5") {
      channel.send({
        embeds: [finish],
      });
      ticket.status = "Awaiting Review";
      ticket.messages.push({
            user: "ADMIN",
            compleation: "5",
        })
        ticket.save();
    } else {
        ticket.save();
        return;
    }
  };
};
