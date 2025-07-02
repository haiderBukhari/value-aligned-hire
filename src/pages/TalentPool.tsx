
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Search, Filter, Users, Briefcase, Clock, CheckCircle, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Candidate {
  id: string;
  applicant_name: string;
  email: string;
  job_title: string;
  current_stage: string;
  total_weighted_score: number;
  final_recommendation: string;
  created_at: string;
  status: string;
}

const TalentPool = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with actual API call
  const mockCandidates: Candidate[] = [
    {
      id: "1",
      applicant_name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      job_title: "Senior Frontend Developer",
      current_stage: "Final Interview",
      total_weighted_score: 92,
      final_recommendation: "Strong Match",
      created_at: "2024-01-15T10:30:00Z",
      status: "active"
    },
    {
      id: "2",
      applicant_name: "Mike Chen",
      email: "mike.chen@email.com",
      job_title: "Product Manager",
      current_stage: "Initial Interview",
      total_weighted_score: 88,
      final_recommendation: "Good Match",
      created_at: "2024-01-14T14:20:00Z",
      status: "active"
    },
    {
      id: "3",
      applicant_name: "Emily Davis",
      email: "emily.davis@email.com",
      job_title: "UX Designer",
      current_stage: "Offer Stage",
      total_weighted_score: 95,
      final_recommendation: "Strong Match",
      created_at: "2024-01-13T09:15:00Z",
      status: "active"
    },
    {
      id: "4",
      applicant_name: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      job_title: "Data Scientist",
      current_stage: "Assessment",
      total_weighted_score: 85,
      final_recommendation: "Moderate Fit",
      created_at: "2024-01-12T16:45:00Z",
      status: "active"
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'application screening': return 'bg-blue-100 text-blue-800';
      case 'assessment': return 'bg-yellow-100 text-yellow-800';
      case 'initial interview': return 'bg-purple-100 text-purple-800';
      case 'secondary interview': return 'bg-orange-100 text-orange-800';
      case 'final interview': return 'bg-indigo-100 text-indigo-800';
      case 'offer stage': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case 'strong match': return 'bg-green-500 text-white';
      case 'good match': return 'bg-blue-500 text-white';
      case 'moderate fit': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewCandidate = (candidateId: string) => {
    navigate(`/dashboard/talent-pool/${candidateId}`);
  };

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || candidate.current_stage.toLowerCase() === stageFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStage && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Talent Pool</h1>
              <p className="text-gray-600">Manage and track all candidates across different stages</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                {filteredCandidates.length} Candidates
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="application screening">Application Screening</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="initial interview">Initial Interview</SelectItem>
                <SelectItem value="secondary interview">Secondary Interview</SelectItem>
                <SelectItem value="final interview">Final Interview</SelectItem>
                <SelectItem value="offer stage">Offer Stage</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate, index) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {candidate.applicant_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {candidate.applicant_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{candidate.email}</p>
                    </div>
                  </div>
                  <Badge className={`${getRecommendationColor(candidate.final_recommendation)} text-xs px-2 py-1`}>
                    <Star className="h-3 w-3 mr-1" />
                    {candidate.total_weighted_score}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{candidate.job_title}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Current Stage</span>
                    </div>
                    <Badge className={`${getStageColor(candidate.current_stage)} text-xs px-2 py-1`}>
                      {candidate.current_stage}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Score</span>
                    <span className={`text-sm font-bold ${getScoreColor(candidate.total_weighted_score)}`}>
                      {candidate.total_weighted_score}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${candidate.total_weighted_score}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      Applied {new Date(candidate.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewCandidate(candidate.id)}
                      className="flex items-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentPool;
