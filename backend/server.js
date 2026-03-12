const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* Learning Style AI */

app.post("/api/learning-style", (req, res) => {
  const { score } = req.body;

  let style = "";
  let feedback = "";

  if (score > 85) {
    style = "Practical Learner";
    feedback = "You learn best by building projects.";
  } else if (score > 70) {
    style = "Visual Learner";
    feedback = "Diagrams and visual explanations help you.";
  } else {
    style = "Reading Learner";
    feedback = "Theory and documentation suit your learning.";
  }

  res.json({
    learningStyle: style,
    feedback: feedback,
  });
});

/* Time to Mastery AI */

app.post("/api/predict-mastery", (req, res) => {
  const { path, hours } = req.body;

  let totalHours = 50;

  if (path === "fullstack") totalHours = 80;
  if (path === "dsa") totalHours = 50;
  if (path === "devops") totalHours = 70;
  if (path === "ml") totalHours = 90;

  const days = Math.ceil(totalHours / hours);

  res.json({
    result: `You can complete ${path} in ${days} days if you study ${hours} hours daily`,
  });
});

/* Peer Twin AI */

app.post("/api/peer-twin", (req, res) => {
  const { skill } = req.body;

  let challenge = "";

  if (skill === "react") {
    challenge = "Build a Todo App using React Hooks";
  } else if (skill === "dsa") {
    challenge = "Solve 5 Array and 3 Linked List problems today";
  } else if (skill === "javascript") {
    challenge = "Practice Promises and Async/Await problems";
  } else {
    challenge = "Complete 3 coding problems today";
  }

  res.json({
    peerTwin: `Your AI Peer Twin suggests: ${challenge}`,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});
