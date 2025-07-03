import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, FileText, CheckCircle, XCircle, Search } from "lucide-react";

const templates = [
  {
    id: 1,
    title: "Frontend React Challenge",
    type: "Coding",
    difficulty: "Advanced",
    duration: "4 hours",
    description: "Build a responsive dashboard with React and TypeScript",
    skills: ["React", "TypeScript", "CSS", "API Integration"]
  },
  {
    id: 2,
    title: "Data Science Project",
    type: "Technical",
    difficulty: "Expert",
    duration: "6 hours",
    description: "Analyze dataset and create predictive models",
    skills: ["Python", "Pandas", "Machine Learning", "Data Visualization"]
  },
  {
    id: 3,
    title: "UX Research Study",
    type: "Design",
    difficulty: "Intermediate",
    duration: "3 hours",
    description: "Conduct user research and create design recommendations",
    skills: ["User Research", "Prototyping", "Design Thinking", "Figma"]
  }
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-orange-100 text-orange-800';
    case 'expert': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'coding challenge':
    case 'coding': return <FileText className="h-4 w-4" />;
    case 'technical assessment':
    case 'technical': return <FileText className="h-4 w-4" />;
    case 'design challenge':
    case 'design': return <Eye className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const AssessmentCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const stage = queryParams.get("stage") || "Assessment";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<'jobs'>('jobs');

  // Fetch all jobs for the current stage
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs-assessment-center', stage],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs?stage=${encodeURIComponent(stage)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      return data.jobs || [];
    },
  });

  const filteredJobs = jobs.filter((job: any) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewCandidates = (jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}/assessments/candidates?stage=${encodeURIComponent(stage)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-0">
      <div className="max-w-6xl mx-auto pt-8 pb-4 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Assessment Center</h1>
            <p className="text-gray-600 text-base">Manage all job assessments and templates for this stage</p>
          </div>
        </div>
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'jobs')} className="mb-6">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="jobs">All Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Card className="border border-gray-200 rounded-xl shadow-lg bg-white/95">
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]">Resumes to Review</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">Created</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            Loading jobs...
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-red-500">
                            {error.message || error.toString()}
                          </td>
                        </tr>
                      ) : filteredJobs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No jobs found
                          </td>
                        </tr>
                      ) : (
                        filteredJobs.map((job: any) => (
                          <motion.tr
                            key={job.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            transition={{ duration: 0.2 }}
                            className="transition-colors"
                          >
                            <td className="px-6 py-4 font-semibold text-gray-900 truncate max-w-[180px]">{job.title}</td>
                            <td className="px-6 py-4 text-gray-500 truncate max-w-[280px]">{job.description}</td>
                            <td className="px-6 py-4 text-center text-gray-900 font-medium">{job.resume_count_in_stage }</td>
                            <td className="px-6 py-4 text-gray-500">{formatDate(job.created_at)}</td>
                            <td className="px-6 py-4 text-center">
                              <Badge className={`${getStatusColor(job.status)} capitalize`}>{job.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewCandidates(job.id)}
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssessmentCenter;
