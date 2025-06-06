
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Trophy, Clock, TrendingUp, Plus, Search, Filter, CheckCircle, Star, Award } from "lucide-react";
import { Input } from "@/components/ui/input";

const HiringPipeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pipeline");

  const pipelineStages = [
    {
      id: 1,
      name: "Application Review",
      count: 45,
      color: "bg-blue-500",
      candidates: [
        { name: "John Doe", position: "Frontend Developer", score: 85, avatar: "JD" },
        { name: "Jane Smith", position: "UX Designer", score: 92, avatar: "JS" },
      ]
    },
    {
      id: 2,
      name: "Initial Screening",
      count: 23,
      color: "bg-yellow-500",
      candidates: [
        { name: "Mike Johnson", position: "Backend Developer", score: 88, avatar: "MJ" },
        { name: "Sarah Wilson", position: "Product Manager", score: 90, avatar: "SW" },
      ]
    },
    {
      id: 3,
      name: "Technical Assessment",
      count: 12,
      color: "bg-purple-500",
      candidates: [
        { name: "Alex Chen", position: "Data Scientist", score: 94, avatar: "AC" },
        { name: "Emily Davis", position: "DevOps Engineer", score: 87, avatar: "ED" },
      ]
    },
    {
      id: 4,
      name: "Final Interview",
      count: 8,
      color: "bg-orange-500",
      candidates: [
        { name: "David Kim", position: "Senior Developer", score: 96, avatar: "DK" },
        { name: "Lisa Garcia", position: "Design Lead", score: 93, avatar: "LG" },
      ]
    },
    {
      id: 5,
      name: "Offer Extended",
      count: 3,
      color: "bg-green-500",
      candidates: [
        { name: "Robert Brown", position: "Tech Lead", score: 98, avatar: "RB" },
        { name: "Maria Rodriguez", position: "Senior Designer", score: 95, avatar: "MR" },
      ]
    }
  ];

  const hiredCandidates = [
    {
      id: 1,
      name: "Sarah Thompson",
      position: "Senior Frontend Developer",
      department: "Engineering",
      hiredDate: "2024-06-01",
      salary: "$120,000",
      startDate: "2024-06-15",
      recruiter: "Mike Chen",
      status: "Onboarding",
      performance: 95,
      avatar: "ST"
    },
    {
      id: 2,
      name: "Carlos Martinez",
      position: "Product Manager",
      department: "Product",
      hiredDate: "2024-05-28",
      salary: "$110,000",
      startDate: "2024-06-01",
      recruiter: "Emily Davis",
      status: "Active",
      performance: 92,
      avatar: "CM"
    },
    {
      id: 3,
      name: "Jennifer Lee",
      position: "UX Designer",
      department: "Design",
      hiredDate: "2024-05-25",
      salary: "$95,000",
      startDate: "2024-05-30",
      recruiter: "John Smith",
      status: "Active",
      performance: 88,
      avatar: "JL"
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      position: "Data Scientist",
      department: "Analytics",
      hiredDate: "2024-05-20",
      salary: "$130,000",
      startDate: "2024-05-25",
      recruiter: "Lisa Wang",
      status: "Active",
      performance: 97,
      avatar: "AH"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'onboarding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
          <p className="text-gray-600">Track candidates through hiring stages and manage successful hires</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total in Pipeline</p>
                <p className="text-3xl font-bold text-gray-900">91</p>
                <p className="text-sm text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hired This Month</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-sm text-green-600 mt-1">+25% vs last month</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                <p className="text-3xl font-bold text-gray-900">18d</p>
                <p className="text-sm text-green-600 mt-1">-3 days improved</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600 mt-1">+5% improvement</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pipeline">Hiring Pipeline</TabsTrigger>
          <TabsTrigger value="hired">Hired Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          {/* Pipeline Stages */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {pipelineStages.map((stage, index) => (
              <Card key={stage.id} className="relative overflow-hidden">
                <div className={`h-2 ${stage.color}`} />
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">{stage.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{stage.count}</span>
                    <Badge variant="secondary" className="bg-gray-100">
                      {((stage.count / 91) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {stage.candidates.map((candidate, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                            {candidate.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{candidate.name}</p>
                          <p className="text-xs text-gray-500 truncate">{candidate.position}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium">{candidate.score}</span>
                        </div>
                      </div>
                    ))}
                    {stage.count > 2 && (
                      <div className="text-center">
                        <Button variant="ghost" size="sm" className="text-xs">
                          +{stage.count - 2} more
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pipeline Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Progress</CardTitle>
              <CardDescription>Conversion rates between stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Application to Screening</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={51} className="w-32" />
                    <span className="text-sm font-medium">51%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Screening to Assessment</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={52} className="w-32" />
                    <span className="text-sm font-medium">52%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Assessment to Interview</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={67} className="w-32" />
                    <span className="text-sm font-medium">67%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Interview to Offer</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={38} className="w-32" />
                    <span className="text-sm font-medium">38%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hired" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search hired candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Hired Candidates */}
          <div className="space-y-4">
            {hiredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold">
                          {candidate.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position} • {candidate.department}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">Hired: {candidate.hiredDate}</span>
                          <span className="text-sm text-gray-500">Started: {candidate.startDate}</span>
                          <span className="text-sm text-gray-500">Recruiter: {candidate.recruiter}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        <span className="text-lg font-semibold text-gray-900">{candidate.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Performance:</span>
                        <span className={`text-sm font-semibold ${getPerformanceColor(candidate.performance)}`}>
                          {candidate.performance}%
                        </span>
                        <Progress value={candidate.performance} className="w-16 h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HiringPipeline;
