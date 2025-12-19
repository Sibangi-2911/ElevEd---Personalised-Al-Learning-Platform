import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import LearningPaths from "./pages/LearningPaths";
import PathDetail from "./pages/PathDetail";
import Challenges from "./pages/Challenges";
import Assessments from "./pages/Assessments";
import Career from "./pages/Career";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/paths" element={<LearningPaths />} />
            <Route path="/paths/:pathId" element={<PathDetail />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/career" element={<Career />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
