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
  ChevronUp
} from "lucide-react";
import { useState } from "react";

interface Lesson {
  title: string;
  duration: string;
  type: "video" | "article" | "quiz" | "project";
  videoId?: string;
  completed?: boolean;
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
  students: string;
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
    students: "12,450",
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
          { title: "Introduction to HTML & CSS", duration: "45 min", type: "video", videoId: "qz0aGYrrlhU", completed: true },
          { title: "JavaScript Basics", duration: "60 min", type: "video", videoId: "W6NZfCO5SIk", completed: true },
          { title: "Practice: Build a Landing Page", duration: "90 min", type: "project", completed: false },
        ]
      },
      {
        title: "Module 2: React Fundamentals",
        lessons: [
          { title: "Introduction to React", duration: "50 min", type: "video", videoId: "Tn6-PIqc4UM", completed: false },
          { title: "Components and Props", duration: "45 min", type: "video", videoId: "j942wKiXFu8", completed: false },
          { title: "State and Hooks", duration: "60 min", type: "video", videoId: "O6P86uwfdR0", completed: false },
          { title: "Quiz: React Basics", duration: "15 min", type: "quiz", completed: false },
        ]
      },
      {
        title: "Module 3: Advanced React",
        lessons: [
          { title: "Context API & State Management", duration: "55 min", type: "video", videoId: "35lXWvCuM8o", completed: false },
          { title: "React Router", duration: "40 min", type: "video", videoId: "Law7wfdg_ls", completed: false },
          { title: "Project: Task Manager App", duration: "120 min", type: "project", completed: false },
        ]
      },
      {
        title: "Module 4: Node.js Backend",
        lessons: [
          { title: "Introduction to Node.js", duration: "45 min", type: "video", videoId: "TlB_eWDSMt4", completed: false },
          { title: "Express.js Fundamentals", duration: "50 min", type: "video", videoId: "L72fhGm1tfE", completed: false },
          { title: "REST API Design", duration: "40 min", type: "video", videoId: "0oXYLzuucwE", completed: false },
          { title: "Practice: Build Your First API", duration: "90 min", type: "project", completed: false },
        ]
      },
    ]
  },
  dsa: {
    title: "Data Structures & Algorithms",
    description: "Build strong problem-solving skills with comprehensive DSA training.",
    level: "Beginner",
    duration: "12 weeks",
    students: "8,230",
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
          { title: "Introduction to Arrays", duration: "40 min", type: "video", videoId: "QJNwK2uJyGs", completed: false },
          { title: "Two Pointer Technique", duration: "35 min", type: "video", videoId: "IJKpB3QOC7w", completed: false },
          { title: "Sliding Window Problems", duration: "45 min", type: "video", videoId: "MK-NZ4hN7rs", completed: false },
        ]
      },
      {
        title: "Module 2: Linked Lists",
        lessons: [
          { title: "Singly Linked Lists", duration: "50 min", type: "video", videoId: "Hj_rA0dhr2I", completed: false },
          { title: "Doubly Linked Lists", duration: "40 min", type: "video", videoId: "njTh_OwMljA", completed: false },
          { title: "Practice Problems", duration: "60 min", type: "project", completed: false },
        ]
      },
    ]
  },
  devops: {
    title: "DevOps Engineering",
    description: "Learn CI/CD, containerization, and cloud infrastructure management.",
    level: "Advanced",
    duration: "14 weeks",
    students: "5,890",
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
          { title: "Introduction to Containers", duration: "45 min", type: "video", videoId: "fqMOX6JJhGo", completed: false },
          { title: "Dockerfile Best Practices", duration: "40 min", type: "video", videoId: "3c-iBn73dDE", completed: false },
          { title: "Docker Compose", duration: "50 min", type: "video", videoId: "HG6yIjZapSA", completed: false },
        ]
      },
      {
        title: "Module 2: Kubernetes",
        lessons: [
          { title: "Kubernetes Architecture", duration: "55 min", type: "video", videoId: "X48VuDVv0do", completed: false },
          { title: "Deployments and Services", duration: "45 min", type: "video", videoId: "s_o8dwzRlu4", completed: false },
        ]
      },
    ]
  },
  ml: {
    title: "Machine Learning",
    description: "Dive into AI and machine learning with hands-on projects.",
    level: "Intermediate",
    duration: "18 weeks",
    students: "6,120",
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
          { title: "NumPy Fundamentals", duration: "45 min", type: "video", videoId: "QUT1VHiLmmI", completed: false },
          { title: "Pandas for Data Analysis", duration: "50 min", type: "video", videoId: "vmEHCJofslg", completed: false },
          { title: "Data Visualization", duration: "40 min", type: "video", videoId: "a9UrKTVEeZA", completed: false },
        ]
      },
      {
        title: "Module 2: ML Fundamentals",
        lessons: [
          { title: "Introduction to Machine Learning", duration: "55 min", type: "video", videoId: "ukzFI9rgwfU", completed: false },
          { title: "Linear Regression", duration: "45 min", type: "video", videoId: "NUXdtN1W1FE", completed: false },
        ]
      },
    ]
  },
};

export default function PathDetail() {
  const { pathId } = useParams();
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  
  const path = pathData[pathId as string];

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

  const totalLessons = path.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = path.modules.reduce(
    (acc, m) => acc + m.lessons.filter(l => l.completed).length, 0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  const toggleModule = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
                    {path.students} enrolled
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
                <Button variant="secondary" size="lg" className="group">
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
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
                          return (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border last:border-b-0"
                              onClick={() => lesson.videoId && setPlayingVideo(lesson.videoId)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  lesson.completed ? "bg-success/20 text-success" : "bg-secondary text-muted-foreground"
                                }`}>
                                  {lesson.completed ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                  ) : (
                                    <Icon className="w-4 h-4" />
                                  )}
                                </div>
                                <div>
                                  <p className={lesson.completed ? "text-muted-foreground" : "text-foreground"}>
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                                </div>
                              </div>
                              {lesson.type === "video" && (
                                <Play className="w-4 h-4 text-primary" />
                              )}
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
              <Button variant="gradient" className="w-full">Continue Learning</Button>
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

            {/* Certificate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl gradient-primary p-6 text-center"
            >
              <Award className="w-12 h-12 mx-auto mb-3 text-primary-foreground" />
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">Earn a Certificate</h3>
              <p className="text-sm text-primary-foreground/80">
                Complete this path and earn a verified certificate to showcase your skills.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
