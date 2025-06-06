
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ResumeDetails from "./pages/ResumeDetails";
import CreateJob from "./pages/CreateJob";
import JobApplication from "./pages/JobApplication";
import CompanyConfiguration from "./pages/CompanyConfiguration";
import InterviewManagement from "./pages/InterviewManagement";
import AssessmentCenter from "./pages/AssessmentCenter";
import HiringPipeline from "./pages/HiringPipeline";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/apply/:jobId" element={<JobApplication />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:jobId" element={<JobDetails />} />
            <Route path="jobs/:jobId/resume/:resumeId" element={<ResumeDetails />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="company" element={<CompanyConfiguration />} />
            <Route path="interviews" element={<InterviewManagement />} />
            <Route path="assessments" element={<AssessmentCenter />} />
            <Route path="pipeline" element={<HiringPipeline />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
