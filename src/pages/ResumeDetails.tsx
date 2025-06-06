
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, ExternalLink, Star, Award, Brain, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

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

const ResumeDetails = () => {
  const { jobId, resumeId } = useParams<{ jobId: string; resumeId: string }>();
  const navigate = useNavigate();

  const { data: resumes = [], isLoading } = useQuery({
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

  const resume = resumes.find((r: Resume) => r.id === resumeId);

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case 'strong match':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good match':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partial match':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'weak match':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'no match':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading resume details...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/dashboard/jobs/${jobId}`)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{resume.applicant_name}</h1>
              <p className="text-gray-600 mt-1">{resume.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge className={`${getRecommendationColor(resume.final_recommendation)} border`}>
                  {resume.final_recommendation}
                </Badge>
                <Badge className={getLevelColor(resume.level_suggestion)}>
                  {resume.level_suggestion} Level
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Overall Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(resume.total_weighted_score)}`}>
                {resume.total_weighted_score}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Documents */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                    <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">CV / Resume</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resume.cv_link, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View CV
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Cover Letter</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resume.coverletter_link, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Letter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Facts */}
            {resume.experience_facts && resume.experience_facts.length > 0 && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Key Experience Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {resume.experience_facts.map((fact, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{fact}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Scores and Analysis */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    label: "Company Fit",
                    score: resume.company_fit_score,
                    icon: Brain,
                    reason: resume.company_fit_reason
                  },
                  {
                    label: "Culture Fit",
                    score: resume.culture_score,
                    icon: Users,
                    reason: resume.culture_reason
                  },
                  {
                    label: "Experience",
                    score: resume.experience_score,
                    icon: Award,
                    reason: resume.experience_reason
                  },
                  {
                    label: "Skills",
                    score: resume.skill_score,
                    icon: Star,
                    reason: resume.skill_reason
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Applied Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(resume.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Evaluation Status</p>
                  <Badge className={resume.evaluated ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {resume.evaluated ? "Evaluated" : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetails;
