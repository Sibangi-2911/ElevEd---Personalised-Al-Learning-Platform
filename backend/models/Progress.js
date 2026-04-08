const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  email: String,
  solvedChallenges: [Number],
  stats: {
    streak: Number,
    solved: Number,
    xpEarned: Number,
    rank: Number,
    lastSolvedDate: String,
  },
});

module.exports = mongoose.model("Progress", progressSchema);