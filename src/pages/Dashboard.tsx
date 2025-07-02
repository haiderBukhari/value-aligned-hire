import { useState } from "react";
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
  Home, LogOut, Building2, UserCheck, ClipboardList, FileText, Target, Bell, Award, Handshake
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const { companyName } = useCompanyInfo();

  const isDashboardHome = location.pathname === "/dashboard";

  // Sample data for charts
  const applicationData = [
    { name: 'Jan', applications: 65, hired: 12 },
    { name: 'Feb', applications: 59, hired: 15 },
    { name: 'Mar', applications: 80, hired: 18 },
    { name: 'Apr', applications: 81, hired: 22 },
    { name: 'May', applications: 56, hired: 8 },
    { name: 'Jun', applications: 95, hired: 25 },
  ];

  const statusData = [
    { name: 'Applied', value: 145, color: '#8884d8' },
    { name: 'Screening', value: 89, color: '#82ca9d' },
    { name: 'Interview', value: 45, color: '#ffc658' },
    { name: 'Hired', value: 23, color: '#ff7300' },
  ];

  const recentJobs = [
    { id: 1, title: "Senior Frontend Developer", applications: 45, status: "Active", posted: "2 days ago" },
    { id: 2, title: "Product Manager", applications: 32, status: "Active", posted: "1 week ago" },
    { id: 3, title: "UX Designer", applications: 28, status: "Closed", posted: "3 days ago" },
    { id: 4, title: "Data Scientist", applications: 67, status: "Active", posted: "5 days ago" },
  ];

  const recentApplicants = [
    { id: 1, name: "Sarah Johnson", position: "Frontend Developer", score: 92, status: "Interview" },
    { id: 2, name: "Mike Chen", position: "Product Manager", score: 88, status: "Screening" },
    { id: 3, name: "Emily Davis", position: "UX Designer", score: 95, status: "Hired" },
    { id: 4, name: "Alex Rodriguez", position: "Data Scientist", score: 85, status: "Applied" },
  ];

  const stats = [
    {
      title: "Total Jobs",
      value: "24",
      change: "+12%",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Applications",
      value: "1,234",
      change: "+18%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Hired This Month",
      value: "23",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Interviews Scheduled",
      value: "15",
      change: "+5%",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Updated navigation items with Talent Pool
  const navigationItems = [
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
      icon: Plus,
      label: "Create Job",
      path: "/dashboard/create-job",
      count: null
    },
    {
      icon: FileText,
      label: "Application Screening",
      path: "/dashboard/jobs",
      count: 156
    },
    {
      icon: Users,
      label: "Talent Pool",
      path: "/dashboard/talent-pool",
      count: 89
    },
    {
      icon: ClipboardList,
      label: "Assessments",
      path: "/dashboard/assessments",
      count: 42
    },
    {
      icon: Users,
      label: "Initial Interview",
      path: "/dashboard/initial-interview",
      count: 18
    },
    {
      icon: UserCheck,
      label: "Secondary Interview",
      path: "/dashboard/secondary-interview",
      count: 12
    },
    {
      icon: Calendar,
      label: "Final Interview",
      path: "/dashboard/final-interview",
      count: 8
    },
    {
      icon: Handshake,
      label: "Offer Stage",
      path: "/dashboard/offer-stage",
      count: 5
    },
    {
      icon: Target,
      label: "Hiring Pipeline",
      path: "/dashboard/pipeline",
      count: 91
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
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
              <h1 className="text-xl font-bold text-gray-900">Talo HR</h1>
              <p className="text-sm text-gray-500">AI Recruitment Platform</p>
            </div>
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-bold text-gray-900">24</p>
              <p className="text-xs text-gray-600">Active Jobs</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-lg font-bold text-gray-900">156</p>
              <p className="text-xs text-gray-600">Candidates</p>
            </div>
          </div>
        </div>
        
        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <nav className="mt-6 px-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className={`w-full justify-between h-12 text-left font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </div>
                    {item.count && (
                      <Badge 
                        variant="secondary" 
                        className={`${
                          location.pathname === item.path 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-600"
                        } text-xs px-2 py-1`}
                      >
                        {item.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </nav>
            
            {/* Recent Activity */}
            <div className="mt-8 px-4 pb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-xs text-gray-600">New application for Senior Developer</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-xs text-gray-600">Interview scheduled with Sarah J.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-xs text-gray-600">Assessment completed by Alex R.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content with left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-80">
        {/* Enhanced Header */}
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

        {/* Page Content */}
        <main className="flex-1 p-8">
          {isDashboardHome ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
                      {recentJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-500">{job.applications} applications • {job.posted}</p>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      ))}
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
                      {recentApplicants.map((applicant) => (
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
