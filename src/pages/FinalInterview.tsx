
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Video, Phone, MapPin, Search, Filter, Plus, Crown, Award, Target, TrendingUp, Star } from "lucide-react";

const FinalInterview = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const interviews = [
    {
      id: 1,
      candidate: "David Kim",
      position: "Product Manager",
      date: "2024-06-08",
      time: "2:00 PM",
      type: "In-Person",
      status: "Scheduled",
      interviewer: "CEO & Leadership Team",
      stage: "Final Decision Round",
      overallScore: 91,
      technicalScore: 88,
      culturalFit: 95,
      previousRounds: ["Initial: 89%", "Technical: 88%", "Behavioral: 92%"],
      salaryExpectation: "$120,000 - $140,000",
      startDate: "2024-07-15",
      references: 3
    },
    {
      id: 2,
      candidate: "Sarah Martinez",
      position: "Senior Developer",
      date: "2024-06-09",
      time: "10:00 AM",
      type: "Video Call",
      status: "Confirmed",
      interviewer: "CTO & Senior Team",
      stage: "Final Decision Round",
      overallScore: 94,
      technicalScore: 96,
      culturalFit: 92,
      previousRounds: ["Initial: 92%", "Technical: 96%", "System Design: 93%"],
      salaryExpectation: "$130,000 - $150,000",
      startDate: "2024-07-01",
      references: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg';
      case 'confirmed': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg';
      case 'completed': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const stats = [
    { 
      label: "Final Candidates", 
      value: interviews.length, 
      icon: Crown, 
      gradient: "from-yellow-500 to-amber-500",
      description: "Top performers reaching final round"
    },
    { 
      label: "Avg Score", 
      value: Math.round(interviews.reduce((acc, int) => acc + int.overallScore, 0) / interviews.length) + "%", 
      icon: Award, 
      gradient: "from-purple-500 to-indigo-500",
      description: "Cumulative assessment score"
    },
    { 
      label: "Decision Rate", 
      value: "95%", 
      icon: Target, 
      gradient: "from-green-500 to-teal-500",
      description: "Final round to offer conversion"
    },
    { 
      label: "Time to Hire", 
      value: "12 days", 
      icon: TrendingUp, 
      gradient: "from-blue-500 to-cyan-500",
      description: "Average process duration"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:scale-110 rounded-3xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
            <div className={`absolute top-0 left-0 w-full h-3 bg-gradient-to-r ${stat.gradient} shadow-lg`}></div>
            <div className={`absolute top-3 right-3 w-2 h-2 bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}></div>
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.description}</p>
                </div>
                <div className={`p-4 rounded-3xl bg-gradient-to-br ${stat.gradient} shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Premium Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-5 h-6 w-6 text-gray-400" />
          <Input
            placeholder="Search final round candidates and decisions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 h-14 border-3 border-gray-200 focus:border-amber-500 rounded-3xl text-lg font-medium shadow-lg"
          />
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" className="h-14 px-8 rounded-3xl border-3 border-gray-200 hover:border-amber-500 font-semibold text-lg">
            <Filter className="mr-3 h-6 w-6" />
            Executive Filter
          </Button>
          <Button className="h-14 px-8 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-3xl font-semibold text-lg shadow-xl">
            <Plus className="mr-3 h-6 w-6" />
            Schedule Final Interview
          </Button>
        </div>
      </div>

      {/* Final Interviews - Premium Design */}
      <Card className="border-0 shadow-3xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white p-10">
          <div className="flex items-center space-x-4">
            <Crown className="h-10 w-10 text-white" />
            <div>
              <CardTitle className="text-3xl font-black">Final Interview Round</CardTitle>
              <CardDescription className="text-yellow-100 text-xl font-medium">
                Executive-level assessment for top-tier candidates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-8 p-10">
            {interviews.map((interview, index) => (
              <Card key={interview.id} className="border-3 border-amber-100 hover:border-amber-300 transition-all duration-500 rounded-3xl overflow-hidden hover:shadow-2xl transform hover:scale-[1.02]">
                <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-2">
                  <div className="bg-white rounded-2xl">
                    <CardContent className="p-10">
                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-start space-x-8">
                          <div className="relative">
                            <Avatar className="h-20 w-20 ring-6 ring-amber-200 shadow-2xl">
                              <AvatarFallback className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-2xl">
                                {interview.candidate.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                              {interview.overallScore}%
                            </div>
                            <Crown className="absolute -bottom-2 -left-2 h-6 w-6 text-amber-500" />
                          </div>
                          
                          <div className="space-y-4 flex-1">
                            <div>
                              <h3 className="text-3xl font-black text-gray-900 mb-2">{interview.candidate}</h3>
                              <p className="text-xl text-gray-600 font-bold">{interview.position}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <Calendar className="h-6 w-6 text-amber-600" />
                                  <div>
                                    <p className="text-lg font-bold text-gray-900">{interview.date}</p>
                                    <p className="text-sm text-gray-500">Interview Date</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Clock className="h-6 w-6 text-blue-600" />
                                  <div>
                                    <p className="text-lg font-bold text-gray-900">{interview.time}</p>
                                    <p className="text-sm text-gray-500">Scheduled Time</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                  <MapPin className="h-6 w-6 text-purple-600" />
                                  <div>
                                    <p className="text-lg font-bold text-gray-900">{interview.type}</p>
                                    <p className="text-sm text-gray-500">Interview Format</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Award className="h-6 w-6 text-green-600" />
                                  <div>
                                    <p className="text-lg font-bold text-gray-900">{interview.references} References</p>
                                    <p className="text-sm text-gray-500">Verified</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-4">
                          <Badge className={`${getStatusColor(interview.status)} px-6 py-3 text-lg font-bold rounded-2xl`}>
                            {interview.status}
                          </Badge>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-semibold">Executive Panel:</p>
                            <p>{interview.interviewer}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Scores Section */}
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className={`p-6 rounded-2xl ${getScoreColor(interview.overallScore)} border-2`}>
                          <div className="text-center">
                            <p className="text-3xl font-black">{interview.overallScore}%</p>
                            <p className="text-sm font-semibold">Overall Score</p>
                          </div>
                        </div>
                        <div className={`p-6 rounded-2xl ${getScoreColor(interview.technicalScore)} border-2`}>
                          <div className="text-center">
                            <p className="text-3xl font-black">{interview.technicalScore}%</p>
                            <p className="text-sm font-semibold">Technical</p>
                          </div>
                        </div>
                        <div className={`p-6 rounded-2xl ${getScoreColor(interview.culturalFit)} border-2`}>
                          <div className="text-center">
                            <p className="text-3xl font-black">{interview.culturalFit}%</p>
                            <p className="text-sm font-semibold">Cultural Fit</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Previous Rounds */}
                      <div className="space-y-4 mb-8">
                        <h4 className="text-xl font-bold text-gray-900 flex items-center">
                          <Star className="h-5 w-5 mr-2 text-amber-500" />
                          Interview Journey
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {interview.previousRounds.map((round, roundIndex) => (
                            <Badge key={roundIndex} variant="secondary" className="bg-amber-100 text-amber-800 border-2 border-amber-200 px-4 py-2 rounded-xl font-semibold">
                              {round}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Candidate Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                          <h4 className="font-bold text-gray-900 mb-3">Salary Expectation</h4>
                          <p className="text-2xl font-black text-green-600">{interview.salaryExpectation}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                          <h4 className="font-bold text-gray-900 mb-3">Available Start Date</h4>
                          <p className="text-2xl font-black text-blue-600">{interview.startDate}</p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-6 border-t-3 border-amber-200">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-700">Decision Ready:</span>
                          <Progress value={interview.overallScore} className="w-32 h-4" />
                        </div>
                        
                        <div className="flex space-x-4">
                          <Button variant="outline" className="px-8 py-3 rounded-2xl border-3 border-amber-200 hover:border-amber-400 font-bold text-lg">
                            Review Complete Profile
                          </Button>
                          <Button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 rounded-2xl font-bold text-lg shadow-xl">
                            Conduct Final Interview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalInterview;
