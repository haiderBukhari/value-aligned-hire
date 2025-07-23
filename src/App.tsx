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
import ApplicationScreening from "./pages/ApplicationScreening";
import InitialInterview from "./pages/InitialInterview";
import SecondaryInterview from "./pages/SecondaryInterview";
import FinalInterview from "./pages/FinalInterview";
import OfferStage from "./pages/OfferStage";
import NotFound from "./pages/NotFound";
import TalentPool from "./pages/TalentPool";
import InterviewDetails from "./pages/InterviewDetails";
import JobAssessmentCenter from "./pages/JobAssessmentCenter";
import JobAssessmentCandidates from "./pages/JobAssessmentCandidates";
import CreateAssignment from "./pages/CreateAssignment";
import ViewAssignment from "./pages/ViewAssignment";
import AssignmentReview from "./pages/AssignmentReview";
import CandidateDetails from "./pages/CandidateDetails";
import CandidateDetailsView from "./pages/CandidateDetailsView";
import InterviewCalendar from "./pages/InterviewCalendar";
import AvailabilitySettings from "./pages/AvailabilitySettings";
import SchedulePage from "./pages/SchedulePage";

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
          <Route path="/viewassignment/:resumeId" element={<ViewAssignment />} />
          <Route path="/schedule/:resumeId" element={<SchedulePage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:jobId" element={<JobDetails />} />
            <Route path="jobs/:jobId/resume/:resumeId" element={<ResumeDetails />} />
            <Route path="jobs/:jobId/interview/:resumeId" element={<InterviewDetails />} />
            <Route path="jobs/:jobId/assessments" element={<JobAssessmentCenter />} />
            <Route path="jobs/:jobId/assessments/candidates" element={<JobAssessmentCandidates />} />
            <Route path="jobs/:jobId/create-assignment" element={<CreateAssignment />} />
            <Route path="jobs/:jobId/assignment-review/:resumeId" element={<AssignmentReview />} />
            <Route path="create-job" element={<CreateJob />} />
            <Route path="talent-pool" element={<TalentPool />} />
            <Route path="talent-pool/:candidateId" element={<CandidateDetailsView />} />
            <Route path="application-screening" element={<ApplicationScreening />} />
            <Route path="assessments" element={<AssessmentCenter />} />
            <Route path="initial-interview" element={<InitialInterview />} />
            <Route path="secondary-interview" element={<SecondaryInterview />} />
            <Route path="final-interview" element={<FinalInterview />} />
            <Route path="offer-stage" element={<OfferStage />} />
            <Route path="pipeline" element={<HiringPipeline />} />
            <Route path="company" element={<CompanyConfiguration />} />
            <Route path="interviews" element={<InterviewManagement />} />
            <Route path="interview-calendar" element={<InterviewCalendar />} />
            <Route path="availability-settings" element={<AvailabilitySettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
