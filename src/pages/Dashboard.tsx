import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
  Users, Briefcase, TrendingUp, Calendar, Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2,
  Home, LogOut, Building2, UserCheck, ClipboardList, FileText, Target, Bell, Award, Handshake, Loader2, Settings
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useWorkflow } from "@/hooks/useWorkflow";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { companyName } = useCompanyInfo();
  const { workflowStages, isLoading } = useWorkflow();

  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    hiredThisMonth: 0,
    interviewsScheduled: 0
  });
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch all jobs
        const jobsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/total`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Fetch all candidates
        const candidatesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/candidates/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        let jobsData: any[] = [];
        let candidatesData: any[] = [];

        if (jobsResponse.ok) {
          const jobsResponseData = await jobsResponse.json();
          jobsData = jobsResponseData.jobs || [];
          setJobs(jobsData);
        }

        if (candidatesResponse.ok) {
          const candidatesResponseData = await candidatesResponse.json();
          candidatesData = candidatesResponseData.candidates || [];
        }

        // Calculate stats from real data
        const totalJobs = jobsData.length;
        const totalApplications = candidatesData.length;
        const hiredThisMonth = candidatesData.filter(c => c.is_hired && 
          new Date(c.created_at).getMonth() === new Date().getMonth()
        ).length;
        const interviewsScheduled = candidatesData.filter(c => 
          c.initial_interview_schedule || c.final_interview_schedule || c.scondary_interview_schedule
        ).length;

        setDashboardStats({
          totalJobs,
          totalApplications,
          hiredThisMonth,
          interviewsScheduled
        });

        setCandidates(candidatesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const isDashboardHome = location.pathname === "/dashboard";

  // Sample data for charts (you can enhance this with real data later)
  const applicationData = [
    { name: 'Jan', applications: 65, hired: 12 },
    { name: 'Feb', applications: 59, hired: 15 },
    { name: 'Mar', applications: 80, hired: 18 },
    { name: 'Apr', applications: 81, hired: 22 },
    { name: 'May', applications: 56, hired: 8 },
    { name: 'Jun', applications: dashboardStats.totalApplications, hired: dashboardStats.hiredThisMonth },
  ];

  // Generate status data from candidates
  const getStatusData = () => {
    const screening = candidates.filter(c => c.is_screening && !c.is_initial_interview && !c.in_assessment && !c.in_final_interview && !c.is_hired).length;
    const assessment = candidates.filter(c => c.in_assessment && !c.in_final_interview && !c.is_hired).length;
    const interview = candidates.filter(c => (c.is_initial_interview || c.is_secondary_interview || c.in_final_interview) && !c.is_hired).length;
    const hired = candidates.filter(c => c.is_hired).length;

    return [
      { name: 'Screening', value: screening, color: '#8884d8' },
      { name: 'Assessment', value: assessment, color: '#82ca9d' },
      { name: 'Interview', value: interview, color: '#ffc658' },
      { name: 'Hired', value: hired, color: '#ff7300' },
    ];
  };

  const statusData = getStatusData();

  // Get real recent jobs from API data
  const getRecentJobs = () => {
    return jobs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
      .map(job => ({
        id: job.id,
        title: job.title,
        applications: job.total_applicants || 0,
        status: job.status === 'active' ? 'Active' : 'Closed',
        posted: new Date(job.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      }));
  };

  const recentJobs = getRecentJobs();

  // Get recent top applicants from candidates data
  const getRecentApplicants = () => {
    return candidates
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
      .map(candidate => ({
        id: candidate.id,
        name: candidate.applicant_name,
        position: "Developer", // You might want to fetch job title from job data
        score: candidate.total_weighted_score || 0,
        status: candidate.is_hired ? "Hired" : 
                candidate.in_final_interview ? "Final Interview" :
                candidate.in_assessment ? "Assessment" :
                candidate.is_screening ? "Screening" : "Applied"
      }));
  };

  const recentApplicants = getRecentApplicants();

  const stats = [
    {
      title: "Total Jobs",
      value: dashboardStats.totalJobs.toString(),
      change: "+12%",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Applications",
      value: dashboardStats.totalApplications.toString(),
      change: "+18%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Hired This Month",
      value: dashboardStats.hiredThisMonth.toString(),
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Interviews Scheduled",
      value: dashboardStats.interviewsScheduled.toString(),
      change: "+5%",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Generate navigation items based on workflow stages
  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: "Dashboard",
        path: "/dashboard",
        count: null
      },
      {
        icon: Building2,
        label: `Get to know ${companyName}`,
        path: "/dashboard/company",
        count: null
      },
      {
        icon: Users,
        label: "Talent Pool",
        path: "/dashboard/talent-pool",
        count: dashboardStats.totalApplications
      },
      {
        icon: Plus,
        label: "Create Job",
        path: "/dashboard/create-job",
        count: null
      }
    ];

    if (isLoading) {
      return baseItems;
    }

    const workflowItems = workflowStages.map((stage, index) => {
      const getIcon = (stageName: string) => {
        if (stageName.includes('Application Screening')) return FileText;
        if (stageName.includes('Assessment')) return ClipboardList;
        if (stageName.includes('Initial Interview')) return Users;
        if (stageName.includes('Secondary Interview')) return UserCheck;
        if (stageName.includes('Final Interview')) return Calendar;
        if (stageName.includes('Offer Stage')) return Handshake;
        return FileText;
      };

      const getPath = (stageName: string) => {
        if (stageName.includes('Application Screening')) return '/dashboard/jobs';
        if (stageName.includes('Assessment')) return '/dashboard/assessments';
        if (stageName.includes('Initial Interview')) return '/dashboard/initial-interview';
        if (stageName.includes('Secondary Interview')) return '/dashboard/secondary-interview';
        if (stageName.includes('Final Interview')) return '/dashboard/final-interview';
        if (stageName.includes('Offer Stage')) return '/dashboard/offer-stage';
        return '/dashboard/jobs';
      };

      const getCount = (stageName: string) => {
        if (stageName.includes('Application Screening')) return candidates.filter(c => c.is_screening).length;
        if (stageName.includes('Assessment')) return candidates.filter(c => c.in_assessment).length;
        if (stageName.includes('Initial Interview')) return candidates.filter(c => c.is_initial_interview).length;
        if (stageName.includes('Secondary Interview')) return candidates.filter(c => c.is_secondary_interview).length;
        if (stageName.includes('Final Interview')) return candidates.filter(c => c.in_final_interview).length;
        if (stageName.includes('Offer Stage')) return candidates.filter(c => c.is_hired).length;
        return candidates.filter(c => c.is_screening).length;
      };

      return {
        icon: getIcon(stage.name),
        label: stage.name,
        path: getPath(stage.name),
        count: getCount(stage.name)
      };
    });

    const endItems = [
      {
        icon: Target,
        label: "Hiring Pipeline",
        path: "/dashboard/pipeline",
        count: dashboardStats.totalApplications
      },
      {
        icon: Calendar,
        label: "Interview Calendar",
        path: "/dashboard/interview-calendar",
        count: dashboardStats.interviewsScheduled
      },
      {
        icon: Settings,
        label: "Availability Settings",
        path: "/dashboard/availability-settings",
        count: null
      }
    ];

    return [...baseItems, ...workflowItems, ...endItems];
  };

  const navigationItems = getNavigationItems();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-blue-100 text-blue-800';
      case 'final interview': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'assessment': return 'bg-yellow-100 text-yellow-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'applied': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard": return "Dashboard";
      case "/dashboard/company": return `Get to know ${companyName}`;
      case "/dashboard/create-job": return "Create Job";
      case "/dashboard/jobs": return "Application Screening";
      case "/dashboard/talent-pool": return "Talent Pool";
      case "/dashboard/assessments": return "Assessment Center";
      case "/dashboard/initial-interview": return "Initial Interview Management";
      case "/dashboard/secondary-interview": return "Secondary Interview Management";
      case "/dashboard/final-interview": return "Final Interview Management";
      case "/dashboard/offer-stage": return "Offer Management";
      case "/dashboard/pipeline": return "Hiring Pipeline";
      default: return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case "/dashboard": return "Welcome back! Here's what's happening with your recruitment.";
      case "/dashboard/company": return `Configure and update ${companyName}'s profile, culture, and values`;
      case "/dashboard/create-job": return "Create a new job posting with AI assistance";
      case "/dashboard/jobs": return "Review and screen incoming applications";
      case "/dashboard/talent-pool": return "Manage and track all candidates across different stages";
      case "/dashboard/assessments": return "Manage candidate assessments and home tasks";
      case "/dashboard/initial-interview": return "Schedule and manage initial candidate interviews";
      case "/dashboard/secondary-interview": return "Coordinate secondary round interviews";
      case "/dashboard/final-interview": return "Manage final round interviews and decisions";
      case "/dashboard/offer-stage": return "Create and manage job offers for selected candidates";
      case "/dashboard/pipeline": return "Track candidates through hiring stages";
      default: return "Welcome to your recruitment dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Width Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 fixed left-0 top-0 h-full z-30 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center hover:opacity-80 transition-opacity w-full"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
              <p className="text-sm text-gray-500">Base Talent</p>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-bold text-gray-900">{loadingStats ? '-' : dashboardStats.totalJobs}</p>
              <p className="text-xs text-gray-600">Active Jobs</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-bold text-gray-900">{loadingStats ? '-' : dashboardStats.totalApplications}</p>
              <p className="text-xs text-gray-600">Candidates</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <nav className="mt-6 px-4">
              <div className="space-y-2">
                {navigationItems.map((item, idx) => {
                  if (
                    item.label === "Create Job" && isLoading
                  ) {
                    return [
                      <Button
                        key={item.path}
                        variant={location.pathname === item.path ? "default" : "ghost"}
                        className={`w-full justify-between h-12 text-left font-medium transition-all duration-200 ${location.pathname === item.path
                          ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => navigate(item.path)}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </div>
                      </Button>,
                      <div key="workflow-loader" className="flex justify-center py-2">
                        <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                      </div>
                    ];
                  }
                  return (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className={`w-full justify-between h-12 text-left font-medium transition-all duration-200 ${location.pathname === item.path
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </div>
                      {item.count !== null && (
                        <Badge variant="secondary" className="ml-auto">
                          {loadingStats ? '-' : item.count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
                {/* Add logout button right after Hiring Pipeline nav item */}
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 font-medium mt-2"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </nav>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-80">
        {/* Enhanced Header */}
        {isDashboardHome && (
          <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {getPageTitle()}
                </h2>
                <p className="text-sm text-gray-600">
                  {getPageDescription()}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate("/dashboard/create-job")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 shadow-lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Job
                </Button>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1">
          {isDashboardHome ? (
            <div className="p-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loadingStats ? (
                              <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                              stat.value
                            )}
                          </p>
                          <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Trends</CardTitle>
                    <CardDescription>Monthly applications and hiring statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={applicationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="applications" fill="#8884d8" name="Applications" />
                        <Bar dataKey="hired" fill="#82ca9d" name="Hired" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>Current distribution of application statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Jobs</CardTitle>
                    <CardDescription>Latest job postings and their performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentJobs.length > 0 ? recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-500">{job.applications} applications • {job.posted}</p>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      )) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>No jobs posted yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Applicants</CardTitle>
                    <CardDescription>Highest scoring candidates this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplicants.length > 0 ? recentApplicants.map((applicant) => (
                        <div key={applicant.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{applicant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-gray-900">{applicant.name}</h4>
                              <p className="text-sm text-gray-500">{applicant.position}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{applicant.score}%</span>
                              <Badge className={getStatusColor(applicant.status)}>
                                {applicant.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>No applicants yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
