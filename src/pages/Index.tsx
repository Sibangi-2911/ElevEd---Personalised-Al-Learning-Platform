import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Target, 
  Briefcase, 
  Play,
  CheckCircle2,
  Users,
  TrendingUp,
  Star
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Personalized Learning Paths",
    description: "AI-powered course recommendations tailored to your skill level and career goals.",
    color: "from-primary to-info",
  },
  {
    icon: Zap,
    title: "Daily Challenges",
    description: "Adaptive coding challenges that evolve with your progress.",
    color: "from-warning to-destructive",
  },
  {
    icon: Target,
    title: "AI Assessments",
    description: "Continuous skill evaluation with actionable feedback.",
    color: "from-accent to-success",
  },
  {
    icon: Briefcase,
    title: "Career Guidance",
    description: "Resume building, mock interviews, and portfolio showcase tools.",
    color: "from-info to-primary",
  },
];

const stats = [
  { value: "50K+", label: "Active Learners" },
  { value: "200+", label: "Learning Paths" },
  { value: "95%", label: "Success Rate" },
  { value: "500+", label: "Partner Companies" },
];

const paths = [
  { name: "Full Stack Development", students: "12,450", duration: "16 weeks" },
  { name: "Data Structures & Algorithms", students: "8,230", duration: "12 weeks" },
  { name: "DevOps Engineering", students: "5,890", duration: "14 weeks" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-info/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-6"
              >
                <Star className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted-foreground"></span>
              </motion.div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Elevate Your
                <span className="gradient-text block">Education Journey</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                AI-powered personalized learning paths, daily challenges, and career guidance 
                to bridge the gap between academia and your dream job.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth?mode=signup">
                  <Button variant="gradient" size="xl" className="group">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/paths/fullstack">
                  <Button variant="glass" size="xl" className="group">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <div className="font-heading text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="gradient-border p-6 rounded-2xl bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">Your Learning Path</h3>
                      <p className="text-sm text-muted-foreground">Full Stack Development</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {["React Fundamentals", "Node.js Backend", "Database Design"].map((item, i) => (
                      <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <CheckCircle2 className={`w-5 h-5 ${i < 2 ? "text-success" : "text-muted-foreground"}`} />
                        <span className={i < 2 ? "text-foreground" : "text-muted-foreground"}>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">67%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "67%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="h-full gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 p-4 rounded-xl bg-card border border-border shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    <span className="font-medium">Daily Streak: 7</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-card border border-border shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <span className="font-medium">+23% this week</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform adapts to your learning style and career goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Paths */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
          >
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">
                Popular <span className="gradient-text">Learning Paths</span>
              </h2>
              <p className="text-muted-foreground">Start your journey with our most loved courses.</p>
            </div>
            <Link to="/paths">
              <Button variant="outline" className="group">
                View All Paths
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {paths.map((path, index) => (
              <motion.div
                key={path.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/paths/${path.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300">
                    <div className="h-32 gradient-primary opacity-80" />
                    <div className="p-6">
                      <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {path.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {path.students}
                        </span>
                        <span>{path.duration}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[150px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Career?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              
            </p>
            <Link to="/auth?mode=signup">
              <Button variant="gradient" size="xl" className="group">
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold gradient-text">ElevEd</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ElevEd. Elevate Your Education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
