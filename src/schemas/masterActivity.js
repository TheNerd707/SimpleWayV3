const { Schema, model, ModifiedPathsSnapshot } = require("mongoose");

const masterActivitySchema = new Schema({
  _id: Schema.Types.ObjectId,
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  leaderboard: [
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        totalTime: { type: Number, required: true, default: 0 },
    }
  ]
});

module.exports = new model("MasterActivity", masterActivitySchema, "masterActivity");