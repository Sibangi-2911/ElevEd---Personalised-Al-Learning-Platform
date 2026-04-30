import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { authHeaders } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  FileText,
  Linkedin,
  Github,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Users
} from "lucide-react";

type Task = {
  task: string;
  completed: boolean;
  impact: string;
};

type CareerPath = {
  title: string;
  match: number;
  salary: string;
  demand: string;
  skills: string[];
  description: string;
};

type Course = {
  title: string;
  duration: string;
  type: string;
};

type CareerData = {
  resumeText?: string;
  linkedinUrl?: string;
  githubUsername?: string;
  careerPaths?: CareerPath[];
  tasks?: Task[];
  recommendedCourses?: Course[];
  employabilityScore?: number;
};



const careerPaths = [
  {
    title: "Frontend Developer",
    match: 85,
    salary: "$70K - $120K",
    demand: "High",
    skills: ["React", "TypeScript", "CSS"],
    description: "Build beautiful, responsive user interfaces",
  },
  {
    title: "Full Stack Developer",
    match: 78,
    salary: "$80K - $140K",
    demand: "Very High",
    skills: ["React", "Node.js", "PostgreSQL"],
    description: "Develop end-to-end web applications",
  },
  {
    title: "DevOps Engineer",
    match: 62,
    salary: "$90K - $150K",
    demand: "High",
    skills: ["Docker", "Kubernetes", "AWS"],
    description: "Automate and optimize deployment pipelines",
  },
];

const employabilityTasks = [
  { task: "Complete LinkedIn profile", completed: true, impact: "High" },
  { task: "Upload 3 projects to GitHub", completed: true, impact: "High" },
  { task: "Build portfolio website", completed: false, impact: "High" },
  { task: "Write technical blog post", completed: false, impact: "Medium" },
  { task: "Practice mock interviews", completed: false, impact: "High" },
  { task: "Get AWS certification", completed: false, impact: "Medium" },
];

const recommendedCourses = [
  { title: "System Design Interview Prep", duration: "8 weeks", type: "Course" },
  { title: "AWS Solutions Architect", duration: "12 weeks", type: "Certification" },
  { title: "Technical Communication", duration: "4 weeks", type: "Soft Skills" },
];

