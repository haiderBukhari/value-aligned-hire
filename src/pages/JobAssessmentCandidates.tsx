
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Plus, Eye, Edit, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JobAssessmentCandidates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();
        setCandidates(data);
      } catch (err: any) {
        setError(err.message || "Error fetching candidates");
        toast({
          title: "Error",
          description: err.message || "Error fetching candidates",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [toast]);

  const filteredCandidates = candidates.filter((resume) => {
    const fullName = `${resume.first_name} ${resume.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const totalCandidates = candidates.length;
  const candidatesWithAssignment = candidates.filter((resume) => resume.assignment_sent).length;
  const candidatesWithoutAssignment = totalCandidates - candidatesWithAssignment;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isAssignmentPending = (resume: any) => {
    return resume.assignment_sent && !resume.assignment_submission && !resume.assignment_submission_link;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading candidates...</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Candidates</h2>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Job Assessment Candidates
        </h1>
        <p className="text-gray-600 text-lg">Manage and assess candidates for the job</p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-700">{totalCandidates}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">With Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">{candidatesWithAssignment}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Without Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700">{candidatesWithoutAssignment}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full bg-white/90 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-md">
                  <CardTitle className="text-lg font-semibold">{resume.first_name} {resume.last_name}</CardTitle>
                  <Badge className="ml-auto">{resume.role}</Badge>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="text-gray-700">
                    <p>
                      <span className="font-semibold">Email:</span> {resume.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {resume.phone}
                    </p>
                    {resume.assignment_sent && (
                      <p>
                        <span className="font-semibold">Assignment Sent:</span> {formatDate(resume.assignment_sent)}
                      </p>
                    )}
                    {resume.assignment_submission && (
                      <p>
                        <span className="font-semibold">Assignment Submitted:</span> {formatDate(resume.assignment_submission)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      onClick={() => navigate(`/candidate-details/${resume.id}`)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>

                    {resume.assignment_sent ? (
                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => window.open(`/viewassignment/${resume.id}`, '_blank')}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Assignment
                        </Button>

                        {isAssignmentPending(resume) && (
                          <Button
                            onClick={() => navigate(`/create-assignment?resume_id=${resume.id}&edit=true`)}
                            size="sm"
                            variant="outline"
                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        onClick={() => navigate(`/create-assignment?resume_id=${resume.id}`)}
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobAssessmentCandidates;
