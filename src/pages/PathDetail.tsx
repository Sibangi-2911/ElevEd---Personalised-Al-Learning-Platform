import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle2,
  Video,
  FileText,
  Code,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Lesson {
  title: string;
  duration: string;
  type: "video" | "article" | "quiz" | "project";
  videoId?: string;
  
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface PathData {
  title: string;
  description: string;
  level: string;
  duration: string;
  students: string | null;
  tags: string[];
  overview: string;
  whatYouLearn: string[];
  modules: Module[];
}

// Real YouTube videos for courses
const pathData: Record<string, PathData> = {
  fullstack: {
    title: "Full Stack Development",
    description: "Master frontend and backend technologies to become a complete web developer.",
    level: "Intermediate",
    duration: "16 weeks",
    students: null,
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    overview: "This comprehensive path takes you from foundational web development concepts to building production-ready full-stack applications. You'll learn React for frontend, Node.js for backend, and PostgreSQL for databases.",
    whatYouLearn: [
      "React fundamentals and advanced patterns",
      "Node.js and Express backend development",
      "PostgreSQL database design and queries",
      "TypeScript for type-safe development",
      "Real-world project experience",
      "Deployment and DevOps basics"
    ],
    modules: [
      {
        title: "Module 1: Web Fundamentals",
        lessons: [
          { title: "Introduction to HTML & CSS", duration: "45 min", type: "video", videoId: "qz0aGYrrlhU"},
          { title: "JavaScript Basics", duration: "60 min", type: "video", videoId: "W6NZfCO5SIk"},
          //{ title: "Practice: Build a Landing Page", duration: "90 min", type: "project", completed: false },
        ]
      },
      {
        title: "Module 2: React Fundamentals",
        lessons: [
          { title: "Introduction to React", duration: "50 min", type: "video", videoId: "Tn6-PIqc4UM"},
          { title: "Components and Props", duration: "45 min", type: "video", videoId: "j942wKiXFu8" },
          { title: "State and Hooks", duration: "60 min", type: "video", videoId: "O6P86uwfdR0" },
          //{ title: "Quiz: React Basics", duration: "15 min", type: "quiz", completed: false },
        ]
      },
      {
        title: "Module 3: Advanced React",
        lessons: [
          { title: "Context API & State Management", duration: "55 min", type: "video", videoId: "35lXWvCuM8o" },
          { title: "React Router", duration: "40 min", type: "video", videoId: "Law7wfdg_ls" },
          //{ title: "Project: Task Manager App", duration: "120 min", type: "project", completed: false },
        ]
      },
      {
        title: "Module 4: Node.js Backend",
        lessons: [
          { title: "Introduction to Node.js", duration: "45 min", type: "video", videoId: "TlB_eWDSMt4"},
          { title: "Express.js Fundamentals", duration: "50 min", type: "video", videoId: "L72fhGm1tfE" },
          { title: "REST API Design", duration: "40 min", type: "video", videoId: "0oXYLzuucwE"},
          //{ title: "Practice: Build Your First API", duration: "90 min", type: "project", completed: false },
        ]
      },
    ]
  },
  dsa: {
    title: "Data Structures & Algorithms",
    description: "Build strong problem-solving skills with comprehensive DSA training.",
    level: "Beginner",
    duration: "12 weeks",
    students: null,
    tags: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
    overview: "Master the fundamentals of data structures and algorithms, essential for technical interviews and efficient programming.",
    whatYouLearn: [
      "Array and string manipulation",
      "Linked lists and stacks",
      "Trees and graph algorithms",
      "Sorting and searching techniques",
      "Dynamic programming patterns",
      "Interview problem-solving strategies"
    ],
    modules: [
      {
        title: "Module 1: Arrays & Strings",
        lessons: [
          { title: "Introduction to Arrays", duration: "40 min", type: "video", videoId: "QJNwK2uJyGs" },
          { title: "Two Pointer Technique", duration: "35 min", type: "video", videoId: "IJKpB3QOC7w" },
          //{ title: "Sliding Window Problems", duration: "45 min", type: "video", videoId: "MK-NZ4hN7rs", completed: false },
        ]
      },
      {
        title: "Module 2: Linked Lists",
        lessons: [
          { title: "Singly Linked Lists", duration: "50 min", type: "video", videoId: "Hj_rA0dhr2I"},
          { title: "Doubly Linked Lists", duration: "40 min", type: "video", videoId: "njTh_OwMljA" },
          //{ title: "Practice Problems", duration: "60 min", type: "project", completed: false },
        ]
      },
    ]
  },
  devops: {
    title: "DevOps Engineering",
    description: "Learn CI/CD, containerization, and cloud infrastructure management.",
    level: "Advanced",
    duration: "14 weeks",
    students: null,
    tags: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    overview: "Become a DevOps engineer by mastering containerization, orchestration, cloud services, and automation pipelines.",
    whatYouLearn: [
      "Docker containerization",
      "Kubernetes orchestration",
      "AWS cloud services",
      "CI/CD pipeline design",
      "Infrastructure as Code",
      "Monitoring and logging"
    ],
    modules: [
      {
        title: "Module 1: Docker Fundamentals",
        lessons: [
          { title: "Introduction to Containers", duration: "45 min", type: "video", videoId: "fqMOX6JJhGo"},
          { title: "Dockerfile Best Practices", duration: "40 min", type: "video", videoId: "3c-iBn73dDE" },
          { title: "Docker Compose", duration: "50 min", type: "video", videoId: "HG6yIjZapSA" },
        ]
      },
      {
        title: "Module 2: Kubernetes",
        lessons: [
          { title: "Kubernetes Architecture", duration: "55 min", type: "video", videoId: "X48VuDVv0do"},
          { title: "Deployments and Services", duration: "45 min", type: "video", videoId: "s_o8dwzRlu4" },
        ]
      },
    ]
  },
  ml: {
    title: "Machine Learning",
    description: "Dive into AI and machine learning with hands-on projects.",
    level: "Intermediate",
    duration: "18 weeks",
    students: null,
    tags: ["Python", "TensorFlow", "Neural Networks", "Data Science"],
    overview: "Learn machine learning from fundamentals to advanced deep learning techniques with real-world projects.",
    whatYouLearn: [
      "Python for data science",
      "Machine learning algorithms",
      "Deep learning with TensorFlow",
      "Neural network architectures",
      "Computer vision basics",
      "Natural language processing"
    ],
    modules: [
      {
        title: "Module 1: Python for ML",
        lessons: [
          { title: "NumPy Fundamentals", duration: "45 min", type: "video", videoId: "QUT1VHiLmmI"},
          { title: "Pandas for Data Analysis", duration: "50 min", type: "video", videoId: "vmEHCJofslg"},
          { title: "Data Visualization", duration: "40 min", type: "video", videoId: "a9UrKTVEeZA"},
        ]
      },
      {
        title: "Module 2: ML Fundamentals",
        lessons: [
          { title: "Introduction to Machine Learning", duration: "55 min", type: "video", videoId: "ukzFI9rgwfU"},
          { title: "Linear Regression", duration: "45 min", type: "video", videoId: "NUXdtN1W1FE"},
        ]
      },
    ]
  },
};

// Key format: "moduleIndex-lessonIndex"
function makeLessonKey(moduleIndex: number, lessonIndex: number) {
  return `${moduleIndex}-${lessonIndex}`;
}

export default function PathDetail() {
  const { pathId } = useParams();
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const path = pathData[pathId as string];
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);


  const totalLessons = path
    ? path.modules.reduce((acc, m) => acc + m.lessons.length, 0)
    : 0;
  const completedLessons = completedSet.size;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  //  Load saved progress on mount
  useEffect(() => {
    if (!path) return;
    setIsLoaded(false);
    setCompletedSet(new Set());

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoaded(true);
      setLoadingProgress(false);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/get-path-progress/${pathId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("📦 Loaded from DB:", data);
        if (Array.isArray(data.completedLessons)) {
          setCompletedSet(new Set(data.completedLessons));
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingProgress(false);
        setTimeout(() => setIsLoaded(true), 0);
      });
  }, [pathId]);

  // Save progress whenever completedSet changes (skip on first load)
  useEffect(() => {
    if (!isLoaded) return;

    const token = localStorage.getItem("token");

    // DEBUG - check these in browser console
    console.log("🔵 Save triggered");
    console.log("Token:", token ? "EXISTS" : "MISSING");
    console.log("PathId:", pathId);
    console.log("CompletedLessons:", Array.from(completedSet));
    
    if (!token) return;

    fetch("${import.meta.env.VITE_API_URL}/api/save-path-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pathId,
        completedLessons: Array.from(completedSet),
      }),  
    })
      .then(r => r.json())
      .then(data => console.log("✅ Save response:", data))   
      .catch(err => console.error("❌ Save error:", err));
  }, [completedSet, loadingProgress, pathId]);



  if (!path) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Path not found</h1>
          <Link to="/paths">
            <Button>Back to Paths</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const toggleModule = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Mark current playing lesson as complete
  function markCurrentComplete() {
    if (!playingKey) return;
    setCompletedSet((prev) => new Set([...prev, playingKey]));
  }

  // Toggle completion manually
  function toggleLessonComplete(key: string) {
    setCompletedSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Start/Continue Learning — jump to first incomplete lesson
  function handleStartLearning() {
    for (let mi = 0; mi < path.modules.length; mi++) {
      for (let li = 0; li < path.modules[mi].lessons.length; li++) {
        const key = makeLessonKey(mi, li);
        if (!completedSet.has(key)) {
          const lesson = path.modules[mi].lessons[li];
          if (lesson.videoId) {
            setPlayingVideo(lesson.videoId);
            setPlayingKey(key);
            // Expand the module and scroll up
            setExpandedModules((prev) => (prev.includes(mi) ? prev : [...prev, mi]));
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
          }
          return;
        }
      }
    }
  }
  

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "article": return FileText;
      case "quiz": return CheckCircle2;
      case "project": return Code;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/paths">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Paths
          </Button>
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl gradient-primary p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-background/20 text-primary-foreground">
                    {path.level}
                  </span>
                  <span className="text-sm text-primary-foreground/80 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {path.students} 
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  {path.title}
                </h1>
                <p className="text-primary-foreground/80 max-w-2xl">{path.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {path.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-background/20 text-primary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-4">
                <Button
                  variant="secondary"
                  size="lg"
                  className="group"
                  onClick={handleStartLearning}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {completedLessons > 0 ? "Continue Learning" : "Start Learning"}
                </Button>
                <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {path.modules.length} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Curriculum */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            {playingVideo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl overflow-hidden bg-card border border-border"
              >
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1`}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 flex items-center justify-between bg-card border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {playingKey && completedSet.has(playingKey)
                      ? " Lesson marked as complete"
                      : "Finished watching? Mark this lesson as complete."}
                  </p>
                  <Button
                    size="sm"
                    variant={playingKey && completedSet.has(playingKey) ? "outline" : "gradient"}
                    onClick={markCurrentComplete}
                    disabled={!!(playingKey && completedSet.has(playingKey))}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {playingKey && completedSet.has(playingKey) ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h2 className="font-heading text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground">{path.overview}</p>
            </motion.div>

            {/* Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading text-xl font-semibold mb-4">Curriculum</h2>
              <div className="space-y-4">
                {path.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="rounded-xl bg-card border border-border overflow-hidden">
                    <button
                      onClick={() => toggleModule(moduleIndex)}
                      className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium">
                          {moduleIndex + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                        </div>
                      </div>
                      {expandedModules.includes(moduleIndex) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {expandedModules.includes(moduleIndex) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-border"
                      >
                        {module.lessons.map((lesson, lessonIndex) => {
                          const Icon = getLessonIcon(lesson.type);
                          const key = makeLessonKey(moduleIndex, lessonIndex);
                          const isCompleted = completedSet.has(key);
                          const isPlaying = playingKey === key;
                          return (
                            <div
                              key={lessonIndex}
                              className={`flex items-center justify-between p-4 transition-colors border-b border-border last:border-b-0 ${
                                isPlaying ? "bg-primary/10" : "hover:bg-secondary/30 cursor-pointer"
                              }`}
                            >
                              {/* Left: icon + title */}
                              <div
                                className="flex items-center gap-3 flex-1"
                                onClick={() => {
                                  if (lesson.videoId) {
                                    setPlayingVideo(lesson.videoId);
                                    setPlayingKey(key);
                                    setExpandedModules((prev) =>
                                      prev.includes(moduleIndex) ? prev : [...prev, moduleIndex]
                                    );
                                    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
                                  }
                                }}
                              >
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isCompleted
                                      ? "bg-success/20 text-success"
                                      : isPlaying
                                      ? "bg-primary/20 text-primary"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Icon className="w-4 h-4" />
                                  )}
                                </div>
                                <div>
                                  <p className={isCompleted ? "text-muted-foreground line-through" : "text-foreground"}>
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                                </div>
                              </div>

                              {/* Right: play icon + toggle complete checkbox */}
                              <div className="flex items-center gap-2 shrink-0">
                                {lesson.type === "video" && (
                                  <Play className={`w-4 h-4 ${isPlaying ? "text-primary" : "text-muted-foreground"}`} />
                                )}
                                {/*  Toggle complete button per lesson */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLessonComplete(key);
                                  }}
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    isCompleted
                                      ? "bg-success border-success text-white"
                                      : "border-muted-foreground hover:border-success"
                                  }`}
                                  title={isCompleted ? "Mark incomplete" : "Mark complete"}
                                >
                                  {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
                              

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card border border-border p-6 sticky top-24"
            >
              <h3 className="font-heading font-semibold mb-4">Your Progress</h3>
              <Progress value={progress} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground mb-6">
                <span>{progress}% Complete</span>
                <span>{completedLessons}/{totalLessons} lessons</span>
              </div>
              <Button variant="gradient" className="w-full" onClick={handleStartLearning}>
                {completedLessons > 0 ? "Continue Learning" : "Start Learning"}
              </Button>

              {progress === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-xl bg-success/10 border border-success/30 text-success text-sm text-center font-medium"
                >
                  🎉 Path Complete! You've finished all lessons.
                </motion.div>
              )}
    
            </motion.div>

            {/* What You'll Learn */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h3 className="font-heading font-semibold mb-4">What You'll Learn</h3>
              <ul className="space-y-3">
                {path.whatYouLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* new skill*/}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl gradient-primary p-6 text-center"
            >
              <Award className="w-12 h-12 mx-auto mb-3 text-primary-foreground" />
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">Earn a new skill</h3>
              <p className="text-sm text-primary-foreground/80">
                Complete this path and earn a new skill to showcase your talent.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
