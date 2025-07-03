import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle, ExternalLink, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssignmentData {
  assignment_template: any[];
  assignment_sent: string;
  assignment_submission: string | null;
  assignment_submission_link: string | null;
  submitted: boolean;
}

const ViewAssignment = () => {
  const { resumeId } = useParams();
  const { toast } = useToast();
  
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch assignment');
        }
        
        const data = await response.json();
        setAssignment(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching assignment');
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchAssignment();
    }
  }, [resumeId]);

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products");
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionIndex?: number) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const url = await uploadToCloudinary(file);
        return { name: file.name, url };
      });
      const uploadedDocs = await Promise.all(uploadPromises);
      
      if (questionIndex !== undefined) {
        // For specific question
        setAnswers(prev => ({
          ...prev,
          [questionIndex]: uploadedDocs
        }));
      } else {
        // For general assignment upload
        setUploadedFiles(prev => [...prev, ...uploadedDocs]);
      }
      
      toast({
        title: "Success",
        description: `${uploadedDocs.length} file(s) uploaded successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmission = async () => {
    if (Object.keys(answers).length === 0 && uploadedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please provide answers or upload files before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionDetails = {
        answers: answers,
        uploaded_files: uploadedFiles,
        submission_time: new Date().toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}/submit`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ details: submissionDetails }),
      });

      if (!response.ok) throw new Error('Failed to submit assignment');

      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message || "Assignment submitted successfully!",
      });
      
      // Refresh the assignment data
      const refreshResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setAssignment(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const isDeadlinePassed = () => {
    if (!assignment?.assignment_template?.[0]?.deadline) return false;
    return isOverdue(assignment.assignment_template[0].deadline);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your assignment...</p>
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
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Assignment</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!assignment || assignment.assignment_template.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-md w-full mx-4 shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assignment Found</h2>
              <p className="text-gray-600">No assignment has been created for this candidate yet.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const assignmentDetails = assignment.assignment_template[0];
  const deadlinePassed = isDeadlinePassed();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-5xl mx-auto pt-8">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Assignment Portal
          </h1>
          <p className="text-gray-600 text-lg">Complete your assignment with excellence</p>
        </motion.div>

        {/* Deadline Warning */}
        {deadlinePassed && !assignment.submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-xl bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800">Assignment Deadline Has Passed</h3>
                    <p className="text-red-700">
                      The deadline for this assignment was {formatDate(assignmentDetails.deadline)}. 
                      Please contact the administrator if you need an extension.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100">
                      {assignment.submitted ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <Clock className="h-8 w-8 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {assignment.submitted ? "Assignment Completed" : "Assignment In Progress"}
                      </h3>
                      <p className="text-gray-600">
                        Sent: {formatDate(assignment.assignment_sent)}
                      </p>
                      {assignment.assignment_submission && (
                        <p className="text-gray-600">
                          Submitted: {formatDate(assignment.assignment_submission)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    className={`px-4 py-2 text-lg ${assignment.submitted 
                      ? "bg-gradient-to-r from-green-400 to-emerald-400 text-white" 
                      : deadlinePassed
                      ? "bg-gradient-to-r from-red-400 to-pink-400 text-white"
                      : "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
                    }`}
                  >
                    {assignment.submitted ? "Completed" : deadlinePassed ? "Overdue" : "In Progress"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Assignment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="text-3xl">{assignmentDetails.title}</CardTitle>
              {assignmentDetails.description && (
                <p className="text-purple-100 text-lg">{assignmentDetails.description}</p>
              )}
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Timeline Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignmentDetails.deadline && (
                  <div className={`flex items-center gap-4 p-6 rounded-xl border-2 ${
                    isOverdue(assignmentDetails.deadline) 
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                      : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
                  }`}>
                    <div className={`p-3 rounded-full ${
                      isOverdue(assignmentDetails.deadline) ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <Calendar className={`h-6 w-6 ${
                        isOverdue(assignmentDetails.deadline) ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Deadline</p>
                      <p className={`text-lg ${isOverdue(assignmentDetails.deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                        {formatDate(assignmentDetails.deadline)}
                        {isOverdue(assignmentDetails.deadline) && " (Overdue)"}
                      </p>
                    </div>
                  </div>
                )}

                {assignmentDetails.duration && (
                  <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Expected Duration</p>
                      <p className="text-lg text-gray-600">{assignmentDetails.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              {assignmentDetails.content && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Assignment Details</h3>
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-gray-200">
                    <div 
                      className="prose prose-gray max-w-none"
                      dangerouslySetInnerHTML={{ __html: assignmentDetails.content }}
                    />
                  </div>
                </div>
              )}

              {/* Images */}
              {assignmentDetails.images && assignmentDetails.images.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Reference Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignmentDetails.images.map((url: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <img
                          src={url}
                          alt={`Reference ${index + 1}`}
                          className="w-full h-48 object-cover rounded-xl border-2 border-gray-200 group-hover:border-indigo-300 transition-all group-hover:shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {assignmentDetails.documents && assignmentDetails.documents.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Reference Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignmentDetails.documents.map((doc: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-green-600" />
                          <span className="font-medium text-gray-900">{doc.name}</span>
                        </div>
                        <Download className="h-5 w-5 text-green-600" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions */}
              {assignmentDetails.instructions && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Instructions</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                    <p className="text-gray-700 leading-relaxed text-lg">{assignmentDetails.instructions}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Section */}
        {assignmentDetails.questions && assignmentDetails.questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Questions</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {assignmentDetails.questions.map((question: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200"
                  >
                    <h4 className="text-xl font-bold text-emerald-800 mb-4">
                      Q{index + 1}: {question.question}
                    </h4>
                    
                    {question.type === 'text' && (
                      <Textarea
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full h-32 border-2 border-emerald-300 focus:border-emerald-500"
                        disabled={assignment.submitted || deadlinePassed}
                      />
                    )}
                    
                    {question.type === 'file' && (
                      <div>
                        <label htmlFor={`file-${index}`} className="cursor-pointer block">
                          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-lg border-2 border-emerald-300 hover:from-emerald-200 hover:to-teal-200 transition-all">
                            <Upload className="h-5 w-5" />
                            {isUploading ? "Uploading..." : "Upload File"}
                          </div>
                        </label>
                        <input
                          id={`file-${index}`}
                          type="file"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="hidden"
                          disabled={isUploading || assignment.submitted || deadlinePassed}
                        />
                        
                        {answers[index] && answers[index].length > 0 && (
                          <div className="mt-3 space-y-2">
                            {answers[index].map((file: any, fileIndex: number) => (
                              <div key={fileIndex} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                                <FileText className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm text-gray-700">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="space-y-3">
                        {question.options.map((option: string, optionIndex: number) => (
                          <label key={optionIndex} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-emerald-200 hover:border-emerald-300 cursor-pointer transition-all">
                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              checked={answers[index] === option}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              className="text-emerald-600 focus:ring-emerald-500"
                              disabled={assignment.submitted || deadlinePassed}
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* File Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Upload className="h-6 w-6" />
                Submit Your Work
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {assignment.submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-green-900 mb-4">Assignment Already Submitted</h3>
                  <p className="text-gray-600 text-lg mb-6">Thank you for completing the assignment!</p>
                  {assignment.assignment_submission_link && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(assignment.assignment_submission_link!, '_blank')}
                      className="gap-3 px-6 py-3 text-lg border-2 border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <ExternalLink className="h-5 w-5" />
                      View Your Submission
                    </Button>
                  )}
                </div>
              ) : deadlinePassed ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
                  <h3 className="text-3xl font-bold text-red-900 mb-4">Submission Deadline Has Passed</h3>
                  <p className="text-gray-600 text-lg">Please contact the administrator for assistance.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      Upload Assignment Files
                    </label>
                    <label htmlFor="assignment-upload" className="cursor-pointer block">
                      <div className="flex items-center justify-center gap-4 px-8 py-12 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 rounded-xl border-3 border-dashed border-indigo-300 hover:from-indigo-100 hover:to-purple-100 transition-all">
                        <Upload className="h-8 w-8" />
                        <div className="text-center">
                          <p className="text-xl font-semibold">{isUploading ? "Uploading..." : "Click to Upload Files"}</p>
                          <p className="text-gray-600 mt-2">Support for documents, images, and more</p>
                        </div>
                      </div>
                    </label>
                    <input
                      id="assignment-upload"
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e)}
                      className="hidden"
                      disabled={isUploading}
                    />
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold text-gray-700">Uploaded Files:</h4>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700 font-medium">{file.name}</span>
                            <Button
                              onClick={() => window.open(file.url, '_blank')}
                              size="sm"
                              variant="outline"
                              className="ml-auto"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={handleSubmission}
                      disabled={isSubmitting || isUploading}
                      className="px-12 py-4 text-xl font-semibold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      <CheckCircle className="h-6 w-6 mr-3" />
                      {isSubmitting ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewAssignment;