export default function Career() {
  const [tasks, setTasks] = useState<Task[]>(employabilityTasks);
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [studentProfile] = useState({
    resumeText:
    "Frontend developer skilled in React, Node.js, MongoDB and TypeScript",

    githubProjects: [
      {
        name: "AI Learning Platform",
        stars: 10,
      },
    ],

    linkedinProfile:
      "Computer Science student interested in AI and Web Development",
  });
    
  

  const completedTasks = tasks.filter((t) => t.completed).length;
  const employabilityScore =
  careerData?.employabilityScore ||
  Math.round((completedTasks / tasks.length) * 100);

  async function saveCareerProgress(updatedTasks: Task[]) {
    try {
      
      await fetch("${import.meta.env.VITE_API_URL}/api/save-career-progress", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          
          tasks: updatedTasks,
        }),
      });
    } catch (error) {
      console.error("Save failed", error);
    }
  }

  function toggleTask(taskName: string) {
    const updatedTasks = tasks.map((t) =>
      t.task === taskName
        ? { ...t, completed: !t.completed }
        : t
    );

    setTasks(updatedTasks);
    saveCareerProgress(updatedTasks);
  }


  async function fetchCareerProgress() {
    try {
      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/get-career-page",
        {
          headers: authHeaders(),
        }
      );

      const data = await response.json();

      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Fetch failed", error);
    }
  }

  

  async function generateCareerPage() {
    try {
      setLoading(true);
      setError("");

      

      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/generate-career-guidance",
        {
          method: "POST",
          headers: authHeaders(),

        body: JSON.stringify({
          resumeText: studentProfile.resumeText,
          githubData: studentProfile.githubProjects,
          linkedinData: studentProfile.linkedinProfile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setCareerData(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchCareerPage() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "${import.meta.env.VITE_API_URL}/api/get-career-page",
        {
          headers: authHeaders(),
        }
      );
      const data: CareerData = await response.json();

      if (data) {
        setCareerData(data);

        if (data.tasks) {
          setTasks(data.tasks);
        }
      }
    } catch (error) {
      console.error("Career fetch failed", error);
    }
  }

  useEffect(() => {
    fetchCareerProgress();
    fetchCareerPage();
    
  }, []);

 if (loading) {
    return <div className="p-10">Generating AI Career Guidance...</div>;
  }

  if (error) {
    return (
      <div className="p-10">
        <p>{error}</p>
        <Button onClick={generateCareerPage}>Retry</Button>
      </div>
    );
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
            Career <span className="gradient-text">Guidance</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personalized career recommendations, resume tools, and interview preparation.
          </p>

          <div className="mt-6 flex justify-center">
            <Button onClick={generateCareerPage}>
              {loading ? "Generating..." : "Generate AI Career Plan"}
            </Button>
          </div>
        </motion.div>

        {/* Employability Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl gradient-primary p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-2">
                Your Employability Score
              </h2>
              <p className="text-primary-foreground/80 mb-4">
                Based on your skills, projects, and career preparation progress.
              </p>
              <div className="flex items-center gap-4">
                <div className="font-heading text-5xl font-bold text-primary-foreground">
                  {employabilityScore}%
                </div>
                <div className="flex flex-col">
                  <span className="text-success text-sm font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +12% this month
                  </span>
                  <span className="text-primary-foreground/60 text-sm">
                    {completedTasks}/{tasks.length} tasks completed
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-primary-foreground" />
                <div className="font-heading font-bold text-primary-foreground">Resume</div>
                <div className="text-xs text-primary-foreground/60">{careerData?.resumeText ? "AI Analyzed" : "Pending"}</div>
              </div>
              <div className="text-center">
                <Linkedin className="w-8 h-8 mx-auto mb-2 text-primary-foreground" />
                <div className="font-heading font-bold text-primary-foreground">LinkedIn</div>
                <div className="text-xs text-primary-foreground/60">{careerData?.linkedinUrl ? "Connected" : "Pending"}</div>
              </div>
              <div className="text-center">
                <Github className="w-8 h-8 mx-auto mb-2 text-primary-foreground" />
                <div className="font-heading font-bold text-primary-foreground">GitHub</div>
                <div className="text-xs text-primary-foreground/60">{careerData?.githubUsername ? "Projects Synced" : "Pending"}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Career Paths */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-2xl font-semibold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Recommended Career Paths
            </h2>
            <div className="space-y-4">
              {(careerData?.careerPaths || careerPaths).map((career: CareerPath, index: number) => (
                <motion.div
                  key={career.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading font-semibold text-xl">{career.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          {career.match}% Match
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{career.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {career.skills.map(skill => (
                          <span key={skill} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {career.salary}
                        </span>
                        <span className={`flex items-center gap-1 ${
                          career.demand === "Very High" ? "text-success" : "text-warning"
                        }`}>
                          <TrendingUp className="w-4 h-4" />
                          {career.demand} Demand
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="group-hover:border-primary group-hover:text-primary">
                      Explore Path
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Employability Tasks */}
            <h2 className="font-heading text-2xl font-semibold mt-8">Employability Checklist</h2>
            <div className="rounded-2xl bg-card border border-border p-6">
              <div className="space-y-3">
                {tasks.map((item, index) => (
                  <div
                    key={item.task}
                    onClick={() => toggleTask(item.task)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      item.completed ? "bg-success/10" : "bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? "bg-success text-success-foreground" : "bg-muted"
                      }`}>
                        {item.completed && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className={item.completed ? "text-muted-foreground line-through" : ""}>
                        {item.task}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.impact === "High" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                    }`}>
                      {item.impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h3 className="font-heading font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Improve Resume
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Mock Interview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Github className="w-4 h-4 mr-2" />
                  Showcase Projects
                </Button>
              </div>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-card border border-border p-6"
            >
              <h3 className="font-heading font-semibold mb-4">Recommended for You</h3>
              <div className="space-y-3">
                {(careerData?.recommendedCourses || recommendedCourses).map((course: Course) => (
                  <div key={course.title} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{course.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certificate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl gradient-primary p-6 text-center"
            >
              <Award className="w-12 h-12 mx-auto mb-3 text-primary-foreground" />
              <h3 className="font-heading font-semibold text-primary-foreground mb-2">
                Career Ready Certificate
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Complete all tasks to earn your career readiness certificate.
              </p>
              <Progress value={employabilityScore} className="h-2 bg-primary-foreground/20" />
              <p className="text-xs text-primary-foreground/60 mt-2">
                {employabilityScore}% complete
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
