
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
  FileText, Download, User, Briefcase, MapPin, Calendar, MoreHorizontal,
  Users, TrendingUp, AlertCircle, CheckCircle, Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalInterview = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all_applicants");

  const applications = [
    {
      id: 1,
      candidate: "David Kim",
      email: "david.kim@email.com",
      position: "Product Manager",
      appliedDate: "2024-06-08",
      status: "scheduled",
      score: 91,
      location: "Seattle, WA",
      experience: "6 years",
      skills: ["Strategy", "Analytics", "Agile"],
      reason: "Executive decision round",
      dateRequested: "08/06/2024",
      action: "Final Interview",
      interviewDate: "2024-06-25",
      interviewTime: "2:00 PM"
    },
    {
      id: 2,
      candidate: "Sarah Martinez",
      email: "sarah.martinez@email.com",
      position: "Senior Developer",
      appliedDate: "2024-06-05",
      status: "completed",
      score: 94,
      location: "San Francisco, CA",
      experience: "7 years",
      skills: ["React", "Node.js", "AWS"],
      reason: "Top performer",
      dateRequested: "05/06/2024",
      action: "Offer Extended",
      interviewDate: "2024-06-20",
      interviewTime: "10:00 AM"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    const matchesTab = selectedTab === 'all_applicants' || 
                      (selectedTab === 'upcoming_interviews' && app.status === 'scheduled');
    return matchesSearch && matchesTab;
  });

  const upcomingInterviews = applications.filter(app => app.status === 'scheduled');

  const stats = [
    { 
      label: "Final Candidates", 
      value: applications.length, 
      icon: Crown,
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500"
    },
    { 
      label: "Scheduled Interviews", 
      value: upcomingInterviews.length, 
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500"
    },
    { 
      label: "Completed", 
      value: applications.filter(a => a.status === 'completed').length, 
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    { 
      label: "Avg Score", 
      value: Math.round(applications.reduce((acc, a) => acc + a.score, 0) / applications.length) + "%", 
      icon: Star,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  const handleViewCandidate = (candidateId: number) => {
    navigate(`/dashboard/resume-details?id=${candidateId}&fromFinalInterview=true`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Final Interview</h1>
            <p className="text-gray-600 mt-1">Executive-level assessment for top-tier candidates</p>
          </div>
          <div className="text-sm text-gray-500">
            July 2, 2025 07:44 AM
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" className="ml-4 border-gray-200 hover:border-blue-500">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 p-1">
                <TabsTrigger 
                  value="all_applicants" 
                  className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
                >
                  All Applicants
                </TabsTrigger>
                <TabsTrigger 
                  value="upcoming_interviews" 
                  className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  Upcoming Interviews
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enhanced Table */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <TableHead className="font-bold text-gray-900 py-4">Candidate</TableHead>
                    <TableHead className="font-bold text-gray-900">Position</TableHead>
                    <TableHead className="font-bold text-gray-900">Applied Date</TableHead>
                    <TableHead className="font-bold text-gray-900">Score</TableHead>
                    <TableHead className="font-bold text-gray-900">Status</TableHead>
                    <TableHead className="font-bold text-gray-900">Interview Date</TableHead>
                    <TableHead className="font-bold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application, index) => (
                    <TableRow key={application.id} className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                            <AvatarFallback className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold text-sm">
                              {application.candidate.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{application.candidate}</div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{application.position}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {application.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 font-medium">{application.dateRequested}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getScoreColor(application.score)}`}>
                            {application.score}%
                          </span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(application.status)} px-3 py-1 text-xs font-medium`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 font-medium">
                          {application.interviewDate ? new Date(application.interviewDate).toLocaleDateString() : '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {application.interviewTime || ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleViewCandidate(application.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
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
    </div>
  );
};

export default FinalInterview;
