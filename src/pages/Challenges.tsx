import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Clock, 
  Trophy,
  CheckCircle2,
  Code,
  Brain,
  Target,
  Flame,
  Star
} from "lucide-react";
import { useState } from "react";

const dailyChallenges = [
  {
    id: 1,
    title: "Two Sum Problem",
    description: "Find two numbers in an array that add up to a target value.",
    difficulty: "Easy",
    xp: 50,
    time: "15 min",
    category: "Arrays",
    completed: true,
  },
  {
    id: 2,
    title: "Valid Parentheses",
    description: "Determine if a string of brackets is valid.",
    difficulty: "Easy",
    xp: 50,
    time: "20 min",
    category: "Stacks",
    completed: true,
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    description: "Merge two sorted linked lists into one sorted list.",
    difficulty: "Medium",
    xp: 100,
    time: "25 min",
    category: "Linked Lists",
    completed: false,
  },
  {
    id: 4,
    title: "Binary Tree Level Order",
    description: "Traverse a binary tree level by level.",
    difficulty: "Medium",
    xp: 100,
    time: "30 min",
    category: "Trees",
    completed: false,
  },
  {
    id: 5,
    title: "LRU Cache",
    description: "Implement a Least Recently Used cache.",
    difficulty: "Hard",
    xp: 200,
    time: "45 min",
    category: "Design",
    completed: false,
  },
];

const weeklyStats = {
  streak: 7,
  solved: 23,
  xpEarned: 1250,
  rank: 156,
};

export default function Challenges() {
  const [filter, setFilter] = useState("all");

  const filteredChallenges = dailyChallenges.filter(c => {
    if (filter === "completed") return c.completed;
    if (filter === "pending") return !c.completed;
    return true;
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/20 border border-warning/30 mb-4">
            <Flame className="w-5 h-5 text-warning" />
            <span className="text-warning font-medium">{weeklyStats.streak} Day Streak!</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Daily <span className="gradient-text">Challenges</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sharpen your skills with AI-generated challenges that adapt to your progress.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Flame, label: "Day Streak", value: weeklyStats.streak, color: "text-warning" },
            { icon: CheckCircle2, label: "Problems Solved", value: weeklyStats.solved, color: "text-success" },
            { icon: Star, label: "XP Earned", value: weeklyStats.xpEarned, color: "text-primary" },
            { icon: Trophy, label: "Global Rank", value: `#${weeklyStats.rank}`, color: "text-accent" },
          ].map((stat, index) => (
            <div key={stat.label} className="p-4 rounded-xl bg-card border border-border">
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
              <div className="font-heading text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-8"
        >
          {["all", "pending", "completed"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </motion.div>

        {/* Challenges List */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`group p-6 rounded-2xl bg-card border transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${
                challenge.completed ? "border-success/30 bg-success/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    challenge.completed 
                      ? "bg-success/20 text-success" 
                      : challenge.difficulty === "Easy" ? "bg-success/20 text-success"
                      : challenge.difficulty === "Medium" ? "bg-warning/20 text-warning"
                      : "bg-destructive/20 text-destructive"
                  }`}>
                    {challenge.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Code className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        challenge.difficulty === "Easy" ? "bg-success/20 text-success" :
                        challenge.difficulty === "Medium" ? "bg-warning/20 text-warning" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {challenge.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {challenge.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning" />
                      {challenge.xp} XP
                    </span>
                  </div>
                  <Button 
                    variant={challenge.completed ? "outline" : "gradient"}
                    disabled={challenge.completed}
                  >
                    {challenge.completed ? "Completed" : "Solve Now"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
