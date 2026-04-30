const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String,
    default: "",
  },
  githubProjects: {
    type: Array,
    default: [],
  },
  linkedinProfile: {
    type: String,
    default: "",
  },
  careerData: {
    type: Object,
    default: {},
  },
  assessmentProgress: {
    type: Object,
    default: null,
  },
  pathProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
});

module.exports = mongoose.model("User", userSchema);