
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Filter, MoreVertical, Eye, Check, X, Star, Clock, 
  FileText, Download, User, Briefcase, MapPin, Calendar
} from "lucide-react";

const ApplicationScreening = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const applications = [
    {
      id: 1,
      candidate: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      position: "Senior Frontend Developer",
      appliedDate: "2024-06-07",
      status: "new",
      score: 92,
      location: "San Francisco, CA",
      experience: "5 years",
      skills: ["React", "TypeScript", "Node.js"],
      resumeUrl: "#",
      coverLetter: "I am excited to apply for this position..."
    },
    {
      id: 2,
      candidate: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      position: "Data Scientist",
      appliedDate: "2024-06-06",
      status: "reviewed",
      score: 88,
      location: "New York, NY",
      experience: "3 years",
      skills: ["Python", "Machine Learning", "SQL"],
      resumeUrl: "#",
      coverLetter: "With my background in data science..."
    },
    {
      id: 3,
      candidate: "Emily Chen",
      email: "emily.chen@email.com",
      position: "UX Designer",
      appliedDate: "2024-06-05",
      status: "shortlisted",
      score: 95,
      location: "Austin, TX",
      experience: "4 years",
      skills: ["Figma", "User Research", "Prototyping"],
      resumeUrl: "#",
      coverLetter: "I believe my design philosophy aligns..."
    },
    {
      id: 4,
      candidate: "David Kim",
      email: "david.kim@email.com",
      position: "Product Manager",
      appliedDate: "2024-06-04",
      status: "rejected",
      score: 72,
      location: "Seattle, WA",
      experience: "2 years",
      skills: ["Strategy", "Analytics", "Agile"],
      resumeUrl: "#",
      coverLetter: "As a passionate product manager..."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shortlisted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || app.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: "Total Applications", value: applications.length, color: "bg-blue-50 text-blue-600" },
    { label: "New Applications", value: applications.filter(a => a.status === 'new').length, color: "bg-purple-50 text-purple-600" },
    { label: "Shortlisted", value: applications.filter(a => a.status === 'shortlisted').length, color: "bg-green-50 text-green-600" },
    { label: "Avg Score", value: Math.round(applications.reduce((acc, app) => acc + app.score, 0) / applications.length), color: "bg-orange-50 text-orange-600" }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <FileText className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications, candidates, or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-gray-200 focus:border-blue-500"
          />
        </div>
        <Button variant="outline" className="shrink-0 border-2 border-gray-200 hover:border-blue-500">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Applications List */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-xl">Application Screening</CardTitle>
          <CardDescription>Review and manage incoming job applications</CardDescription>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
              <TabsTrigger value="new">New ({applications.filter(a => a.status === 'new').length})</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed ({applications.filter(a => a.status === 'reviewed').length})</TabsTrigger>
              <TabsTrigger value="shortlisted">Shortlisted ({applications.filter(a => a.status === 'shortlisted').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({applications.filter(a => a.status === 'rejected').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredApplications.map((application, index) => (
              <div key={application.id} className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-25' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {application.candidate.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{application.candidate}</h3>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className={`font-semibold ${getScoreColor(application.score)}`}>
                            {application.score}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{application.position}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{application.experience} experience</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {application.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Progress value={application.score} className="w-full h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationScreening;
