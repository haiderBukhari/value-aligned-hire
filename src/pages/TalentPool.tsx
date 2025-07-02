
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, Filter, Eye, Users, TrendingUp, Clock, Star, 
  MapPin, Mail, Phone, Calendar, Award, Target, CheckCircle, 
  AlertTriangle, FileText, Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TalentPool = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  // Dummy candidate data with detailed stages
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

  const handleViewCandidate = (candidateId: number) => {
    // Store candidate data in localStorage for the detail page
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      localStorage.setItem('selectedCandidate', JSON.stringify(candidate));
      navigate(`/dashboard/talent-pool/${candidateId}`);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { label: "Total Candidates", value: candidates.length, color: "bg-blue-50 text-blue-600", icon: Users },
    { label: "Active Pipeline", value: candidates.filter(c => c.currentStage !== 'hired').length, color: "bg-green-50 text-green-600", icon: TrendingUp },
    { label: "Avg Score", value: Math.round(candidates.reduce((acc, c) => acc + c.overallScore, 0) / candidates.length), color: "bg-purple-50 text-purple-600", icon: Star },
    { label: "In Progress", value: candidates.filter(c => c.currentStage.includes('interview')).length, color: "bg-orange-50 text-orange-600", icon: Clock }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Talent Pool</h2>
          <p className="text-gray-600 mt-1">Manage and track all candidates across different stages</p>
        </div>
      </div>

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
                  <stat.icon className="h-6 w-6" />
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
            placeholder="Search candidates, positions..."
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

      {/* Candidates List */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-xl">Candidate Pipeline</CardTitle>
          <CardDescription>Track candidates through your hiring process</CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-1">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-25' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <Badge className={getStatusColor(candidate.currentStage)}>
                          {candidate.currentStage.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className={`font-semibold ${getScoreColor(candidate.overallScore)}`}>
                            {candidate.overallScore}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{candidate.position}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Progress value={candidate.overallScore} className="w-full h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:bg-blue-50"
                      onClick={() => handleViewCandidate(candidate.id)}
                    >
                      <Eye className="h-4 w-4" />
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

export default TalentPool;
