
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Video, Phone, MapPin, Search, Filter, Plus, TrendingUp, CheckCircle2, Star, MessageCircle } from "lucide-react";

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
      initialScore: 91,
      expectedDuration: "90 min",
      preparationNotes: "Executive presentation and strategic vision discussion",
      technicalFocus: ["Strategic Planning", "Leadership Vision", "Market Strategy"]
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
      initialScore: 94,
      expectedDuration: "75 min",
      preparationNotes: "Technical leadership and architecture review",
      technicalFocus: ["Technical Leadership", "System Architecture", "Team Mentoring"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
      case 'confirmed': return 'bg-gradient-to-r from-emerald-500 to-green-600 text-white';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
      case 'completed': return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video call': return <Video className="h-5 w-5 text-amber-600" />;
      case 'phone call': return <Phone className="h-5 w-5 text-emerald-600" />;
      case 'in-person': return <MapPin className="h-5 w-5 text-orange-600" />;
      default: return <Video className="h-5 w-5" />;
    }
  };

  const stats = [
    { 
      label: "Final Candidates", 
      value: interviews.length, 
      icon: TrendingUp, 
      gradient: "from-amber-500 to-orange-600",
      description: "Executive decision candidates"
    },
    { 
      label: "Avg Initial Score", 
      value: Math.round(interviews.reduce((acc, int) => acc + int.initialScore, 0) / interviews.length) + "%", 
      icon: Star, 
      gradient: "from-orange-500 to-red-500",
      description: "From previous rounds"
    },
    { 
      label: "This Week", 
      value: "4", 
      icon: Calendar, 
      gradient: "from-emerald-500 to-green-500",
      description: "Final interviews scheduled"
    },
    { 
      label: "Success Rate", 
      value: "92%", 
      icon: CheckCircle2, 
      gradient: "from-red-500 to-pink-500",
      description: "Final to offer conversion"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 rounded-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}></div>
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${stat.gradient}`}></div>
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search final interviews and candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-gray-200 focus:border-orange-500 rounded-2xl text-lg"
          />
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 border-gray-200 hover:border-orange-500 font-medium">
            <Filter className="mr-2 h-5 w-5" />
            Executive Filter
          </Button>
          <Button className="h-12 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-2xl font-medium shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Schedule Final Interview
          </Button>
        </div>
      </div>

      {/* Final Interviews */}
      <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8">
          <CardTitle className="text-2xl font-bold">Final Interview Round</CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Executive-level decision making for top-tier candidates
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-6 p-8">
            {interviews.map((interview, index) => (
              <Card key={interview.id} className="border-2 border-gray-100 hover:border-orange-300 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl">
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-1">
                  <div className="bg-white rounded-xl">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            <Avatar className="h-16 w-16 ring-4 ring-orange-100 shadow-lg">
                              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xl">
                                {interview.candidate.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {interview.initialScore}%
                            </div>
                          </div>
                          
                          <div className="space-y-3 flex-1">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{interview.candidate}</h3>
                              <p className="text-lg text-gray-600 font-medium">{interview.position}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-orange-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{interview.date}</p>
                                  <p className="text-xs text-gray-500">Interview Date</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-amber-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{interview.time}</p>
                                  <p className="text-xs text-gray-500">{interview.expectedDuration}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                {getTypeIcon(interview.type)}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{interview.type}</p>
                                  <p className="text-xs text-gray-500">{interview.stage}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-3">
                          <Badge className={`${getStatusColor(interview.status)} px-4 py-2 text-sm font-semibold rounded-xl shadow-lg`}>
                            {interview.status}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Interviewer:</span><br />
                            {interview.interviewer}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <MessageCircle className="h-4 w-4 mr-2 text-orange-600" />
                            Preparation Notes
                          </h4>
                          <p className="text-gray-700 text-sm">{interview.preparationNotes}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Focus Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {interview.technicalFocus.map((focus, focusIndex) => (
                              <Badge key={focusIndex} variant="secondary" className="bg-orange-100 text-orange-800 border border-orange-200 px-3 py-1 rounded-full">
                                {focus}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Previous Score:</span>
                            <Progress value={interview.initialScore} className="w-24 h-2" />
                            <span className="text-sm font-bold text-emerald-600">{interview.initialScore}%</span>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button variant="outline" className="rounded-xl border-2 border-orange-200 hover:border-orange-400">
                              View Profile
                            </Button>
                            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl shadow-lg">
                              Start Interview
                            </Button>
                          </div>
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
