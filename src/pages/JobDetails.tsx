import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, Star, Award, TrendingUp } from "lucide-react";
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
    switch (recommendation.toLowerCase()) {
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

  const handleResumeClick = (resumeId: string) => {
    navigate(`/dashboard/jobs/${jobId}/resume/${resumeId}`);
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button Only */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/jobs')}
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
              count: resumes.filter(r => r.final_recommendation?.toLowerCase() === 'strong match').length,
              icon: Star,
              color: "text-green-600 bg-green-100"
            },
            {
              title: "Good Matches",
              count: resumes.filter(r => r.final_recommendation?.toLowerCase() === 'good match').length,
              icon: Award,
              color: "text-blue-600 bg-blue-100"
            },
            {
              title: "Evaluated",
              count: resumes.filter(r => r.evaluated).length,
              icon: TrendingUp,
              color: "text-purple-600 bg-purple-100"
            },
            {
              title: "Total Applications",
              count: resumes.length,
              icon: FileText,
              color: "text-orange-600 bg-orange-100"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Resumes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : resumes.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">Applications will appear here once candidates start applying.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleResumeClick(resume.id)}
                className="cursor-pointer"
              >
                <Card className="border-0 shadow-md bg-white hover:shadow-xl transition-all duration-300 group overflow-hidden">
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
