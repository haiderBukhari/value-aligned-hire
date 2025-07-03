
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, FileText, ExternalLink, User, Award, CheckCircle } from "lucide-react";

interface SubmissionData {
  assignment_submission: string;
  full_assignment_submission: any[];
  assignment_template: any[];
}

const AssignmentReview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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

  const assignmentTemplate = submission.assignment_template[0] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assignment Review</h1>
              <p className="text-gray-600">Candidate submission details</p>
            </div>
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
                      Submitted: {formatDate(submission.assignment_submission)}
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

        {/* Assignment Template */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Submission Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Award className="h-6 w-6" />
                Candidate Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {submission.full_assignment_submission.map((submissionItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-green-50 rounded-xl border border-green-200"
                >
                  <h4 className="text-lg font-semibold text-green-900 mb-4">
                    Submission {index + 1}
                  </h4>
                  
                  {Object.entries(submissionItem).map(([key, value]) => (
                    <div key={key} className="mb-4">
                      <h5 className="font-medium text-gray-900 capitalize mb-2">
                        {key.replace(/_/g, ' ')}:
                      </h5>
                      
                      {key.includes('link') && typeof value === 'string' && value.startsWith('http') ? (
                        <Button
                          variant="outline"
                          onClick={() => window.open(value, '_blank')}
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Submission
                        </Button>
                      ) : Array.isArray(value) ? (
                        <div className="space-y-2">
                          {value.map((item, itemIndex) => (
                            <div key={itemIndex} className="p-3 bg-white rounded-lg border">
                              {typeof item === 'object' ? (
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {JSON.stringify(item, null, 2)}
                                </pre>
                              ) : (
                                <p className="text-gray-700">{String(item)}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : typeof value === 'object' ? (
                        <div className="p-3 bg-white rounded-lg border">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-lg border">
                          <p className="text-gray-700 whitespace-pre-wrap">{String(value)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AssignmentReview;
