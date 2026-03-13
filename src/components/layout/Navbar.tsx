import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Zap,
  ClipboardCheck,
  Briefcase,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { Brain } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: null },
  { name: "Learning Paths", path: "/paths", icon: BookOpen },
  { name: "Challenges", path: "/challenges", icon: Zap },
  { name: "Assessments", path: "/assessments", icon: ClipboardCheck },
  { name: "Career", path: "/career", icon: Briefcase },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl gradient-text">
              ElevEd
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link key={item.name} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`relative ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                <Link
                  to="/auth"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="flex-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="gradient" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
