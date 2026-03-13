require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

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

/* Peer Twin AI using Gemini */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/peer-twin", async (req, res) => {
  try {
    const { question, level, weakTopics } = req.body;

    const prompt = `
You are a Peer Twin AI learning partner.

Student level: ${level}
Weak topics: ${weakTopics}

Student asked: ${question}

Explain clearly and ask a follow-up question.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      twinReply: response.text,
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI error" });
  }
});

app.get("/", (req, res) => {
  res.send("ElevEd AI Backend is running ");
});

app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});