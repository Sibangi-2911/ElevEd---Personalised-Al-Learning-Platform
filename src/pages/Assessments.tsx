import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import {
  ClipboardCheck,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Brain,
  Code,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const assessments = [
  {
    id: 1,
    title: "React Fundamentals Assessment",
    description:
      "Test your knowledge of React basics, hooks, and component patterns.",
    questions: 25,
    duration: "30 min",
    difficulty: "Intermediate",
    status: "completed",
    score: 88,
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "JavaScript Core Concepts",
    description:
      "Evaluate your understanding of closures, promises, and ES6+ features.",
    questions: 30,
    duration: "45 min",
    difficulty: "Intermediate",
    status: "completed",
    score: 92,
    date: "2024-01-10",
  },
  {
    id: 3,
    title: "Data Structures Quiz",
    description:
      "Test your knowledge of arrays, linked lists, trees, and graphs.",
    questions: 20,
    duration: "25 min",
    difficulty: "Advanced",
    status: "available",
    score: null,
    date: null,
  },
  {
    id: 4,
    title: "System Design Basics",
    description:
      "Evaluate your understanding of scalability, databases, and architecture.",
    questions: 15,
    duration: "40 min",
    difficulty: "Advanced",
    status: "locked",
    score: null,
    date: null,
  },
];

const skillLevels = [
  { skill: "React", level: 78, category: "Frontend" },
  { skill: "JavaScript", level: 85, category: "Frontend" },
  { skill: "TypeScript", level: 72, category: "Frontend" },
  { skill: "Node.js", level: 65, category: "Backend" },
  { skill: "SQL", level: 58, category: "Database" },
  { skill: "DSA", level: 70, category: "Problem Solving" },
];

export default function Assessments() {
  const [aiFeedback, setAiFeedback] = useState("");
  const [userScore, setUserScore] = useState<number | null>(null);
  const [learningStyle, setLearningStyle] = useState("");

  async function runAIAnalysis(score: number) {
    const response = await fetch("http://localhost:5000/api/learning-style", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: score,
      }),
    });

    const data = await response.json();

    setLearningStyle(data.learningStyle);
    setAiFeedback(data.feedback);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            AI <span className="gradient-text">Assessments</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Continuous evaluation of your skills with actionable feedback and
            personalized recommendations.
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              icon: Target,
              label: "Overall Score",
              value: "85%",
              color: "text-primary",
            },
            {
              icon: ClipboardCheck,
              label: "Tests Completed",
              value: "12",
              color: "text-success",
            },
            {
              icon: TrendingUp,
              label: "Improvement",
              value: "+15%",
              color: "text-accent",
            },
            {
              icon: Award,
              label: "Skill Level",
              value: "Intermediate",
              color: "text-warning",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <div className="font-heading text-2xl font-bold">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assessments List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-2xl font-semibold">
              Available Assessments
            </h2>
            <div className="space-y-4">
              {assessments.map((assessment, index) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`group p-6 rounded-2xl bg-card border transition-all duration-300 ${
                    assessment.status === "locked"
                      ? "border-border opacity-60"
                      : assessment.status === "completed"
                        ? "border-success/30"
                        : "border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          assessment.status === "completed"
                            ? "bg-success/20 text-success"
                            : assessment.status === "locked"
                              ? "bg-muted text-muted-foreground"
                              : "gradient-primary text-primary-foreground"
                        }`}
                      >
                        {assessment.status === "completed" ? (
                          <Trophy className="w-6 h-6" />
                        ) : (
                          <Brain className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              assessment.difficulty === "Beginner"
                                ? "bg-success/20 text-success"
                                : assessment.difficulty === "Intermediate"
                                  ? "bg-warning/20 text-warning"
                                  : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {assessment.difficulty}
                          </span>
                          {assessment.status === "completed" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
                              Score: {assessment.score}%
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-semibold text-lg">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {assessment.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{assessment.questions} questions</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {assessment.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant={
                        assessment.status === "completed"
                          ? "outline"
                          : assessment.status === "locked"
                            ? "secondary"
                            : "gradient"
                      }
                      disabled={assessment.status === "locked"}
                      onClick={() => {
                        const score = Math.floor(Math.random() * 100);

                        setUserScore(score);

                        runAIAnalysis(score);
                      }}
                    >
                      {assessment.status === "completed"
                        ? "Review"
                        : assessment.status === "locked"
                          ? "Locked"
                          : "Start Test"}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Skill Levels Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h3 className="font-heading font-semibold mb-6">
                Your Skill Levels
              </h3>
              <div className="space-y-4">
                {skillLevels.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{skill.skill}</span>
                      <span className="text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                    <span className="text-xs text-muted-foreground">
                      {skill.category}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl gradient-primary p-6"
            >
              <MessageSquare className="w-10 h-10 text-primary-foreground mb-3" />
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">
                AI Feedback
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                {aiFeedback || "Complete an assessment to receive AI feedback."}
              </p>

              {learningStyle && (
                <p className="text-xs text-primary-foreground/80">
                  Detected Learning Style: {learningStyle}
                </p>
              )}
              {userScore && (
                <div className="mb-8 p-4 bg-card border rounded-xl">
                  <h3 className="font-semibold mb-2">
                    Latest AI Assessment Result
                  </h3>

                  <p>Your Score: {userScore}%</p>
                </div>
              )}
              <Button variant="secondary" size="sm">
                View Recommendations
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
