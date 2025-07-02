import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, Star, Award, TrendingUp, CheckCircle, AlertTriangle, Info, CloudCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
  evaluated: boolean;
  created_at: string;
}

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  // Fetch job details for title
  const { data: job, isLoading: isJobLoading, error: jobError } = useQuery({
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

  const { data: resumes = [], isLoading, error } = useQuery({
    queryKey: ['resumes', jobId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${jobId}`, {
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleResumeClick = (resume: Resume) => {
    if (resume.evaluated) {
      navigate(`/dashboard/jobs/${jobId}/resume/${resume.id}`);
    } else {
      toast.info("This resume is currently being evaluated by our AI.", {
        description: "Please check back in a few moments. Scores will appear here automatically.",
      });
    }
  };

  // Sort resumes by total_weighted_score descending
  const sortedResumes = [...resumes].sort((a, b) => b.total_weighted_score - a.total_weighted_score);

  // Helper to parse skills markdown into sections
  function parseSkills(skillsText: string) {
    const positive: string[] = [];
    const potential: string[] = [];
    const further: string[] = [];
    const recency: string[] = [];
    let current: string | null = null;
    skillsText.split(/\r?\n/).forEach(line => {
      if (/^\*+\s*\*\*Positive Matches:?/.test(line)) current = 'positive';
      else if (/^\*+\s*\*\*Potential Matches:?/.test(line)) current = 'potential';
      else if (/^\*+\s*\*\*Areas for Further Exploration:?/.test(line)) current = 'further';
      else if (/^\*+\s*\*\*Recency:?/.test(line) || /^\*+\s*\*\*Continuous Learning:?/.test(line)) current = 'recency';
      else if (/^\*+\s*\*\*/.test(line)) current = null;
      else if (/^\*\s+/.test(line) && current) {
        const clean = line.replace(/^\*\s+/, '').replace(/\*\*/g, '').trim();
        if (current === 'positive') positive.push(clean);
        else if (current === 'potential') potential.push(clean);
        else if (current === 'further') further.push(clean);
        else if (current === 'recency') recency.push(clean);
      }
    });
    return { positive, potential, further, recency };
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading resumes: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-0">
      <div className="max-w-full mx-auto">
        {/* Job Title Header */}
        <div className="text-center mb-8 mt-6">
          {isJobLoading ? (
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-4 mx-auto" />
          ) : job && job.title ? (
            <>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {job.title}
              </h1>
            </>
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Details</h1>
          )}
        </div>

        <div className="mb-3">
          <Button
            variant="ghost"
            onClick={() => navigate(`/dashboard/jobs`)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Strong Matches",
              count: resumes.filter(r => r.final_recommendation?.toLowerCase() === 'strong match.').length,
              icon: <Star className="h-7 w-7" />,
              iconBg: "bg-green-100 text-green-500",
              cardBg: "bg-gradient-to-br from-green-50 to-white",
            },
            {
              title: "Moderate Fit",
              count: resumes.filter(r => r.final_recommendation?.toLowerCase() === 'moderate fit.').length,
              icon: <Award className="h-7 w-7" />,
              iconBg: "bg-yellow-100 text-yellow-500",
              cardBg: "bg-gradient-to-br from-yellow-50 to-white",
            },
            {
              title: "Not a Fit",
              count: resumes.filter(r => r.final_recommendation?.toLowerCase() === 'not a fit.').length,
              icon: <FileText className="h-7 w-7" />,
              iconBg: "bg-red-100 text-red-500",
              cardBg: "bg-gradient-to-br from-red-50 to-white",
            },
            {
              title: "Total Applicants",
              count: resumes.length,
              icon: <FileText className="h-7 w-7" />,
              iconBg: "bg-orange-100 text-orange-500",
              cardBg: "bg-gradient-to-br from-orange-50 to-white",
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`rounded-2xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:ring-2 hover:ring-blue-200 ${stat.cardBg}`}
                style={{ minHeight: 110 }}
              >
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">{stat.title}</div>
                  <div className="text-4xl font-extrabold text-gray-900 leading-tight">{stat.count}</div>
                </div>
                <div className={`flex items-center justify-center rounded-full ${stat.iconBg} shadow-md h-12 w-12 transition-transform duration-200 group-hover:animate-bounce`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <hr className="my-8 border-t border-gray-200" />

        {/* Resumes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : sortedResumes.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Applications will appear here once candidates start applying.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {sortedResumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleResumeClick(resume)}
                className={`relative ${resume.evaluated ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {!resume.evaluated && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl p-4 text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <p className="mt-3 font-semibold text-gray-800">AI Evaluation in Progress</p>
                    <p className="mt-1 text-xs text-gray-600">Scores will appear here soon.</p>
                  </div>
                )}
                <Card className={`border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group ${index === 0 ? 'ring-2 ring-blue-400' : ''}`}>
                  {/* Rank Badge */}
                  <div className="absolute top-[-10px] right-0 z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                      Rank #{index + 1}
                    </span>
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resume.applicant_name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{resume.email}</p>
                      </div>
                      <Badge className={`${getRecommendationColor(resume.final_recommendation)} border-0 font-medium px-3 py-1 text-xs`}>
                        {resume.final_recommendation}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Enhanced CV Preview */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-40 flex flex-col items-center justify-center mb-6 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300 border border-gray-200">
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-2 w-16 h-20 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-blue-500" />
                      </div>
                      <span className="text-sm text-gray-600 font-medium">CV Preview</span>
                      <div className="w-12 h-1 bg-blue-500 rounded-full mt-2 opacity-60"></div>
                    </div>
                    {/* Scores */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">Overall Score</span>
                        <span className={`text-lg font-bold ${getScoreColor(resume.total_weighted_score)}`}>
                          {resume.total_weighted_score}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Company</span>
                          <span className={`font-medium ${getScoreColor(resume.company_fit_score)}`}>{resume.company_fit_score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Culture</span>
                          <span className={`font-medium ${getScoreColor(resume.culture_score)}`}>{resume.culture_score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience</span>
                          <span className={`font-medium ${getScoreColor(resume.experience_score)}`}>{resume.experience_score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Skills</span>
                          <span className={`font-medium ${getScoreColor(resume.skill_score)}`}>{resume.skill_score}%</span>
                        </div>
                      </div>
                      {/* Enhanced Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 relative"
                          style={{ width: `${resume.total_weighted_score}%` }}
                        >
                          <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    {/* Applied Date */}
                    <p className="text-xs text-gray-500 mt-4 flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      Applied {new Date(resume.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
