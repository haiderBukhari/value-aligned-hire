
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Code, Clock, CheckCircle, AlertCircle, Plus, Search, Filter, Eye, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

const AssessmentCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("assignments");

  const assignments = [
    {
      id: 1,
      title: "React Dashboard Implementation",
      type: "Coding Challenge",
      candidate: "Sarah Johnson",
      position: "Senior Frontend Developer",
      status: "Submitted",
      score: 92,
      submittedAt: "2024-06-07",
      timeSpent: "3h 45m",
      deadline: "2024-06-08",
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "Data Analysis Project",
      type: "Technical Assessment",
      candidate: "Alex Rodriguez",
      position: "Data Scientist",
      status: "In Progress",
      score: null,
      submittedAt: null,
      timeSpent: "2h 12m",
      deadline: "2024-06-09",
      difficulty: "Expert"
    },
    {
      id: 3,
      title: "UX Case Study",
      type: "Design Challenge",
      candidate: "Maria Garcia",
      position: "UX Designer",
      status: "Completed",
      score: 88,
      submittedAt: "2024-06-06",
      timeSpent: "4h 20m",
      deadline: "2024-06-07",
      difficulty: "Intermediate"
    },
    {
      id: 4,
      title: "Product Strategy Document",
      type: "Strategy Assessment",
      candidate: "David Kim",
      position: "Product Manager",
      status: "Overdue",
      score: null,
      submittedAt: null,
      timeSpent: "1h 30m",
      deadline: "2024-06-06",
      difficulty: "Advanced"
    }
  ];

  const templates = [
    {
      id: 1,
      title: "Frontend React Challenge",
      type: "Coding",
      difficulty: "Advanced",
      duration: "4 hours",
      description: "Build a responsive dashboard with React and TypeScript",
      skills: ["React", "TypeScript", "CSS", "API Integration"]
    },
    {
      id: 2,
      title: "Data Science Project",
      type: "Technical",
      difficulty: "Expert",
      duration: "6 hours",
      description: "Analyze dataset and create predictive models",
      skills: ["Python", "Pandas", "Machine Learning", "Data Visualization"]
    },
    {
      id: 3,
      title: "UX Research Study",
      type: "Design",
      difficulty: "Intermediate",
      duration: "3 hours",
      description: "Conduct user research and create design recommendations",
      skills: ["User Research", "Prototyping", "Design Thinking", "Figma"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'coding challenge':
      case 'coding': return <Code className="h-4 w-4" />;
      case 'technical assessment':
      case 'technical': return <FileText className="h-4 w-4" />;
      case 'design challenge':
      case 'design': return <Eye className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assessments</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-gray-900">1</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Active Assignments</TabsTrigger>
          <TabsTrigger value="templates">Assessment Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments, candidates, or positions..."
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

          {/* Assignments List */}
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                        {getTypeIcon(assignment.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          <Badge variant="outline" className={getDifficultyColor(assignment.difficulty)}>
                            {assignment.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{assignment.type}</p>
                        
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                                {assignment.candidate.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{assignment.candidate}</p>
                              <p className="text-xs text-gray-500">{assignment.position}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="mr-1 h-4 w-4" />
                              {assignment.timeSpent}
                            </div>
                            <div className="text-sm text-gray-500">
                              Due: {assignment.deadline}
                            </div>
                            {assignment.score && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Score:</span>
                                <span className="text-sm font-semibold text-green-600">{assignment.score}%</span>
                                <Progress value={assignment.score} className="w-16 h-2" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(assignment.status)}>
                              {assignment.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {assignment.status === 'Submitted' && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {getTypeIcon(template.type)}
                      <span className="ml-2">{template.title}</span>
                    </CardTitle>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-1 h-4 w-4" />
                      {template.duration}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        Use Template
                      </Button>
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

export default AssessmentCenter;
