const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  dcToken: {
    type: Array,
    required: true,
  },
  dcId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  
});

module.exports = new model("User", userSchema, "user");
