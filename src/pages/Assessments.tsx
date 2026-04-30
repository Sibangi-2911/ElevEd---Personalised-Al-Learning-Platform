import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
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
  X,
  Loader2,
  AlertCircle,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Star,
  Lock as LockIcon,
} from "lucide-react";

// ── Fix: wrap Lock to avoid class-component JSX error ──
function Lock(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return <LockIcon {...props} />;
}

// ── Fix: define Phase type ──
type Phase = "loading" | "quiz" | "result" | "error";

//types

interface Assessment {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "completed" | "available" | "locked";
  score: number | null;
  date: string | null;
  topic: string;
  skillKey: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface AIResult {
  score: number;
  learningStyle: string;
  feedback: string;
  assessmentTitle: string;
}

//data static

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 1,
    title: "React Fundamentals Assessment",
    description:
      "Test your knowledge of React basics, hooks, and component patterns.",
    questions: 5,
    duration: "10 min",
    difficulty: "Intermediate",
    status: "available",
    score: null,
    date: null,
    topic: "React.js hooks, components, and state management",
    skillKey: "React",
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
    score: null,
    date: null,
    topic: "JavaScript closures, promises, async/await, and ES6 features",
    skillKey: "JavaScript",
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
    topic: "Data structures: arrays, linked lists, trees, graphs, time complexities",
    skillKey: "DSA",
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
    topic: "System design: scalability, load balancing, databases, caching",
    skillKey: "Node.js",
  },
];

// ── Fix: renamed to INITIAL_SKILLS so the useState below resolves ──
const INITIAL_SKILLS = [
  { skill: "React", level: 78, category: "Frontend" },
  { skill: "JavaScript", level: 85, category: "Frontend" },
  { skill: "TypeScript", level: 72, category: "Frontend" },
  { skill: "Node.js", level: 65, category: "Backend" },
  { skill: "SQL", level: 58, category: "Database" },
  { skill: "DSA", level: 70, category: "Problem Solving" },
];

