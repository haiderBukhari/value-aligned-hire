import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, FileText, Download, User, Award, CheckCircle, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface Question {
  question: string;
  type: string;
  options?: string[];
}

interface AssignmentTemplate {
  title: string;
  description: string;
  content: string;
  deadline: string;
  duration: string;
  instructions: string;
  questions: Question[];
  images: string[];
  documents: string[];
  resources: string[];
}

interface SubmissionData {
  assignment_submission: string;
  assignment_feedback: string;
  score: number;
  total_weighted_score: number;
  full_assignment_submission: {
    answers: Record<string, string>;
    submission_time: string;
    uploaded_files: {
      name: string;
      url: string;
    }[];
  }[];
  assignment_template: AssignmentTemplate[];
}

const AssignmentReview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextStep, setNextStep] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}/submitted`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch submission');
        }
        
        const data = await response.json();
        setSubmission(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching submission');
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchSubmission();
    }
  }, [resumeId]);

  // Fetch next step
  useEffect(() => {
    const fetchNextStep = async () => {
      if (!resumeId) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${resumeId}/next-step`, {
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
  }, [resumeId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Move to next stage
  const handleMoveToNextStage = async () => {
    if (!resumeId) return;
    setIsMoving(true);
    try {
      const token = localStorage.getItem("token");
      const moveResp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${resumeId}/next-step`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!moveResp.ok) throw new Error('Failed to move to next stage');
      const moveData = await moveResp.json();
      toast.success(`Moved to: ${moveData.current_step || moveData.message}`);
      setIsMoving(false);
      navigate('/dashboard'); // Go to dashboard after moving
    } catch (err) {
      toast.error('Could not move to next stage.');
      setIsMoving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading submission details...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-md w-full mx-4 shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Submission</h2>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-md w-full mx-4 shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Submission Found</h2>
              <p className="text-gray-600">This assignment has not been submitted yet.</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const assignmentTemplate = submission.assignment_template?.[0];
  const submissionData = submission.full_assignment_submission?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4 justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assignment Review</h1>
                <p className="text-gray-600">Candidate submission details</p>
              </div>
            </div>
            {nextStep && (
              <Button
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold px-6 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleMoveToNextStage}
                disabled={isMoving}
              >
                {isMoving ? 'Moving...' : `Move to ${nextStep}`}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Submission Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Assignment Completed</h3>
                    <p className="text-gray-600">
                      Submitted: {formatDate(submissionData?.submission_time || submission.assignment_submission)}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-lg">
                  Submitted
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessment Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-3">
                <BarChart3 className="h-6 w-6" />
                Assessment Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Assignment Score</p>
                      <p className="text-sm text-gray-600">Direct assessment performance</p>
                    </div>
                  </div>
                  <Badge className={`${getScoreBadgeColor(submission.score)} px-4 py-2 text-lg font-bold`}>
                    {submission.score}%
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Total Weighted Score</p>
                      <p className="text-sm text-gray-600">Combined evaluation score</p>
                    </div>
                  </div>
                  <Badge className={`${getScoreBadgeColor(submission.total_weighted_score)} px-4 py-2 text-lg font-bold`}>
                    {submission.total_weighted_score}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Feedback */}
        {submission.assignment_feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {submission.assignment_feedback}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Assignment Template */}
        {assignmentTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  Original Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assignmentTemplate.title}</h3>
                  {assignmentTemplate.description && (
                    <p className="text-gray-700 mb-4">{assignmentTemplate.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignmentTemplate.deadline && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Deadline</p>
                        <p className="text-gray-600">{formatDate(assignmentTemplate.deadline)}</p>
                      </div>
                    </div>
                  )}

                  {assignmentTemplate.duration && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Duration</p>
                        <p className="text-gray-600">{assignmentTemplate.duration}</p>
                      </div>
                    </div>
                  )}
                </div>

                {assignmentTemplate.content && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Assignment Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: assignmentTemplate.content }}
                      />
                    </div>
                  </div>
                )}

                {assignmentTemplate.instructions && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h4>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{assignmentTemplate.instructions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Questions and Answers */}
        {assignmentTemplate?.questions && assignmentTemplate.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <User className="h-6 w-6" />
                  Questions & Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {assignmentTemplate.questions.map((question, index) => (
                  <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="mb-3">
                      <h5 className="font-semibold text-indigo-900 mb-1">
                        Question {index + 1}:
                      </h5>
                      <p className="text-gray-700">{question.question}</p>
                      {question.type === 'multiple_choice' && question.options && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Options:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                            {question.options.map((option, optIndex) => (
                              <li key={optIndex}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium text-green-800 mb-1">Answer:</p>
                      <p className="text-gray-700">
                        {submissionData?.answers?.[index.toString()] || 'No answer provided'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Uploaded Files */}
        {submissionData?.uploaded_files && submissionData.uploaded_files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Award className="h-6 w-6" />
                  Uploaded Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submissionData.uploaded_files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-600">Uploaded file</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(file.url, file.name)}
                        className="gap-2"
                        size="sm"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssignmentReview;
