import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, ExternalLink, Star, Award, Brain, Users, Eye, CheckCircle, AlertTriangle, Info, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [documentModal, setDocumentModal] = useState<{ isOpen: boolean; type: 'cv' | 'cover' | null; url: string }>({
    isOpen: false,
    type: null,
    url: ''
  });

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

  const openDocumentModal = (type: 'cv' | 'cover', url: string) => {
    if (!url || url.trim() === '') {
      return;
    }
    setDocumentModal({ isOpen: true, type, url });
  };

  const closeDocumentModal = () => {
    setDocumentModal({ isOpen: false, type: null, url: '' });
  };

  const handleMoveToAssessment = () => {
    toast.success("Candidate moved to assessment stage successfully!", {
      description: "They will receive an assessment invitation shortly.",
    });
    // Navigate to assessments page
    navigate('/dashboard/assessments');
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
      <div className="max-w-full mx-auto p-6 pt-0">
        {/* Back Button Only */}
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
              <h1 className="text-4xl font-bold text-gray-900">{resume.applicant_name}</h1>
              <p className="text-gray-600 mt-2 text-lg">{resume.email}</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge className={`${getRecommendationColor(resume.final_recommendation)} border-0 font-medium px-4 py-2 text-sm`}>
                  {resume.final_recommendation}
                </Badge>
                <Badge className={`${getLevelColor(resume.level_suggestion)} px-4 py-2 text-sm font-medium`}>
                  {resume.level_suggestion} Level
                </Badge>
                
                {/* Move to Assessment Button */}
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    onClick={handleMoveToAssessment}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="mr-3 h-5 w-5" />
                    Move to Assessment Stage
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </motion.div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Overall Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(resume.total_weighted_score)}`}>
                {resume.total_weighted_score}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Documents */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Download className="h-6 w-6" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                    <div className="bg-gradient-to-br from-red-100 to-red-200 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Download className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">CV / Resume</h3>
                    <div className="bg-gray-100 rounded-lg h-24 mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-500">PDF Preview</span>
                    </div>
                    {resume.cv_link && resume.cv_link.trim() !== '' ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentModal('cv', resume.cv_link)}
                          className="flex-1 hover:bg-red-50 hover:border-red-300"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View CV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(resume.cv_link, '_blank')}
                          className="hover:bg-red-50 hover:border-red-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Not Attached</span>
                      </div>
                    )}
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Download className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Cover Letter</h3>
                    <div className="bg-gray-100 rounded-lg h-24 mb-4 flex items-center justify-center">
                      <span className="text-xs text-gray-500">PDF Preview</span>
                    </div>
                    {resume.coverletter_link && resume.coverletter_link.trim() !== '' ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocumentModal('cover', resume.coverletter_link)}
                          className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Letter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(resume.coverletter_link, '_blank')}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Not Attached</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown in custom layout */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Star className="h-6 w-6" />
                  Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Fit */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">Company Fit</span>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(resume.company_fit_score)}`}>{resume.company_fit_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${resume.company_fit_score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{resume.company_fit_reason}</p>
                  </motion.div>
                  {/* Culture Fit */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">Culture Fit</span>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(resume.culture_score)}`}>{resume.culture_score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${resume.culture_score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{resume.culture_reason}</p>
                  </motion.div>
                </div>
                {/* Experience full width */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 mt-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-lg">Experience</span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(resume.experience_score)}`}>{resume.experience_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${resume.experience_score}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{resume.experience_reason}</p>
                </motion.div>
                {/* Skills full width at bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 mt-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900 text-lg">Skills</span>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(resume.skill_score)}`}>{resume.skill_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${resume.skill_score}%` }}
                    ></div>
                  </div>
                  {(() => {
                    const text = resume.skill_reason || "";
                    const sections = [];

                    if (text.includes('- **')) {
                      // This is a more robust method using split, which is more reliable than complex regex.
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
                      // Fallback for plain text or if parsing fails
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
                  })()}
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Application Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Applied Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(resume.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">Evaluation Status</p>
                  <Badge className={resume.evaluated ? "bg-green-100 text-green-800 px-3 py-1" : "bg-yellow-100 text-yellow-800 px-3 py-1"}>
                    {resume.evaluated ? "✓ Evaluated" : "⏳ Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Key Experience Highlights */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Award className="h-6 w-6" />
                  Key Experience Highlights
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
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <Dialog open={documentModal.isOpen} onOpenChange={closeDocumentModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              {documentModal.type === 'cv' ? (
                <>
                  <Download className="h-5 w-5 text-red-600" />
                  CV / Resume - {resume?.applicant_name}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 text-blue-600" />
                  Cover Letter - {resume?.applicant_name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6 pt-2">
            {documentModal.url ? (
              <iframe
                src={documentModal.url}
                className="w-full h-full border-0 rounded-lg"
                title={documentModal.type === 'cv' ? 'CV Preview' : 'Cover Letter Preview'}
              />
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
    </div>
  );
};

export default ResumeDetails;
