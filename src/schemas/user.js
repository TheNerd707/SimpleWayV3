const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  token: { type: String, required: true, unique: true },
  discordToken: {
    type: Array,
  },
  discordID: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  lastRP: {
    type: Number,
  },
  clan: {
    type: String,
  },
  timecards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Timecard",
    },
  ],
  departments: {
    type: [String],
    default: [],
    enum: ["SASP", "LSSD", "SAFR", "LSPD", "CIV", "STAFF"]
  }
});

module.exports = new model("User", userSchema, "user");
