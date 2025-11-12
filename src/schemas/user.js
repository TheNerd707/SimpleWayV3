const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  dcToken: {
    type: Array,
  },
  dcId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  lastRP: {
    type: Number,
  },
});

module.exports = new model("User", userSchema, "user");
