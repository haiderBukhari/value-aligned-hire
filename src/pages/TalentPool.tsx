
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Filter, Eye, Users, TrendingUp, Clock, Star, 
  MapPin, Mail, Phone, Calendar, Award, Target, CheckCircle, 
  AlertTriangle, FileText, Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TalentPool = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  // Enhanced candidate data
  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      position: "Senior Frontend Developer",
      appliedDate: "2024-06-15",
      currentStage: "final_interview",
      overallScore: 92,
      experienceYears: 5,
      education: "BS Computer Science, Stanford",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      summary: "Experienced frontend developer with strong leadership skills and passion for creating user-centric applications.",
      stages: [
        {
          name: "Application Screening",
          status: "completed",
          score: 95,
          feedback: "Excellent technical background with relevant experience in React and TypeScript. Strong portfolio showcasing modern web applications.",
          aiRecommendation: "Highly recommended candidate. Technical skills align perfectly with job requirements.",
          completedAt: "2024-06-16T10:30:00Z"
        },
        {
          name: "Technical Assessment",
          status: "completed",
          score: 88,
          feedback: "Solid performance on coding challenges. Demonstrated good problem-solving approach and clean code practices.",
          aiRecommendation: "Good technical execution with room for optimization in algorithm complexity.",
          completedAt: "2024-06-18T14:15:00Z"
        },
        {
          name: "Initial Interview",
          status: "completed",
          score: 90,
          feedback: "Great communication skills and cultural fit. Showed enthusiasm for the role and company mission.",
          aiRecommendation: "Excellent interpersonal skills and strong motivation.",
          completedAt: "2024-06-20T16:00:00Z"
        },
        {
          name: "Final Interview",
          status: "in_progress",
          score: 0,
          feedback: "",
          aiRecommendation: "",
          completedAt: null
        }
      ]
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      phone: "+1 (555) 987-6543",
      location: "New York, NY",
      position: "Data Scientist",
      appliedDate: "2024-06-12",
      currentStage: "secondary_interview",
      overallScore: 85,
      experienceYears: 3,
      education: "MS Data Science, MIT",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "R"],
      summary: "Data scientist with expertise in machine learning and statistical analysis, passionate about deriving insights from complex datasets.",
      stages: [
        {
          name: "Application Screening",
          status: "completed",
          score: 87,
          feedback: "Strong academic background and relevant project experience in machine learning.",
          aiRecommendation: "Good candidate with solid foundation in data science principles.",
          completedAt: "2024-06-13T09:00:00Z"
        },
        {
          name: "Technical Assessment",
          status: "completed",
          score: 82,
          feedback: "Good analytical skills demonstrated through data analysis challenges.",
          aiRecommendation: "Competent in technical execution with good problem-solving approach.",
          completedAt: "2024-06-15T11:30:00Z"
        },
        {
          name: "Initial Interview",
          status: "completed",
          score: 85,
          feedback: "Good communication of technical concepts and project experience.",
          aiRecommendation: "Solid candidate with good potential for growth.",
          completedAt: "2024-06-17T15:00:00Z"
        },
        {
          name: "Secondary Interview",
          status: "in_progress",
          score: 0,
          feedback: "",
          aiRecommendation: "",
          completedAt: null
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStageDisplayName = (stage: string) => {
    return stage.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleViewCandidate = (candidateId: number) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      localStorage.setItem('selectedCandidate', JSON.stringify(candidate));
      navigate(`/dashboard/talent-pool/${candidateId}`);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = jobFilter === 'all' || candidate.position.toLowerCase().includes(jobFilter.toLowerCase());
    const matchesStage = stageFilter === 'all' || candidate.currentStage === stageFilter;
    return matchesSearch && matchesJob && matchesStage;
  });

  const uniquePositions = [...new Set(candidates.map(c => c.position))];
  const uniqueStages = [...new Set(candidates.map(c => c.currentStage))];

  const stats = [
    { 
      label: "Total Candidates", 
      value: candidates.length, 
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    { 
      label: "Active Pipeline", 
      value: candidates.filter(c => c.currentStage !== 'hired').length, 
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    { 
      label: "Avg Score", 
      value: Math.round(candidates.reduce((acc, c) => acc + c.overallScore, 0) / candidates.length), 
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500"
    },
    { 
      label: "In Progress", 
      value: candidates.filter(c => c.currentStage.includes('interview')).length, 
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Talent Pool</h2>
            <p className="text-gray-600 mt-1">Manage and track all candidates across different stages</p>
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

        {/* Enhanced Search and Filter */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates, positions, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-48 border-gray-200">
                  <SelectValue placeholder="Filter by Job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map((position) => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-48 border-gray-200">
                  <SelectValue placeholder="Filter by Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {uniqueStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>{getStageDisplayName(stage)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-200 hover:border-blue-500">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Candidates Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="text-xl text-gray-900">Candidate Pipeline</CardTitle>
            <CardDescription>Track candidates through your hiring process</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <TableHead className="font-bold text-gray-900 py-4">Candidate</TableHead>
                    <TableHead className="font-bold text-gray-900">Position</TableHead>
                    <TableHead className="font-bold text-gray-900">Current Stage</TableHead>
                    <TableHead className="font-bold text-gray-900">Score</TableHead>
                    <TableHead className="font-bold text-gray-900">Progress</TableHead>
                    <TableHead className="font-bold text-gray-900">Applied</TableHead>
                    <TableHead className="font-bold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate, index) => (
                    <TableRow key={candidate.id} className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              <span>{candidate.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>{candidate.location}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{candidate.position}</div>
                          <div className="text-sm text-gray-500">{candidate.experienceYears} years exp.</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(candidate.currentStage)} px-3 py-1 text-xs font-medium`}>
                          {getStageDisplayName(candidate.currentStage)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className={`text-lg font-bold ${getScoreColor(candidate.overallScore)}`}>
                            {candidate.overallScore}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={candidate.overallScore} className="w-24 h-2" />
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs px-2 py-0.5">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                +{candidate.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => handleViewCandidate(candidate.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
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

export default TalentPool;
