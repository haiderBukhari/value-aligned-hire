
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, TrendingUp, Calendar, Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, Home, Settings, LogOut } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <div className="w-72 bg-white shadow-xl border-r border-gray-200">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center hover:opacity-80 transition-opacity w-full"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">Talo HR</h1>
              <p className="text-sm text-gray-500">AI Recruitment</p>
            </div>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            <Button
              variant={isDashboardHome ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-left font-medium transition-all duration-200 ${
                isDashboardHome 
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => navigate("/dashboard")}
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-left font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => navigate("/dashboard/create-job")}
            >
              <Plus className="mr-3 h-5 w-5" />
              Create Job
            </Button>
            
            <Button
              variant={location.pathname === "/dashboard/jobs" ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-left font-medium transition-all duration-200 ${
                location.pathname === "/dashboard/jobs"
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => navigate("/dashboard/jobs")}
            >
              <Briefcase className="mr-3 h-5 w-5" />
              Jobs
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-left font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Calendar className="mr-3 h-5 w-5" />
              Interviews
            </Button>
          </div>
          
          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>
          
          {/* Secondary Navigation */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-left font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Button>
          </div>
        </nav>
        
        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10 ring-2 ring-blue-200">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@talehr.com</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-10 text-left font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => navigate('/')}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {isDashboardHome ? "Dashboard" : location.pathname === "/dashboard/create-job" ? "Create Job" : "Jobs Management"}
              </h2>
              <p className="text-sm text-gray-600">
                {isDashboardHome ? "Welcome back! Here's what's happening with your recruitment." : location.pathname === "/dashboard/create-job" ? "Create a new job posting with AI assistance" : "Manage your job postings and applications"}
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
