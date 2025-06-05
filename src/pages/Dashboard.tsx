
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  MessageSquare, 
  PieChart, 
  Calendar, 
  Bell, 
  Search, 
  ChevronDown,
  Plus
} from "lucide-react";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample data for the chart
const chartData = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 25 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 30 },
  { name: 'May', value: 22 },
  { name: 'Jun', value: 45 },
  { name: 'Jul', value: 35 },
];

const recentJobs = [
  { id: 1, title: "Senior React Developer", applicants: 24, new: true },
  { id: 2, title: "Product Manager", applicants: 18, new: false },
  { id: 3, title: "UX Designer", applicants: 12, new: false },
];

const recentApplicants = [
  { id: 1, name: "Alex Johnson", role: "Frontend Developer", avatar: "/placeholder.svg" },
  { id: 2, name: "Sarah Miller", role: "UI/UX Designer", avatar: "/placeholder.svg" },
  { id: 3, name: "Robert Davis", role: "Product Manager", avatar: "/placeholder.svg" },
];

const DashboardHome = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Jessica!</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Create Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Jobs" 
          value="07" 
          bgColor="bg-blue-50" 
          textColor="text-blue-600" 
          borderColor="border-blue-200"
        />
        <StatsCard 
          title="Total Applications" 
          value="103" 
          bgColor="bg-green-50" 
          textColor="text-green-600" 
          borderColor="border-green-200"
        />
        <StatsCard 
          title="Interviews Scheduled" 
          value="18" 
          bgColor="bg-yellow-50" 
          textColor="text-yellow-600" 
          borderColor="border-yellow-200"
        />
        <StatsCard 
          title="Positions Filled" 
          value="04" 
          bgColor="bg-purple-50" 
          textColor="text-purple-600" 
          borderColor="border-purple-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="lg:col-span-2 p-6 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Applications Overview</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">This Month</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sidebar Sections */}
        <div className="flex flex-col gap-6">
          {/* Recent Jobs */}
          <Card className="p-5 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Jobs</h2>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View All</Button>
            </div>
            <div className="space-y-4">
              {recentJobs.map(job => (
                <div key={job.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.applicants} Applicants</p>
                  </div>
                  {job.new && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Applicants */}
          <Card className="p-5 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Applicants</h2>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View All</Button>
            </div>
            <div className="space-y-4">
              {recentApplicants.map(applicant => (
                <div key={applicant.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={applicant.avatar} alt={applicant.name} />
                    <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{applicant.name}</p>
                    <p className="text-sm text-gray-500">{applicant.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const StatsCard = ({ title, value, bgColor, textColor, borderColor }: { 
  title: string; 
  value: string; 
  bgColor: string; 
  textColor: string; 
  borderColor: string;
}) => {
  return (
    <Card className={`p-6 rounded-lg shadow-sm ${bgColor} border ${borderColor}`}>
      <h3 className="text-gray-700 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </Card>
  );
}

const Dashboard = () => {
  const [active, setActive] = useState("dashboard");
  
  // Define navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "jobs", label: "Jobs", icon: FileText, path: "/dashboard/jobs" },
    { id: "candidates", label: "Candidates", icon: Users, path: "/dashboard/candidates" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
    { id: "messages", label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
    { id: "analytics", label: "Analytics", icon: PieChart, path: "/dashboard/analytics" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="w-64 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">A</div>
              <span className="text-xl font-bold text-gray-800">AI Recruit</span>
            </Link>
          </div>
          
          <SidebarContent>
            <div className="px-3 py-4">
              <Input placeholder="Search..." className="mb-4" prefix={<Search className="h-4 w-4 text-gray-500" />} />
              
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild
                      isActive={active === item.id}
                      className="flex items-center gap-3 py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Link 
                        to={item.path}
                        onClick={() => setActive(item.id)}
                        className={`flex items-center gap-3 ${
                          active === item.id ? 'font-medium text-blue-600' : ''
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${
                          active === item.id ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarContent>
          
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">Jessica Doe</p>
                <p className="text-sm text-gray-500 truncate">HR Manager</p>
              </div>
            </div>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 py-4 px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Mobile sidebar trigger would go here */}
                <h2 className="text-lg font-semibold text-gray-800">AI Recruitment Platform</h2>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
            <DashboardHome />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
