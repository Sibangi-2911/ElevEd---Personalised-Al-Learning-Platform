require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GoogleGenAI } = require("@google/genai");
const auth = require("./middleware/auth");

const User = require("./models/User");
const Progress = require("./models/Progress");
const CareerProgress = require("./models/CareerProgress");

const app = express();
//const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

/* Learning Style AI */

app.post("/api/learning-style", (req, res) => {
  const { score } = req.body;

  if (typeof score !== "number" || score < 0 || score > 100) {
    return res.status(400).json({ error: "score must be a number 0–100" });
  }

  let learningStyle = "";
  let feedback = "";

  if (score > 85) {
    learningStyle = "Practical Learner";
    feedback =
      "You learn best by building projects. Try creating a small app using what you just tested — hands-on practice will solidify your knowledge fast.";
  } else if (score > 70) {
    learningStyle = "Visual Learner";
    feedback =
      "Diagrams and visual explanations help you absorb concepts. Use flowcharts, mind maps, or video tutorials to reinforce your understanding of weaker areas.";
  } else {
    learningStyle = "Reading Learner";
    feedback =
      "Theory and documentation suit your learning style. Spend time reading official docs and written guides to strengthen your foundations before moving on.";
  }

  res.json({ learningStyle, feedback });
});

//generate quiz
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { topic, difficulty, numQuestions = 5 } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ error: "topic and difficulty are required" });
    }

    const prompt = `
You are a technical quiz generator for a coding education platform.

Generate exactly ${numQuestions} multiple-choice questions about "${topic}" at ${difficulty} level.

Return ONLY valid JSON — no markdown, no backticks, no explanation.

Format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Brief explanation of why this answer is correct."
    }
  ]
}

Rules:
- Each question must have exactly 4 options.
- "answer" must exactly match one of the strings in "options".
- Questions must be practical and test real understanding, not trivia.
- Difficulty: ${difficulty} — adjust complexity accordingly.
- Topic: ${topic}
`;

    let result;
    let retries = 3;

    while (retries > 0) {
      try {
        result = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        break;
      } catch (error) {
        if (error.status === 503 && retries > 1) {
          retries--;
          console.log(`Retrying Gemini for quiz... attempts left: ${retries}`);
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          throw error;
        }
      }
    }

    if (!result) {
      return res.status(500).json({ error: "Gemini unavailable. Please try again." });
    }

    const raw = result.text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Gemini returned non-JSON:", raw);
      return res.status(500).json({ error: "AI returned invalid format. Please retry." });
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      return res.status(500).json({ error: "AI response missing questions array." });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Quiz generation error:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
}); 

// Save assessment progress
app.post("/api/save-assessment-progress", auth, async (req, res) => {
  try {
    const { assessments, skillLevels } = req.body;
    await User.findByIdAndUpdate(req.user.userId, {
      assessmentProgress: { assessments, skillLevels },
    });
    res.json({ message: "Assessment progress saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save assessment progress" });
  }
});

// Load assessment progress
app.get("/api/get-assessment-progress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.assessmentProgress || { assessments: null, skillLevels: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load assessment progress" });
  }
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

//const ai = new GoogleGenAI({
//  apiKey: process.env.GEMINI_API_KEY,
//});

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

//signup api

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Signup failed",
    });
  }
});

//login api

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
     res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});

//current user api

app.get("/api/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
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


/* Career*/ 

app.post("/api/generate-career-guidance", auth, async (req, res) => {
  try {
    const { resumeText, githubData, linkedinData } = req.body;

    const prompt = `
    Analyze this student profile and return JSON only.

    Resume:
    ${resumeText}

    GitHub:
    ${JSON.stringify(githubData)}

    LinkedIn:
    ${JSON.stringify(linkedinData)}

    Return JSON:
    {
      "careerPaths": [
        {
          "title": "",
          "match": 0,
          "salary": "",
          "demand": "",
          "skills": [],
          "description": ""
        }
      ],
      "tasks": [
        {
          "task": "",
          "completed": false,
          "impact": "High"
        }
      ],
      "recommendedCourses": [
        {
          "title": "",
          "duration": "",
          "type": ""
        }
      ]
    }
    `;

    let result;
    let retries = 3;

    while (retries > 0) {
      try {
        result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
        break;
      } catch (error) {
        if (error.status === 503) {
          retries--;
          console.log(`Retrying Gemini... attempts left: ${retries}`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }

    if (!result) {
      return res.status(500).json({
        error: "Gemini service temporarily busy. Please try again.",
      });
    }

    const text = result.text;
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);
    await User.findByIdAndUpdate(req.user.userId, {
      careerData: parsedData,
    });

    res.json(parsedData);
  } catch (error) {
    console.error("Career AI Error:", error);
    res.status(500).json({
      error: "Failed to generate career guidance",
    });
  }
});

app.get("/api/get-career-page", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json(user.careerData || {});
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch career page",
    });
  }
});

app.get("/api/student-profile/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const student = await studentsCollection.findOne({ email });

    res.json({
      resumeText: student?.resumeText || "",
      githubProjects: student?.githubProjects || [],
      linkedinProfile: student?.linkedinProfile || "",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch student profile",
    });
  }
});


/*  learning path */

// Save learning path progress
app.post("/api/save-path-progress", auth, async (req, res) => {
  try {
    const { pathId, completedLessons } = req.body;
    const user = await User.findById(req.user.userId);
    const pathProgress = user.pathProgress || {};
    pathProgress[pathId] = completedLessons; // store as array of "moduleIndex-lessonIndex"

    await User.findByIdAndUpdate(req.user.userId,
      { $set: { pathProgress } },
      { new: true }
    );
    res.json({ message: "Path progress saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save path progress" });
  }
});

// Get learning path progress
app.get("/api/get-path-progress/:pathId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const pathProgress = user.pathProgress || {};
    res.json({ completedLessons: pathProgress[req.params.pathId] || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get path progress" });
  }
});



//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AI Server running on http://localhost:${PORT}`);
});