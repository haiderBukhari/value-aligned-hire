
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
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
  const [submissionLink, setSubmissionLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmission = async () => {
    if (!submissionLink.trim()) {
      toast({
        title: "Error",
        description: "Please provide a submission link",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // This would typically be another API endpoint for submission
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });
      
      // Refresh the assignment data
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}`);
      if (response.ok) {
        const data = await response.json();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Assignment</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assignment || assignment.assignment_template.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Assignment Found</h2>
            <p className="text-gray-600">No assignment has been created for this candidate yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assignmentDetails = assignment.assignment_template[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assignment</h1>
          <p className="text-gray-600">Complete the following assignment as instructed</p>
        </div>

        {/* Status Card */}
        <Card className="mb-6 border border-gray-200 rounded-xl shadow-lg bg-white/95">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-50">
                  {assignment.submitted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Clock className="h-6 w-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {assignment.submitted ? "Assignment Submitted" : "Assignment Pending"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sent: {formatDate(assignment.assignment_sent)}
                  </p>
                  {assignment.assignment_submission && (
                    <p className="text-sm text-gray-600">
                      Submitted: {formatDate(assignment.assignment_submission)}
                    </p>
                  )}
                </div>
              </div>
              <Badge 
                className={assignment.submitted 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                }
              >
                {assignment.submitted ? "Completed" : "In Progress"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Details */}
        <Card className="mb-6 border border-gray-200 rounded-xl shadow-lg bg-white/95">
          <CardHeader>
            <CardTitle className="text-2xl">{assignmentDetails.title}</CardTitle>
            {assignmentDetails.description && (
              <p className="text-gray-600">{assignmentDetails.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Deadline */}
            {assignmentDetails.deadline && (
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Deadline</p>
                  <p className={`text-sm ${isOverdue(assignmentDetails.deadline) ? 'text-red-600' : 'text-gray-600'}`}>
                    {formatDate(assignmentDetails.deadline)}
                    {isOverdue(assignmentDetails.deadline) && " (Overdue)"}
                  </p>
                </div>
              </div>
            )}

            {/* Duration */}
            {assignmentDetails.duration && (
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Expected Duration</p>
                  <p className="text-sm text-gray-600">{assignmentDetails.duration}</p>
                </div>
              </div>
            )}

            {/* Content */}
            {assignmentDetails.content && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment Details</h3>
                <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {assignmentDetails.content}
                  </pre>
                </div>
              </div>
            )}

            {/* Images */}
            {assignmentDetails.images && assignmentDetails.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {assignmentDetails.images.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {assignmentDetails.instructions && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Instructions</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">{assignmentDetails.instructions}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Section */}
        <Card className="border border-gray-200 rounded-xl shadow-lg bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Submit Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignment.submitted ? (
              <div className="text-center p-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Assignment Already Submitted</h3>
                {assignment.assignment_submission_link && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Your submission:</p>
                    <Button
                      variant="outline"
                      onClick={() => window.open(assignment.assignment_submission_link!, '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Submission
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Link *
                  </label>
                  <Input
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="https://github.com/yourusername/assignment-repo"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a link to your completed assignment (GitHub repository, Google Drive, etc.)
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmission}
                    disabled={isSubmitting || !submissionLink.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Assignment"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewAssignment;
