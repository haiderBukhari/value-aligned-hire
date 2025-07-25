import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Copy,
  Briefcase,
  CheckCircle,
  XCircle,
  Users as UsersIcon
} from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  total_applicants: number;
  created_at: string;
  resume_count_in_stage?: number;
}

const Jobs = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState<'all' | 'active' | 'inactive'>('all');

  // Fetch jobs from API
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs?stage=Application%20Screening`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      return data.jobs || [];
    },
  });

  // Toggle job status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle job status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job status updated successfully');
    },
    onError: (error) => {
      console.error('Toggle status error:', error);
      toast.error('Failed to update job status');
    },
  });

  // Stats
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job: Job) => job.status === 'active').length;
  const inactiveJobs = jobs.filter((job: Job) => job.status === 'inactive').length;
  const totalApplicants = jobs.reduce((sum: number, job: Job) => sum + (job.total_applicants || 0), 0);
  const resumesToReview = jobs.reduce((sum: number, job: Job) => sum + (job.resume_count_in_stage || 0), 0);

  // Tabs
  const filteredByTab = jobs.filter((job: Job) => {
    if (tab === 'all') return true;
    return job.status === tab;
  });

  // Search
  const filteredJobs = filteredByTab.filter((job: Job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToggleStatus = (jobId: string) => {
    toggleStatusMutation.mutate(jobId);
  };

  const handleCopyApplicationLink = (jobId: string) => {
    const applicationUrl = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(applicationUrl);
    toast.success('Application link copied to clipboard');
  };

  const handleViewDetails = (jobId: string) => {
    navigate(`/dashboard/jobs/${jobId}?stage=Application Screening`);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading jobs: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-0">
      {/* Header */}
      <div className="max-w-6xl mx-auto pt-8 pb-4 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Initial Application Screening</h1>
            <p className="text-gray-600 text-base">Manage your job postings and track applicants</p>
          </div>
          {/* <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
          </div> */}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Jobs",
              count: totalJobs,
              icon: <Briefcase className="h-7 w-7" />,
              iconBg: "bg-blue-100 text-blue-500",
              cardBg: "bg-gradient-to-br from-blue-50 to-white",
            },
            {
              title: "Active Jobs",
              count: activeJobs,
              icon: <CheckCircle className="h-7 w-7" />,
              iconBg: "bg-green-100 text-green-500",
              cardBg: "bg-gradient-to-br from-green-50 to-white",
            },
            {
              title: "Inactive Jobs",
              count: inactiveJobs,
              icon: <XCircle className="h-7 w-7" />,
              iconBg: "bg-red-100 text-red-500",
              cardBg: "bg-gradient-to-br from-red-50 to-white",
            },
            // {
            //   title: "Total Applicants",
            //   count: totalApplicants,
            //   icon: <UsersIcon className="h-7 w-7" />,
            //   iconBg: "bg-purple-100 text-purple-500",
            //   cardBg: "bg-gradient-to-br from-purple-50 to-white",
            // },
            {
              title: "Resumes to Review",
              count: resumesToReview,
              icon: <Eye className="h-7 w-7" />,
              iconBg: "bg-yellow-100 text-yellow-500",
              cardBg: "bg-gradient-to-br from-yellow-50 to-white",
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`rounded-2xl shadow-lg p-6 flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:ring-2 hover:ring-blue-200 ${stat.cardBg}`}
                style={{ minHeight: 110 }}
              >
                <div>
                  <div className="text-xs font-semibold text-gray-500 mb-1">{stat.title}</div>
                  <div className="text-4xl font-extrabold text-gray-900 leading-tight">{stat.count}</div>
                </div>
                <div className={`flex items-center justify-center rounded-full ${stat.iconBg} shadow-md h-12 w-12 transition-transform duration-200 group-hover:animate-bounce`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition 
              ${tab === 'all' 
                ? 'bg-gray-900 text-white shadow' 
                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'}`}
            onClick={() => setTab('all')}
          >
            All
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition 
              ${tab === 'active' 
                ? 'bg-gray-900 text-white shadow' 
                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'}`}
            onClick={() => setTab('active')}
          >
            Active
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold transition 
              ${tab === 'inactive' 
                ? 'bg-gray-900 text-white shadow' 
                : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100'}`}
            onClick={() => setTab('inactive')}
          >
            Inactive
          </button>
        </div>
        {/* Search and Filter */}
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
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      {/* Jobs Table */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <Card className="border border-gray-200 rounded-xl shadow-lg bg-white/95">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]">Resume to Review</th>
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
                  ) : filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job: Job) => (
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
                              onClick={() => handleViewDetails(job.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleCopyApplicationLink(job.id)}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>Copy Application Link</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleViewDetails(job.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Job</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleToggleStatus(job.id)}
                                  disabled={toggleStatusMutation.isPending}
                                >
                                  {job.status === 'active' ? (
                                    <>
                                      <ToggleLeft className="mr-2 h-4 w-4" />
                                      <span>Set Inactive</span>
                                    </>
                                  ) : (
                                    <>
                                      <ToggleRight className="mr-2 h-4 w-4" />
                                      <span>Set Active</span>
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete Job</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      </div>
    </div>
  );
};

export default Jobs;