//difficulty badge

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Beginner: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    Intermediate: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Advanced: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level] ?? styles.Beginner}`}
    >
      {level}
    </span>
  );
}

function getScoreTextColor(s: number): string {
  if (s >= 80) return "text-green-400";
  if (s >= 60) return "text-yellow-400";
  return "text-red-400";
}

function getScoreStrokeClass(s: number): string {
  if (s >= 80) return "stroke-green-400";
  if (s >= 60) return "stroke-yellow-400";
  return "stroke-red-400";
}

//quiz modal
interface QuizModalProps {
  assessment: Assessment;
  onClose: () => void;
  onComplete: (assessmentId: number, score: number, skillKey: string) => void;
}

function QuizModal({ assessment, onClose, onComplete }: QuizModalProps) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [aiResult, setAiResult] = useState<{
    learningStyle: string;
    feedback: string;
  } | null>(null);

  // Fetch questions on first render
  const [_loaded] = useState<boolean>(() => {
    fetchQuestions();
    return true;
  });

  async function fetchQuestions() {
    setPhase("loading");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: assessment.topic,
          difficulty: assessment.difficulty,
          numQuestions: assessment.questions,
        }),
      });
      if (!res.ok) throw new Error("Server responded with " + res.status);
      const data = await res.json();
      if (!data.questions?.length) throw new Error("No questions returned");
      setQuestions(data.questions);
      setCurrent(0);
      setAnswers([]);
      setSelected(null);
      setConfirmed(false);
      setPhase("quiz");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to load quiz. Is your backend running on port 5000?";
      setErrorMsg(msg);
      setPhase("error");
    }
  }

  function handleSelect(option: string) {
    if (!confirmed) setSelected(option);
  }

  function handleConfirm() {
    if (selected) setConfirmed(true);
  }

  async function handleNext() {
    const q = questions[current];
    const isCorrect = selected === q.answer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setSelected(null);
    setConfirmed(false);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const pct = Math.round(
        (newAnswers.filter(Boolean).length / questions.length) * 100
      );

      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL}/api/learning-style`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: pct }),
        });
        const data = await r.json();
        setAiResult({
          learningStyle: data.learningStyle,
          feedback: data.feedback,
        });
      } catch {
        setAiResult({
          learningStyle: "Self-directed Learner",
          feedback: "Great effort! Keep reviewing your weak areas and try again.",
        });
      }

      onComplete(assessment.id, pct, assessment.skillKey);
      setPhase("result");
    }
  }

  const currentQuestion = questions[current];
  const finalScore =
    questions.length > 0
      ? Math.round((answers.filter(Boolean).length / questions.length) * 100)
      : 0;
  const circumference = 2 * Math.PI * 42;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="relative w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
      >
        {/* Top accent */}
        <div className="h-1 w-full gradient-primary" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className="flex flex-col items-center justify-center py-20 px-8 gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-center">
              <p className="font-heading font-semibold text-lg">Generating Quiz</p>
              <p className="text-muted-foreground text-sm mt-1">
                Gemini is crafting questions for{" "}
                <span className="text-foreground font-medium">{assessment.title}</span>…
              </p>
            </div>
            <Loader2 className="w-6 h-6 animate-spin text-primary mt-2" />
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === "error" && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <p className="font-heading font-semibold text-lg">Quiz Load Failed</p>
            <p className="text-muted-foreground text-sm max-w-sm">{errorMsg}</p>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={fetchQuestions}>
                <RotateCcw className="w-4 h-4 mr-1" /> Retry
              </Button>
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === "quiz" && currentQuestion && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{assessment.title}</span>
              <span>
                {current + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border mb-6 overflow-hidden">
              <motion.div
                className="h-full gradient-primary rounded-full"
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <p className="font-heading font-semibold text-lg leading-snug mb-6">
                  {currentQuestion.question}
                </p>

                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((opt, i) => {
                    const letter = ["A", "B", "C", "D"][i];
                    const isSelected = selected === opt;
                    const isCorrect = opt === currentQuestion.answer;

                    let containerStyle =
                      "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
                    if (confirmed) {
                      if (isCorrect)
                        containerStyle = "border-green-500/60 bg-green-500/10 cursor-default";
                      else if (isSelected)
                        containerStyle = "border-red-500/60 bg-red-500/10 cursor-default";
                      else containerStyle = "border-border bg-card opacity-40 cursor-default";
                    } else if (isSelected) {
                      containerStyle = "border-primary bg-primary/10 cursor-pointer";
                    }

                    let badgeStyle = "bg-muted text-muted-foreground";
                    if (confirmed && isCorrect) badgeStyle = "bg-green-500 text-white";
                    else if (confirmed && isSelected) badgeStyle = "bg-red-500 text-white";
                    else if (isSelected) badgeStyle = "bg-primary text-primary-foreground";

                    return (
                      <motion.button
                        key={opt}
                        whileHover={!confirmed ? { scale: 1.01 } : {}}
                        whileTap={!confirmed ? { scale: 0.99 } : {}}
                        onClick={() => handleSelect(opt)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${containerStyle}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${badgeStyle}`}
                        >
                          {letter}
                        </span>
                        <span className="text-sm">{opt}</span>
                        {confirmed && isCorrect && (
                          <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {confirmed && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-foreground/80"
                    >
                      <span className="font-semibold text-primary">Explanation: </span>
                      {currentQuestion.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!confirmed ? (
                  <Button
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={!selected}
                    onClick={handleConfirm}
                  >
                    Confirm Answer
                  </Button>
                ) : (
                  <Button
                    className="w-full gradient-primary text-primary-foreground"
                    onClick={handleNext}
                  >
                    {current + 1 < questions.length ? (
                      <>
                        Next Question <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        See Results <Trophy className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && (
          <div className="p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-border"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - finalScore / 100) }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    className={getScoreStrokeClass(finalScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreTextColor(finalScore)}`}>
                    {finalScore}%
                  </span>
                </div>
              </div>

              <h2 className="font-heading text-xl font-bold">
                {finalScore >= 80
                  ? "Excellent Work! 🎉"
                  : finalScore >= 60
                  ? "Good Job! 👍"
                  : "Keep Practicing 💪"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {answers.filter(Boolean).length} / {questions.length} correct
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-5">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full ${correct ? "bg-green-400" : "bg-red-400"}`}
                />
              ))}
            </div>

            {aiResult && (
              <>
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">AI Feedback</span>
                  </div>
                  <p className="text-sm text-foreground/80">{aiResult.feedback}</p>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 mb-5">
                  <Star className="w-4 h-4 text-warning shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Detected Learning Style</p>
                    <p className="text-sm font-semibold">{aiResult.learningStyle}</p>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-xl bg-success/10 border border-success/20 p-3 mb-5 text-sm text-success flex items-center gap-2">
              <TrendingUp className="w-4 h-4 shrink-0" />
              Your <strong>{assessment.skillKey}</strong> skill level has been updated based on
              this score.
            </div>

            <Button
              className="w-full gradient-primary text-primary-foreground"
              onClick={onClose}
            >
              Back to Assessments
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

//main page

export default function Assessments() {
  const [assessmentList, setAssessmentList] =
    useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [skillLevelList, setSkillLevelList] = useState(INITIAL_SKILLS);
  const [activeQuiz, setActiveQuiz] = useState<Assessment | null>(null);
  const [latestResult, setLatestResult] = useState<AIResult | null>(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(true);

  // ✅ Load saved progress on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingProgress(false);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/get-assessment-progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.assessments) setAssessmentList(data.assessments);
        if (data.skillLevels) setSkillLevelList(data.skillLevels);
      })
      .catch(() => {})
      .finally(() => setLoadingProgress(false));
  }, []);

  //  Save progress to DB whenever assessmentList or skillLevelList changes
  useEffect(() => {
    if (loadingProgress) return; // don't save during initial load
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/save-assessment-progress`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        assessments: assessmentList,
        skillLevels: skillLevelList,
      }),
    }).catch(() => {});
  }, [assessmentList, skillLevelList]);

  function handleQuizComplete(
    assessmentId: number,
    score: number,
    skillKey: string
  ) {
    setAssessmentList((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              status: "completed",
              score,
              date: new Date().toISOString().split("T")[0],
            }
          : a
      )
    );

    setSkillLevelList((prev) =>
      prev.map((s) =>
        s.skill === skillKey
          ? {
              ...s,
              level: Math.min(100, Math.round(s.level * 0.7 + score * 0.3)),
            }
          : s
      )
    );

    fetch(`${import.meta.env.VITE_API_URL}/api/learning-style`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    })
      .then((r) => r.json())
      .then((data) => {
        setLearningStyle(data.learningStyle);
        setAiFeedback(data.feedback);
        const a = assessmentList.find((x) => x.id === assessmentId);
        setLatestResult({
          score,
          learningStyle: data.learningStyle,
          feedback: data.feedback,
          assessmentTitle: a?.title ?? "",
        });
      })
      .catch(() => {});
  }

  const completedCount = assessmentList.filter(
    (a) => a.status === "completed"
  ).length;

  //  Show loading state while fetching
  if (loadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {activeQuiz && (
          <QuizModal
            assessment={activeQuiz}
            onClose={() => setActiveQuiz(null)}
            onComplete={handleQuizComplete}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* ── Header ── */}
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

          {/* ── Stats ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { icon: Target, label: "Overall Score", value: "85%", color: "text-primary" },
              { icon: ClipboardCheck, label: "Tests Completed", value: String(completedCount), color: "text-success" },
              { icon: TrendingUp, label: "Improvement", value: "+15%", color: "text-accent" },
              { icon: Award, label: "Skill Level", value: "Intermediate", color: "text-warning" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-card border border-border">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <div className="font-heading text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Assessment Cards ── */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-heading text-2xl font-semibold">
                Available Assessments
              </h2>
              <div className="space-y-4">
                {assessmentList.map((assessment, index) => (
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
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            assessment.status === "completed"
                              ? "bg-success/20 text-success"
                              : assessment.status === "locked"
                              ? "bg-muted text-muted-foreground"
                              : "gradient-primary text-primary-foreground"
                          }`}
                        >
                          {assessment.status === "completed" ? (
                            <Trophy className="w-6 h-6" />
                          ) : assessment.status === "locked" ? (
                            <Lock className="w-6 h-6" />
                          ) : (
                            <Brain className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <DifficultyBadge level={assessment.difficulty} />
                            {assessment.status === "completed" &&
                              assessment.score !== null && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
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
                      <div className="shrink-0">
                        {assessment.status === "locked" ? (
                          <Button variant="secondary" disabled>
                            <Lock className="w-4 h-4 mr-1" /> Locked
                          </Button>
                        ) : assessment.status === "completed" ? (
                          <Button variant="outline" onClick={() => setActiveQuiz(assessment)}>
                            Retake <RotateCcw className="w-4 h-4 ml-1" />
                          </Button>
                        ) : (
                          <Button variant="gradient" onClick={() => setActiveQuiz(assessment)}>
                            Start Test <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl bg-card border border-border p-6"
              >
                <h3 className="font-heading font-semibold mb-6">Your Skill Levels</h3>
                <div className="space-y-4">
                  {skillLevelList.map((skill) => (
                    <div key={skill.skill}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill.skill}</span>
                        <motion.span
                          key={skill.level}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                          className="text-muted-foreground"
                        >
                          {skill.level}%
                        </motion.span>
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
                  <p className="text-xs text-primary-foreground/70 mb-4">
                    Detected Learning Style: {learningStyle}
                  </p>
                )}
                {latestResult && (
                  <div className="mb-4 p-4 bg-card border border-border rounded-xl">
                    <h4 className="font-semibold text-sm mb-1">Latest AI Assessment Result</h4>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {latestResult.assessmentTitle}
                    </p>
                    <p className="text-lg font-bold">
                      Your Score:{" "}
                      <span className={getScoreTextColor(latestResult.score)}>
                        {latestResult.score}%
                      </span>
                    </p>
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
    </>
  );
}