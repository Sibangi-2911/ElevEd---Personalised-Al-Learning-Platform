const mongoose = require("mongoose");

const CareerProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  resumeText: String,
  linkedinUrl: String,
  githubUsername: String,
  careerPaths: Array,
  tasks: Array,
  recommendedCourses: Array,
  employabilityScore: Number,
});

module.exports = mongoose.model("CareerProfile", CareerProfileSchema);