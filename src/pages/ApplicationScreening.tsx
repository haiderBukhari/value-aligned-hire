
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, Filter, Eye, Check, X, Star, Clock, 
  FileText, Download, User, Briefcase, MapPin, Calendar, MoreHorizontal
} from "lucide-react";

const ApplicationScreening = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");

  const applications = [
    {
      id: 1,
      candidate: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      position: "Senior Frontend Developer",
      appliedDate: "2024-06-15",
      status: "pending",
      score: 92,
      location: "San Francisco, CA",
      experience: "5 years",
      skills: ["React", "TypeScript", "Node.js"],
      reason: "Strong technical background",
      dateRequested: "15/06/2024",
      action: "Review"
    },
    {
      id: 2,
      candidate: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      position: "Data Scientist",
      appliedDate: "2024-06-12",
      status: "approved",
      score: 88,
      location: "New York, NY",
      experience: "3 years",
      skills: ["Python", "Machine Learning", "SQL"],
      reason: "Excellent portfolio",
      dateRequested: "12/06/2024",
      action: "Interview"
    },
    {
      id: 3,
      candidate: "Emily Chen",
      email: "emily.chen@email.com",
      position: "UX Designer",
      appliedDate: "2024-06-10",
      status: "rejected",
      score: 75,
      location: "Austin, TX",
      experience: "2 years",
      skills: ["Figma", "User Research", "Prototyping"],
      reason: "Lacks senior experience",
      dateRequested: "10/06/2024",
      action: "Rejected"
    },
    {
      id: 4,
      candidate: "David Kim",
      email: "david.kim@email.com",
      position: "Product Manager",
      appliedDate: "2024-06-08",
      status: "pending",
      score: 85,
      location: "Seattle, WA",
      experience: "4 years",
      skills: ["Strategy", "Analytics", "Agile"],
      reason: "Good strategic thinking",
      dateRequested: "08/06/2024",
      action: "Review"
    },
    {
      id: 5,
      candidate: "Lisa Wang",
      email: "lisa.wang@email.com",
      position: "Backend Engineer",
      appliedDate: "2024-06-05",
      status: "approved",
      score: 90,
      location: "Boston, MA",
      experience: "6 years",
      skills: ["Java", "Spring", "AWS"],
      reason: "Excellent technical skills",
      dateRequested: "05/06/2024",
      action: "Interview"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'approved':
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      case 'rejected':
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 font-bold';
    if (score >= 80) return 'text-blue-600 font-bold';
    if (score >= 70) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || app.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: "Total Applications", value: applications.length, color: "bg-blue-500", count: applications.length },
    { label: "Pending Review", value: applications.filter(a => a.status === 'pending').length, color: "bg-blue-500", count: applications.filter(a => a.status === 'pending').length },
    { label: "Approved", value: applications.filter(a => a.status === 'approved').length, color: "bg-green-500", count: applications.filter(a => a.status === 'approved').length },
    { label: "Rejected", value: applications.filter(a => a.status === 'rejected').length, color: "bg-red-500", count: applications.filter(a => a.status === 'rejected').length }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Screening</h1>
          <p className="text-gray-600 mt-1">Overview</p>
        </div>
        <div className="text-sm text-gray-500">
          July 2, 2025 07:44 AM
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className="text-sm text-gray-500">/{stat.count}</span>
                  <span className="text-sm text-gray-400">2024</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="ml-4">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
              >
                Rejected
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
              >
                Approved
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-gray-500 data-[state=active]:text-white"
              >
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Candidate</TableHead>
                  <TableHead className="font-semibold text-gray-900">Position</TableHead>
                  <TableHead className="font-semibold text-gray-900">Applied Date</TableHead>
                  <TableHead className="font-semibold text-gray-900">Score</TableHead>
                  <TableHead className="font-semibold text-gray-900">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900">Reason</TableHead>
                  <TableHead className="font-semibold text-gray-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                            {application.candidate.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{application.candidate}</div>
                          <div className="text-xs text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{application.position}</div>
                      <div className="text-xs text-gray-500">{application.location}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{application.dateRequested}</div>
                    </TableCell>
                    <TableCell>
                      <span className={getScoreColor(application.score)}>
                        {application.score}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(application.status)} border-0`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{application.reason}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationScreening;
