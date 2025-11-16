const { Schema, model } = require("mongoose");

const timecardSchema = new Schema({
  _id: Schema.Types.ObjectId,
  discordID: {
    type: String,
    required: true,
  },
  timeIn: {
    type: Number,
    required: true,
  },
  timeOut: {
    type: Number,
  },
  department: {
    type: String,
  },
});

module.exports = model("Timecard", timecardSchema, "timecard");