import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, ExternalLink, Star, Award, Brain, Users, Eye, Calendar, ClipboardList, Briefcase, MessageCircle, History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.31/pdf.worker.min.js';

interface Resume {
  id: string;
  applicant_name: string;
  email: string;
  cv_link: string;
  coverletter_link: string;
  company_fit_score: number;
  culture_score: number;
  experience_score: number;
  skill_score: number;
  total_weighted_score: number;
  final_recommendation: string;
  company_fit_reason: string;
  culture_reason: string;
  experience_reason: string;
  skill_reason: string;
  experience_facts: string[];
  level_suggestion: string;
  evaluated: boolean;
  created_at: string;
}

const InterviewDetails = () => {
  const { jobId, resumeId } = useParams<{ jobId: string; resumeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const stage = params.get("stage") || "Initial Interview";
  const [documentModal, setDocumentModal] = useState<{ isOpen: boolean; type: 'cv' | 'cover' | null; url: string }>({
    isOpen: false,
    type: null,
    url: ''
  });
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleDetails, setScheduleDetails] = useState({ date: '', time: '', notes: '', meetLink: '' });
  const [interviewQuestions, setInterviewQuestions] = useState<{ job: string[]; prior_experience: string[]; soft_skills: string[] } | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [interviewScheduled, setInterviewScheduled] = useState(false);
  const [nextStep, setNextStep] = useState<string | null>(null);
  const [moveModal, setMoveModal] = useState(false);
  const [feedback, setFeedback] = useState({
    overall: 3,
    professionalism: 3,
    communication: 3,
    technical: 3,
    notes: '',
    transcript: null as File | null,
  });
  const [scheduledInterview, setScheduledInterview] = useState<null | { date: string; time: string; meet_link: string; notes?: string }>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [canMoveNext, setCanMoveNext] = useState(false);
  const [transcriptUrl, setTranscriptUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aiDetails, setAiDetails] = useState<any>(null);

  // Fetch resumes for this job
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes', jobId, stage],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${jobId}?stage=${encodeURIComponent(stage)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      const data = await response.json();
      return data.resumes || [];
    },
    enabled: !!jobId,
  });

  const resume = resumes.find((r: Resume) => r.id === resumeId);

  // Fetch job details for title
  const { data: job, isLoading: isJobLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch job details');
      const data = await response.json();
      return data;
    },
    enabled: !!jobId,
  });

  // Fetch interview questions on mount or when resume changes
  useEffect(() => {
    if (!resume) return;
    const fieldMap = {
      'Initial Interview': 'initial_interview_question',
      'Final Interview': 'final_interview_question',
      'Secondary Interview': 'scondary_interview_question',
    };
    const field = fieldMap[stage] || fieldMap['Initial Interview'];
    const questionsFromResume = resume[field];
    if (questionsFromResume && questionsFromResume.job) {
      setInterviewQuestions(questionsFromResume);
      setIsLoadingQuestions(false);
      return;
    }
    // If not present, POST to /interview/generate
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/interview/generate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume_id: resume.id, stage }),
        });
        if (!response.ok) throw new Error('Failed to generate interview questions');
        const data = await response.json();
        setInterviewQuestions(data.questions);
      } catch (err) {
        toast.error('Could not generate interview questions.');
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [resume, stage]);

  // Fetch next step after scheduling
  useEffect(() => {
    if (!interviewScheduled && !moveModal) return;
    if (!resume) return;
    const fetchNextStep = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${resume.id}/next-step`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch next step');
        const data = await response.json();
        setNextStep(data.next_step || null);
      } catch {
        setNextStep(null);
      }
    };
    fetchNextStep();
  }, [interviewScheduled, moveModal, resume]);

  // When resume is loaded, check for schedule for the current stage
  useEffect(() => {
    if (!resume) return;
    const fieldMap = {
      'Initial Interview': 'initial_interview_schedule',
      'Final Interview': 'final_interview_schedule',
      'Secondary Interview': 'scondary_interview_schedule',
    };
    const field = fieldMap[stage] || fieldMap['Initial Interview'];
    if (resume[field]) {
      setScheduledInterview(resume[field]);
    }
  }, [resume, stage]);

  // Schedule interview POST
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/interview/schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resume.id,
          stage,
          schedule: {
            date: scheduleDetails.date,
            time: scheduleDetails.time,
            meet_link: scheduleDetails.meetLink,
            notes: scheduleDetails.notes,
          },
        }),
      });
      if (!response.ok) throw new Error('Failed to schedule interview');
      const data = await response.json();
      toast.success('Interview scheduled successfully!');
      setScheduleModal(false);
      setInterviewScheduled(true);
      setScheduledInterview(data.schedule);
    } catch (err) {
      toast.error('Could not schedule interview.');
    }
  };

  // Add uploadToCloudinary helper (copy from JobApplication.tsx)
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products"); // Change to your actual upload preset if needed
    const response = await fetch("https://api.cloudinary.com/v1_1/djunaxxv0/raw/upload", {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }
    const result = await response.json();
    return result.secure_url;
  };

  // Feedback modal submit (placeholder POST)
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return;
    setIsSubmittingFeedback(true);
    setAiSuggestion(null);
    setAiScore(null);
    setAiDetails(null);
    setCanMoveNext(false);
    try {
      // Prepare details object
      let transcriptPdfBase64 = null;
      if (feedback.transcript) {
        transcriptPdfBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]);
            } else {
              resolve(null);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(feedback.transcript);
        });
      }
      const details = {
        overall: feedback.overall,
        professionalism: feedback.professionalism,
        communication: feedback.communication,
        job_related_skill: feedback.technical,
        detailed_feedback: feedback.notes,
        transcript_pdf: transcriptUrl,
        manual_feedback: feedback.notes,
      };
      const token = localStorage.getItem('token');
      // 1. Add interview details (AI evaluation)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add-interview-details?stage=${encodeURIComponent(stage)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resume.id,
          details: { ...details, stage },
        }),
      });
      if (!response.ok) throw new Error('Failed to submit interview details');
      const data = await response.json();
      setAiSuggestion(data.suggestion || (data.details && data.details.suggestion) || null);
      setAiScore(data.score || (data.details && data.details.score) || null);
      setAiDetails(data.details || null);
      setCanMoveNext(true);
      toast.success('AI evaluation complete! Review the suggestion below.');
      setIsSubmittingFeedback(false);
    } catch (err) {
      toast.error('Could not submit feedback for AI evaluation.');
      setIsSubmittingFeedback(false);
    }
  };

  const handleMoveToNextStage = async () => {
    if (!resume) return;
    setIsSubmittingFeedback(true);
    try {
      const token = localStorage.getItem('token');
      const moveResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${resume.id}/next-step`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!moveResp.ok) throw new Error('Failed to move to next stage');
      const moveData = await moveResp.json();
      toast.success(`Moved to: ${moveData.current_step || moveData.message}`);
      setMoveModal(false);
      setIsSubmittingFeedback(false);
    } catch (err) {
      toast.error('Could not move to next stage.');
      setIsSubmittingFeedback(false);
    }
  };

  const openDocumentModal = (type: 'cv' | 'cover', url: string) => {
    if (!url || url.trim() === '') return;
    setDocumentModal({ isOpen: true, type, url });
  };
  const closeDocumentModal = () => setDocumentModal({ isOpen: false, type: null, url: '' });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }
  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Not Found</h2>
          <p className="text-gray-600 mb-4">The requested resume could not be found.</p>
          <Button onClick={() => navigate(`/dashboard/jobs/${jobId}`)}>
            Back to Job Details
          </Button>
        </div>
      </div>
    );
  }

  // Score color helpers
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case 'strong match':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-300 shadow-lg transform rotate-1';
      case 'good match':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-300 shadow-lg transform -rotate-1';
      case 'moderate fit':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-300 shadow-lg transform rotate-1';
      case 'partial match':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-300 shadow-lg transform rotate-1';
      case 'weak match':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-300 shadow-lg transform -rotate-1';
      case 'not a fit':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300 shadow-lg transform rotate-1';
      case 'no match':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-300 shadow-lg transform rotate-1';
      default:
        return 'bg-gray-500 text-white border-gray-300';
    }
  };
  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'senior':
        return 'bg-purple-100 text-purple-800';
      case 'mid':
        return 'bg-blue-100 text-blue-800';
      case 'junior':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Skills breakdown parser (from ResumeDetails)
  function renderSkillsBreakdown(text: string) {
    const sections = [];
    if (text.includes('- **')) {
      const parts = text.split('- **').filter(p => p.trim());
      for (const part of parts) {
        const marker = ':**';
        const markerIndex = part.indexOf(marker);
        if (markerIndex !== -1) {
          const heading = part.substring(0, markerIndex).trim();
          const content = part.substring(markerIndex + marker.length).trim();
          sections.push({ heading, content });
        }
      }
    }
    if (sections.length > 0) {
      return (
        <div className="space-y-4">
          {sections.map((sec, i) => (
            <div key={i}>
              <div className="font-semibold text-gray-800 flex items-center mb-1">
                <Star className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                {sec.heading}
              </div>
              <p className="text-gray-600 pl-7">{sec.content}</p>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-2">
          <div className="font-semibold text-gray-800 flex items-center">
            <Star className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
            Skills Summary
          </div>
          <p className="text-gray-600 pl-7">{text}</p>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto p-6 pt-0">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        {/* Job Title and Overall Score */}
        <div className="flex items-center justify-between mb-8 mt-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {job?.title}
          </h1>
          <span className="font-bold text-2xl text-gray-800 ml-4">{resume.total_weighted_score}% Overall</span>
        </div>
        {/* Schedule Interview Button */}
        {scheduledInterview && scheduledInterview.date && scheduledInterview.time ? (
          <div className="flex justify-end mb-8">
            <Button
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setMoveModal(true)}
            >
              <span className="mr-2">{nextStep ? `Move to ${nextStep}` : 'Move to Next Stage'}</span>
            </Button>
          </div>
        ) : (
          <div className="flex justify-end mb-8">
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setScheduleModal(true)}
            >
              <Calendar className="mr-2 h-5 w-5" /> Schedule Interview
            </Button>
          </div>
        )}
        {/* Scheduled Interview Info */}
        {scheduledInterview && (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow">
              <div>
                <div className="text-sm text-gray-500 mb-1 font-semibold">Interview Scheduled</div>
                <div className="text-lg font-bold text-gray-900">{scheduledInterview.date} at {scheduledInterview.time}</div>
                {scheduledInterview.notes && <div className="text-sm text-gray-600 mt-1">Notes: {scheduledInterview.notes}</div>}
              </div>
              <div className="flex items-center gap-3">
                <a href={scheduledInterview.meet_link} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 shadow hover:from-blue-700 hover:to-purple-700">Join Interview</Button>
                </a>
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className="flex gap-5">
          {/* Left Column - Resume & Applicant Info */}
          <div className="space-y-6 w-[48%]">
            {/* Show Interview Notes if scheduled and notes exist */}
            {scheduledInterview && scheduledInterview.notes && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-2 shadow flex items-start gap-3">
                <ClipboardList className="h-5 w-5 text-yellow-500 mt-1" />
                <div>
                  <div className="font-semibold text-yellow-800 mb-1">Interview Notes</div>
                  <div className="text-gray-800 whitespace-pre-line">{scheduledInterview.notes}</div>
                </div>
              </div>
            )}
            {/* Applicant Info */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ClipboardList className="h-6 w-6" /> Applicant & Resume Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{resume.applicant_name}</h2>
                  <p className="text-gray-600 mb-2">{resume.email}</p>
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <Badge className={`px-4 py-2 text-sm font-medium ${getLevelColor(resume.level_suggestion)}`}>{resume.level_suggestion} Level</Badge>
                    <Badge className={`px-4 py-2 text-sm font-medium ${getRecommendationColor(resume.final_recommendation)}`}>{resume.final_recommendation}</Badge>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Applied: </span>
                    <span className="font-semibold text-gray-900">{new Date(resume.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => openDocumentModal('cv', resume.cv_link)} className="hover:bg-blue-50 hover:border-blue-300">
                      <Eye className="mr-2 h-4 w-4" /> View CV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(resume.cv_link, '_blank')} className="hover:bg-blue-50 hover:border-blue-300">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openDocumentModal('cover', resume.coverletter_link)} className="hover:bg-purple-50 hover:border-purple-300">
                      <Eye className="mr-2 h-4 w-4" /> View Cover Letter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(resume.coverletter_link, '_blank')} className="hover:bg-purple-50 hover:border-purple-300">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Score Breakdown */}
                <div className="mt-6">
                  {/* Company Fit */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500"><Brain className="h-5 w-5 text-white" /></div>
                        <span className="font-semibold text-gray-900 text-lg">Company Fit</span>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(resume.company_fit_score)}`}>{resume.company_fit_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${resume.company_fit_score}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{resume.company_fit_reason}</p>
                  </motion.div>
                  {/* Culture Fit */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500"><Users className="h-5 w-5 text-white" /></div>
                        <span className="font-semibold text-gray-900 text-lg">Culture Fit</span>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(resume.culture_score)}`}>{resume.culture_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500" style={{ width: `${resume.culture_score}%` }}></div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{resume.culture_reason}</p>
                  </motion.div>
                </div>
                {/* Experience full width */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500"><Award className="h-5 w-5 text-white" /></div>
                      <span className="font-semibold text-gray-900 text-lg">Experience</span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(resume.experience_score)}`}>{resume.experience_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500" style={{ width: `${resume.experience_score}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{resume.experience_reason}</p>
                </motion.div>
                {/* Skills full width at bottom */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500"><Star className="h-5 w-5 text-white" /></div>
                      <span className="font-semibold text-gray-900 text-lg">Skills</span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(resume.skill_score)}`}>{resume.skill_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500" style={{ width: `${resume.skill_score}%` }}></div>
                  </div>
                  {renderSkillsBreakdown(resume.skill_reason || "")}
                </motion.div>
                {/* Key Experience Highlights */}
                <Card className="border-0 shadow-none bg-transparent mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="h-5 w-5" /> Key Experience Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {resume.experience_facts.map((fact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{fact}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
          {/* Right Column - Interview Questions */}
          <div className="space-y-6 w-[50%]">
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-100 via-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <MessageCircle className="h-7 w-7 text-blue-500" /> Interview Questions
                  </CardTitle>
                </CardHeader>
                {isLoadingQuestions ? (
                  <div className="relative min-h-[220px] flex items-center justify-center overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <motion.div
                        animate={{ x: [0, 100, 0], y: [0, -100, 0], rotate: [0, 180, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-4 left-4 w-16 h-16 bg-blue-200 opacity-20 rounded-full"
                      />
                      <motion.div
                        animate={{ x: [0, -80, 0], y: [0, 60, 0], rotate: [360, 180, 0] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        className="absolute bottom-4 right-4 w-24 h-24 bg-purple-200 opacity-20 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
                      />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center relative z-10"
                    >
                      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Generating interview questions...
                      </h2>
                      <p className="text-gray-600">Please wait while we generate tailored questions for this candidate.</p>
                    </motion.div>
                  </div>
                ) : interviewQuestions ? (
                  <CardContent className="space-y-8">
                    {/* Job-Related Questions */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-lg text-purple-800">Job-Related Questions</span>
                      </div>
                      <ul className="list-disc pl-8 space-y-2">
                        {interviewQuestions.job.map((q, i) => (
                          <li key={i} className="text-base text-gray-800">{q}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Prior Experience Questions */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <History className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-lg text-blue-800">Prior Experience Questions</span>
                      </div>
                      <ul className="list-disc pl-8 space-y-2">
                        {interviewQuestions.prior_experience.map((q, i) => (
                          <li key={i} className="text-base text-gray-800">{q}</li>
                        ))}
                      </ul>
                    </div>
                    {/* Soft Skills/Behavioral Questions */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-lg text-green-800">Soft Skills & Behavioral</span>
                      </div>
                      <ul className="list-disc pl-8 space-y-2">
                        {interviewQuestions.soft_skills.map((q, i) => (
                          <li key={i} className="text-base text-gray-800">{q}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                ) : (
                  <div className="text-center text-gray-500 py-8">No interview questions available.</div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Schedule Interview Modal */}
      <Dialog open={scheduleModal} onOpenChange={setScheduleModal}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" /> Schedule Interview
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleScheduleInterview}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border rounded px-3 py-2" value={scheduleDetails.date} onChange={e => setScheduleDetails({ ...scheduleDetails, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" className="w-full border rounded px-3 py-2" value={scheduleDetails.time} onChange={e => setScheduleDetails({ ...scheduleDetails, time: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea className="w-full border rounded px-3 py-2" rows={3} value={scheduleDetails.notes} onChange={e => setScheduleDetails({ ...scheduleDetails, notes: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meet Link</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="https://meet.example.com/..." value={scheduleDetails.meetLink} onChange={e => setScheduleDetails({ ...scheduleDetails, meetLink: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setScheduleModal(false)} type="button">Cancel</Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" type="submit">Schedule</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Document Modal */}
      <Dialog open={documentModal.isOpen} onOpenChange={closeDocumentModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              {documentModal.type === 'cv' ? (
                <>
                  <Download className="h-5 w-5 text-red-600" /> CV / Resume - {resume?.applicant_name}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 text-blue-600" /> Cover Letter - {resume?.applicant_name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 pt-2">
            {documentModal.url ? (
              <iframe src={documentModal.url} className="w-full h-full border-0 rounded-lg" title={documentModal.type === 'cv' ? 'CV Preview' : 'Cover Letter Preview'} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Download className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Document not available</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Move to Next Stage Modal */}
      <Dialog open={moveModal} onOpenChange={setMoveModal}>
        <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Move to Next Stage
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
            <div className="flex flex-col gap-4">
              {/* Upload PDF full width */}
              <div className="w-full flex flex-col gap-2">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Upload Transcribed Audio (PDF)</label>
                <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-6 cursor-pointer text-center shadow-sm">
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-10 w-10 text-blue-500 mb-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m0 0v2m0-2h2m-2 0H8m4-6v6m0 0a4 4 0 01-4-4V7a4 4 0 018 0v6a4 4 0 01-4 4z' /></svg>
                  <span className="font-medium text-blue-700">Drag & drop or click to upload PDF file</span>
                  <span className="text-xs text-gray-500 mt-1">PDF only (max 20MB)</span>
                  {feedback.transcript && <span className="mt-2 text-green-600 font-semibold">{feedback.transcript.name}</span>}
                  <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={async e => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setUploading(true);
                      try {
                        const url = await uploadToCloudinary(file);
                        setTranscriptUrl(url);
                        setFeedback(f => ({ ...f, transcript: file }));
                        toast.success('Transcript PDF uploaded successfully!');
                      } catch (error) {
                        toast.error('Failed to upload transcript PDF');
                        setTranscriptUrl(null);
                      } finally {
                        setUploading(false);
                      }
                      // Optionally, still extract and log text for dev
                      const reader = new FileReader();
                      reader.onload = async function(ev) {
                        try {
                          if (ev.target && ev.target.result && ev.target.result instanceof ArrayBuffer) {
                            const typedarray = new Uint8Array(ev.target.result);
                            const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                            let fullText = '';
                            for (let i = 1; i <= pdf.numPages; i++) {
                              const page = await pdf.getPage(i);
                              const content = await page.getTextContent();
                              const strings = content.items
                                .map(item => (typeof item === 'object' && 'str' in item && typeof (item as any).str === 'string' ? (item as any).str : ''))
                                .filter(Boolean);
                              fullText += strings.join(' ') + '\n';
                            }
                            console.log('========== PDF Text Content ==========');
                            console.log(fullText);
                            console.log('======================================');
                          } else {
                            console.error('FileReader result is not an ArrayBuffer.');
                          }
                        } catch (err) {
                          console.error('Error reading PDF:', err);
                        }
                      };
                      reader.readAsArrayBuffer(file);
                    }
                  }} />
                </label>
              </div>
              {/* Ratings grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
                  <select className="w-full border rounded px-3 py-2" value={feedback.overall} onChange={e => setFeedback(f => ({ ...f, overall: Number(e.target.value) }))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professionalism</label>
                  <select className="w-full border rounded px-3 py-2" value={feedback.professionalism} onChange={e => setFeedback(f => ({ ...f, professionalism: Number(e.target.value) }))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Communication</label>
                  <select className="w-full border rounded px-3 py-2" value={feedback.communication} onChange={e => setFeedback(f => ({ ...f, communication: Number(e.target.value) }))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Related Skill</label>
                  <select className="w-full border rounded px-3 py-2" value={feedback.technical} onChange={e => setFeedback(f => ({ ...f, technical: Number(e.target.value) }))}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              {/* Additional Feedback full width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Feedback</label>
                <textarea className="w-full border rounded-xl px-3 py-2 min-h-[90px] shadow-sm focus:ring-2 focus:ring-blue-300" rows={4} value={feedback.notes} onChange={e => setFeedback(f => ({ ...f, notes: e.target.value }))} placeholder="Type feedback here..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setMoveModal(false)} type="button">Cancel</Button>
              {!canMoveNext ? (
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white" type="submit" disabled={isSubmittingFeedback}>
                  {isSubmittingFeedback ? 'Submitting...' : 'Send to AI for Evaluation'}
                </Button>
              ) : null}
            </div>
          </form>
          {canMoveNext && aiDetails && (
            <div className="mt-6 p-6 rounded-xl bg-blue-50 border border-blue-200 shadow">
              <div className="font-bold text-blue-900 text-lg mb-2">AI Evaluation Result</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {Object.entries(aiDetails).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <span className="font-semibold text-gray-700 capitalize mr-2">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
              {aiScore !== null && <div className="text-lg font-bold text-blue-700 mb-1">Score: {aiScore}</div>}
              {aiSuggestion && <div className="text-gray-800 whitespace-pre-line mb-4">{aiSuggestion}</div>}
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white" type="button" onClick={handleMoveToNextStage} disabled={isSubmittingFeedback}>
                {isSubmittingFeedback ? 'Moving...' : `Move to ${nextStep || 'Next Stage'}`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewDetails; 