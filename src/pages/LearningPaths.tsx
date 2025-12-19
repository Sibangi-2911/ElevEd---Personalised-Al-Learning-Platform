import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Clock, 
  Users, 
  BookOpen, 
  Code, 
  Database, 
  Server,
  ArrowRight,
  Star
} from "lucide-react";
import { useState } from "react";

const allPaths = [
  {
    id: "fullstack",
    title: "Full Stack Development",
    description: "Master frontend and backend technologies to become a complete web developer.",
    icon: Code,
    level: "Intermediate",
    duration: "16 weeks",
    modules: 12,
    students: "12,450",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    rating: 4.9,
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Build strong problem-solving skills with comprehensive DSA training.",
    icon: Database,
    level: "Beginner",
    duration: "12 weeks",
    modules: 10,
    students: "8,230",
    tags: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
    rating: 4.8,
  },
  {
    id: "devops",
    title: "DevOps Engineering",
    description: "Learn CI/CD, containerization, and cloud infrastructure management.",
    icon: Server,
    level: "Advanced",
    duration: "14 weeks",
    modules: 8,
    students: "5,890",
    tags: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    rating: 4.7,
  },
  {
    id: "ml",
    title: "Machine Learning",
    description: "Dive into AI and machine learning with hands-on projects.",
    icon: BookOpen,
    level: "Intermediate",
    duration: "18 weeks",
    modules: 14,
    students: "6,120",
    tags: ["Python", "TensorFlow", "Neural Networks", "Data Science"],
    rating: 4.9,
  },
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

export default function LearningPaths() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredPaths = allPaths.filter((path) => {
    const matchesSearch = path.title.toLowerCase().includes(search.toLowerCase()) ||
      path.description.toLowerCase().includes(search.toLowerCase()) ||
      path.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesLevel = selectedLevel === "All" || path.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

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
            Learning <span className="gradient-text">Paths</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your path and start your journey towards becoming a skilled professional.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search paths, topics, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Paths Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Link to={`/paths/${path.id}`}>
                <div className="group h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <path.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          path.level === "Beginner" ? "bg-success/20 text-success" :
                          path.level === "Intermediate" ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                        }`}>
                          {path.level}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          {path.rating}
                        </div>
                      </div>
                      <h3 className="font-heading font-semibold text-xl group-hover:text-primary transition-colors">
                        {path.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{path.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {path.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {path.students}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No paths found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
