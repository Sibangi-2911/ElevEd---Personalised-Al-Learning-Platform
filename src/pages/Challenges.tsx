import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Zap,
  Clock,
  Trophy,
  CheckCircle2,
  Code,
  Brain,
  Target,
  Flame,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  xp: number;
  time: string;
  category: string;
  completed: boolean;
  leetcodeUrl: string;
};

type Stats = {
  streak: number;
  solved: number;
  xpEarned: number;
  rank: number;
  lastSolvedDate: string;
};

const dailyChallenges = [
  {
    id: 1,
    title: "Two Sum Problem",
    description: "Find two numbers in an array that add up to a target value.",
    difficulty: "Easy",
    xp: 50,
    time: "15 min",
    category: "Arrays",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    description: "Determine if a string of brackets is valid.",
    difficulty: "Easy",
    xp: 50,
    time: "20 min",
    category: "Stacks",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
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
    leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
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
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
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
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
  },
  {
    id: 6,
    title: "Swap Nodes in Pairs",
    description: "Given a linked list, swap every two adjacent nodes and return its head.",
    difficulty: "Medium",
    xp: 100,
    time: "35 min",
    category: "Linked List",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/swap-nodes-in-pairs",
  },
  {
    id: 7,
    title: "Can Place Flowers",
    description: "Given an integer array flowerbed, return true if n new flowers can be planted in the flowerbed without violating the no-adjacent-flowers rule and false otherwise.",
    difficulty: "Easy",
    xp: 50,
    time: "15 min",
    category: "Array",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/can-place-flowers/",
  },
  {
    id: 8,
    title: "Max Consecutive Ones III",
    description: "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's.",
    difficulty: "Medium",
    xp: 100,
    time: "30 min",
    category: "Array, Binary Search, Sliding window",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/",
  },
  {
    id: 9,
    title: " Decode String",
    description: "Given an encoded string, return its decoded string.",
    difficulty: "Medium",
    xp: 100,
    time: "30 min",
    category: "Stack, String, Recursion",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/decode-string/",
  },
  {
    id: 10,
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "Hard",
    xp: 200,
    time: "45 min",
    category: "Array, Two Pointers, Dynamic Programming, Stack",
    completed: false,
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
  },
];

const weeklyStats = {
  streak: 1,
  solved: dailyChallenges.filter((c) => c.completed).length,
  xpEarned: dailyChallenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.xp, 0),
  rank: 500 - dailyChallenges.filter((c) => c.completed).length * 10,
  lastSolvedDate: "",
};

