require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");

const Progress = require("./models/Progress");

const app = express();
const PORT = 5000;

mongoose
  .connect("mongodb://127.0.0.1:27017/eleved")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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

Respond in 4-5 short bullet points.
Each bullet must start with "-".
Keep explanations beginner-friendly.
End with one follow-up question as the last bullet.
`;

    async function generateWithRetry(prompt, retries = 3) {
      for (let i = 0; i < retries; i++) {
        try {
          return await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });
        } catch (error) {
          if (error.status === 503 && i < retries - 1) {
            console.log(`Retrying Gemini... attempt ${i + 1}`);
            await new Promise((resolve) => setTimeout(resolve, 2000));
          } else {
            throw error;
          }
        }
      }
    }

    const response = await generateWithRetry(prompt);

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


/* Auth API */

const users = []; // temporary storage

app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = { name, email, password };

  users.push(newUser);

  res.json({
    message: "Account created successfully",
    user: { name, email },
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user: { name: user.name, email: user.email },
  });
});


app.post("/api/save-progress", async (req, res) => {
  try {
    const { email, solvedChallenges, stats } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { email },
      { solvedChallenges, stats },
      { new: true, upsert: true }
    );

    res.json({
      message: "Progress saved successfully",
      progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Save failed" });
  }
});

app.get("/api/progress/:email", async (req, res) => {
  try {
    const progress = await Progress.findOne({
      email: req.params.email,
    });

    if (!progress) {
      return res.json({
        solvedChallenges: [],
        stats: null,
      });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetch failed" });
  }
});


app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});