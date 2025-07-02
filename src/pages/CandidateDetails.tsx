
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Briefcase, Award, TrendingUp, CheckCircle, AlertTriangle, Eye, Calendar, Mail, Phone, MapPin, FileText, Star, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface CandidateStage {
  stage_name: string;
  status: string;
  score: number;
  feedback: string;
  completed_at: string;
  ai_recommendation: string;
}

interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  current_stage: string;
  overall_score: number;
  job_title: string;
  application_date: string;
  cv_url: string;
  cover_letter_url: string;
  stages: CandidateStage[];
  skills: string[];
  experience_years: number;
  education: string;
  summary: string;
}

const CandidateDetails = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();

  const { data: candidate, isLoading, error } = useQuery<CandidateData>({
    queryKey: ['candidate', candidateId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/candidates/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch candidate details');
      }

      return response.json();
    },
    enabled: !!candidateId,
  });

  const getStageColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading candidate details: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-0">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">
          Candidate not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/talent-pool')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Talent Pool
          </Button>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={candidate.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{candidate.name}</h1>
                <p className="text-lg text-gray-600 mb-2">Applying for: {candidate.job_title}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {candidate.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {candidate.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Applied {new Date(candidate.application_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-4">
                <Badge className={`${getStageColor(candidate.current_stage)} px-4 py-2 text-sm font-medium`}>
                  {candidate.current_stage.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500">Overall Score</span>
                <div className={`text-3xl font-bold ${getScoreColor(candidate.overall_score)}`}>
                  {candidate.overall_score}%
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Experience</span>
                    <span className="font-medium">{candidate.experience_years} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Education</span>
                    <span className="font-medium text-sm">{candidate.education}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Skills</span>
                    <span className="font-medium">{candidate.skills.length}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(candidate.cv_url, '_blank')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Resume
                  </Button>
                  {candidate.cover_letter_url && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(candidate.cover_letter_url, '_blank')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Cover Letter
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stages & Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Hiring Stages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Hiring Pipeline Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {candidate.stages.map((stage, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative"
                      >
                        {index < candidate.stages.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-200"></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-100' :
                            stage.status === 'in_progress' ? 'bg-blue-100' :
                            stage.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            {stage.status === 'completed' ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : stage.status === 'failed' ? (
                              <AlertTriangle className="h-6 w-6 text-red-600" />
                            ) : stage.status === 'in_progress' ? (
                              <Clock className="h-6 w-6 text-blue-600" />
                            ) : (
                              <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {stage.stage_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h4>
                              <div className="flex items-center space-x-3">
                                {stage.score > 0 && (
                                  <span className={`text-lg font-bold ${getScoreColor(stage.score)}`}>
                                    {stage.score}%
                                  </span>
                                )}
                                <Badge className={getStageColor(stage.status)}>
                                  {stage.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            
                            {stage.score > 0 && (
                              <div className="mb-3">
                                <Progress value={stage.score} className="h-2" />
                              </div>
                            )}
                            
                            {stage.feedback && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                <h5 className="font-medium text-gray-900 mb-2">Feedback</h5>
                                <p className="text-sm text-gray-700">{stage.feedback}</p>
                              </div>
                            )}
                            
                            {stage.ai_recommendation && (
                              <div className="bg-blue-50 rounded-lg p-4 mb-3">
                                <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                                  <Star className="h-4 w-4 mr-1" />
                                  AI Recommendation
                                </h5>
                                <p className="text-sm text-blue-800">{stage.ai_recommendation}</p>
                              </div>
                            )}
                            
                            {stage.completed_at && (
                              <p className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Completed on {new Date(stage.completed_at).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
