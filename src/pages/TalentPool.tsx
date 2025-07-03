
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, Filter, Eye, Star, 
  MapPin, Mail, User, Briefcase, Calendar, MoreHorizontal,
  Users, TrendingUp, AlertCircle, CheckCircle, Clock, Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TalentPool = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const WORKFLOW_STEP_TO_COLUMN = {
    'Application Screening': 'is_screening',
    'Initial Interview': 'is_initial_interview',
    'Assessment': 'in_assessment',
    'Secondary Interview': 'is_secondary_interview',
    'Final Interview': 'in_final_interview',
    'Offer Stage': 'is_hired',
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        
        // Fetch candidates
        const candidatesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/candidates/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!candidatesResponse.ok) throw new Error('Failed to fetch candidates');
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData.candidates || []);

        // Fetch workflow
        const workflowResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/workflow`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (workflowResponse.ok) {
          const workflowData = await workflowResponse.json();
          setWorkflow(workflowData.workflow);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentStage = (candidate: any) => {
    if (!workflow) return 'Unknown';
    
    const workflowSteps = workflow.workflow_process;
    const stepOrder = ['step4', 'step3', 'step2', 'step1'];
    
    for (const step of stepOrder) {
      const stepName = workflowSteps[step];
      const columnName = WORKFLOW_STEP_TO_COLUMN[stepName];
      if (candidate[columnName]) {
        return stepName;
      }
    }
    
    return workflowSteps.step1 || 'Application Screening';
  };

  const getStatusColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'application screening':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'initial interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assessment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'secondary interview':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'final interview':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offer stage':
        return 'bg-green-100 text-green-800 border-green-200';
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

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/dashboard/talent-pool/${candidateId}`);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') {
      return matchesSearch;
    }
    
    const currentStage = getCurrentStage(candidate);
    
    // Fix the tab matching logic
    const tabStageMap = {
      'application_screening': 'Application Screening',
      'assessment': 'Assessment',
      'final_interview': 'Final Interview',
      'offer_stage': 'Offer Stage'
    };
    
    const expectedStage = tabStageMap[selectedTab as keyof typeof tabStageMap];
    const matchesTab = currentStage === expectedStage;
    
    return matchesSearch && matchesTab;
  });

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
      label: "In Progress", 
      value: candidates.filter(c => !c.is_hired).length, 
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500"
    },
    { 
      label: "Hired", 
      value: candidates.filter(c => c.is_hired).length, 
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    { 
      label: "Avg Score", 
      value: candidates.length > 0 ? Math.round(candidates.reduce((acc, c) => acc + (c.total_weighted_score || 0), 0) / candidates.length) : 0, 
      icon: Star,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500"
    }
  ];

  const uniqueStages = workflow ? Object.values(workflow.workflow_process) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Talent Pool</h1>
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
              <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-gray-100 p-1">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="application_screening" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
                >
                  Application Screening
                </TabsTrigger>
                <TabsTrigger 
                  value="assessment" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
                >
                  Assessment
                </TabsTrigger>
                <TabsTrigger 
                  value="final_interview" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
                >
                  Final Interview
                </TabsTrigger>
                <TabsTrigger 
                  value="offer_stage" 
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-xs"
                >
                  Offer Stage
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Enhanced Table */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">Loading candidates...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <TableHead className="font-bold text-gray-900 py-4">Candidate</TableHead>
                      <TableHead className="font-bold text-gray-900">Job Title</TableHead>
                      <TableHead className="font-bold text-gray-900">Current Stage</TableHead>
                      <TableHead className="font-bold text-gray-900">Total Score</TableHead>
                      <TableHead className="font-bold text-gray-900">Applied Date</TableHead>
                      <TableHead className="font-bold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate, index) => {
                      const currentStage = getCurrentStage(candidate);
                      return (
                        <TableRow key={candidate.id} className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                                {candidate.picture ? (
                                  <AvatarImage src={candidate.picture} alt={candidate.applicant_name} />
                                ) : null}
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm">
                                  {candidate.applicant_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-gray-900">{candidate.applicant_name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {candidate.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              Full Stack Developer
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(currentStage)} px-3 py-1 text-xs font-medium`}>
                              {currentStage}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-bold ${getScoreColor(candidate.total_weighted_score || 0)}`}>
                                {candidate.total_weighted_score || 0}%
                              </span>
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900 font-medium">
                              {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'N/A'}
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
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TalentPool;
