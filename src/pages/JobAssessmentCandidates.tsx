import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Clock, Calendar, ArrowLeft, Award, Users, CheckCircle, Clock as ClockIcon, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'assignment received': return 'bg-green-100 text-green-800 border-green-200';
    case 'assignment pending to be sent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'assignment pending by the candidate': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const JobAssessmentCandidates = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const stage = queryParams.get("stage") || "Assessment Center";
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [jobLoading, setJobLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}/assessments/candidates?stage=${encodeURIComponent(stage)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch candidates');
        const data = await response.json();
        setCandidates(data.candidates || []);
      } catch (err: any) {
        setError(err.message || 'Error fetching candidates');
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchCandidates();
  }, [jobId, stage]);

  useEffect(() => {
    const fetchJob = async () => {
      setJobLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch job');
        const data = await response.json();
        setJobTitle(data.job?.title || null);
      } catch {
        setJobTitle(null);
      } finally {
        setJobLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId]);

  const filteredCandidates = useMemo(() => candidates.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.status?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }), [candidates, searchTerm]);

  // Stats
  const total = candidates.length;
  const completed = candidates.filter(c => c.status?.toLowerCase() === 'assignment received' || c.status?.toLowerCase() === 'completed' || c.status?.toLowerCase() === 'submitted').length;
  const pending = candidates.filter(c => c.status?.toLowerCase().includes('pending')).length;
  const avgScore = candidates.length > 0 ? Math.round(candidates.reduce((sum, c) => sum + (c.score || 0), 0) / candidates.filter(c => c.score !== undefined && c.score !== null).length || 1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-0">
      <div className="max-w-6xl mx-auto pt-8 pb-4 px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completed}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{isNaN(avgScore) ? '-' : avgScore + '%'}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {jobLoading ? <span className="animate-pulse text-gray-400">Loading...</span> : jobTitle || "Assessment Candidates"}
            <span className="ml-2 text-lg font-medium text-gray-500">| {stage}</span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <div className="text-gray-500 text-sm">Candidates for Assessment</div>
        </div>
        <Card className="border border-gray-200 rounded-xl shadow-lg bg-white/95">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Eye className="h-6 w-6" />
              All candidates for this job and stage
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search candidates, email, status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Spent</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-red-500">{error}</td></tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No candidates found</td></tr>
                  ) : (
                    filteredCandidates.map((candidate, index) => (
                      <motion.tr
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          <div className="flex items-center space-x-3">
                            <span>{candidate.candidate_name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-gray-500">{candidate.email}</td>
                        <td className="px-3 py-4 text-gray-500">{candidate.job_title}</td>
                        <td className="px-6 py-4">
                          <Badge className={`${getStatusColor(
                            candidate.assignment_submission
                              ? 'assignment received'
                              : !candidate.assignment_sent
                                ? 'assignment pending to be sent'
                                : 'assignment pending by the candidate')
                          } font-medium`}>
                            {candidate.assignment_submission
                              ? 'Assignment Received'
                              : !candidate.assignment_sent
                                ? 'Assignment Pending to be Sent'
                                : 'Assignment Pending by the Candidate'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {candidate.score !== undefined && candidate.score !== null ? (
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="font-bold text-green-600">{candidate.score}%</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {candidate.time_spent ? (
                            <div className="flex items-center text-gray-600">
                              <Clock className="mr-1 h-4 w-4" />
                              {candidate.time_spent}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {candidate.assignment_submission ? (
                            <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                              <Eye className="h-4 w-4 mr-1" />
                              Review Assignment
                            </Button>
                          ) : !candidate.assignment_sent ? (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                              onClick={() => navigate(`/dashboard/jobs/${jobId}/create-assignment`)}
                            >
                              Create Assignment
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled className="opacity-50 cursor-not-allowed">
                              Pending Assignment
                            </Button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobAssessmentCandidates;