export default function Challenges() {
  const [filter, setFilter] = useState("all");
  const [question, setQuestion] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [challenges, setChallenges] = useState<Challenge[]>(dailyChallenges);
  const [stats, setStats] = useState<Stats>(weeklyStats);

  useEffect(() => {
    fetchProgress();
  }, []);

  const filteredChallenges = challenges.filter((c) => {
    if (filter === "completed") return c.completed;
    if (filter === "pending") return !c.completed;
    return true;
  });
  async function askPeerTwin() {
    if (!question) {
      setAiReply("Please ask a question.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/peer-twin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: question,
          level: "beginner",
          weakTopics: "recursion"
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setAiReply(data.twinReply);
    } catch (error) {
      setAiReply("AI server not responding.");
    }
  }


  async function saveProgress(
    updatedChallenges: Challenge[],
    updatedStats: Stats
  ) {
      try {
        await fetch("http://localhost:5000/api/save-progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "demo@gmail.com",
            solvedChallenges: updatedChallenges
              .filter((c) => c.completed)
              .map((c) => c.id),
            stats: updatedStats,
          }),
        });
        } catch (error) {
        console.error("Save failed", error);
      }
    }

    async function fetchProgress() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/progress/demo@gmail.com"
      );

      const data = await response.json();

      if (!data.stats) return;

      setChallenges((prev) =>
        prev.map((challenge) => ({
          ...challenge,
          completed: data.solvedChallenges.includes(challenge.id),
        }))
      );
      setStats(data.stats);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  }


  async function markSolved(challengeId: number) {
  const solvedChallenge = challenges.find((c) => c.id === challengeId);
  if (!solvedChallenge || solvedChallenge.completed) return;

  const today = new Date().toDateString();

  const updatedChallenges = challenges.map((c) =>
    c.id === challengeId ? { ...c, completed: true } : c
  );

  setChallenges(updatedChallenges);

  setStats((prev) => {
    const newSolved = prev.solved + 1;

    let newStreak = prev.streak;

    if (prev.lastSolvedDate !== today) {
      const lastDate = prev.lastSolvedDate
        ? new Date(prev.lastSolvedDate)
        : null;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
        newStreak = prev.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const updatedStats = {
      ...prev,
      streak: newStreak,
      solved: newSolved,
      xpEarned: prev.xpEarned + solvedChallenge.xp,
      rank: Math.max(1, 500 - newSolved * 10),
      lastSolvedDate: today,
    };

    saveProgress(updatedChallenges, updatedStats);

    return updatedStats;
  });
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/20 border border-warning/30 mb-4">
            <Flame className="w-5 h-5 text-warning" />
            <span className="text-warning font-medium">
              {stats.streak} Day Streak!
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Daily <span className="gradient-text">Challenges</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sharpen your skills with challenges and adapt to your
            progress.
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
            {
              icon: Flame,
              label: "Day Streak",
              value: stats.streak,
              color: "text-warning",
            },
            {
              icon: CheckCircle2,
              label: "Problems Solved",
              value: stats.solved,
              color: "text-success",
            },
            {
              icon: Star,
              label: "XP Earned",
              value: stats.xpEarned,
              color: "text-primary",
            },
            {
              icon: Trophy,
              label: "Global Rank",
              value: `#${stats.rank}`,
              color: "text-accent",
            },
          ].map((stat, index) => (
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

        {/* Filters */}
        {/* Peer Twin AI */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8 p-6 rounded-2xl bg-card border border-border"
        >
          <h2 className="text-xl font-semibold mb-4">Peer Twin AI Tutor</h2>

          <p className="text-sm text-muted-foreground mb-4">
            Ask your AI learning twin about programming concepts or challenge
            hints.
          </p>

          <div className="flex gap-3 mb-3">
            <Input
              placeholder="Ask your AI twin a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <Button onClick={askPeerTwin}>Ask</Button>
          </div>

          {aiReply && (
            <div className="mt-4 rounded-xl bg-secondary/40 p-4">
              <p className="text-sm font-semibold mb-2 text-primary">
                AI Twin:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-sm text-primary">
                {aiReply
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, index) => (
                    <li key={index}>{line.replace("-", "").trim()}</li>
                  ))}
              </ul>
            </div>
          )}
        </motion.div>
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
                challenge.completed
                  ? "border-success/30 bg-success/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      challenge.completed
                        ? "bg-success/20 text-success"
                        : challenge.difficulty === "Easy"
                          ? "bg-success/20 text-success"
                          : challenge.difficulty === "Medium"
                            ? "bg-warning/20 text-warning"
                            : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {challenge.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Code className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          challenge.difficulty === "Easy"
                            ? "bg-success/20 text-success"
                            : challenge.difficulty === "Medium"
                              ? "bg-warning/20 text-warning"
                              : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {challenge.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
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

                  <div className="flex items-center gap-3">
                    {!challenge.completed && (
                      <Button
                        variant="gradient"
                        onClick={() => window.open(challenge.leetcodeUrl, "_blank")}
                      >
                        Solve on LeetCode
                      </Button>
                    )}

                    <Button
                      variant={challenge.completed ? "outline" : "secondary"}
                      disabled={challenge.completed}
                      onClick={() => markSolved(challenge.id)}
                    >
                      {challenge.completed ? "Completed" : "Mark Solved"}
                    </Button>
                  </div>

                  
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
