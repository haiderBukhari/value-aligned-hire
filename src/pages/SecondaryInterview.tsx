
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Video, Phone, MapPin, Search, Filter, Plus, TrendingUp, CheckCircle2, Star, MessageCircle } from "lucide-react";

const SecondaryInterview = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const interviews = [
    {
      id: 1,
      candidate: "Emily Chen",
      position: "UX Designer",
      date: "2024-06-08",
      time: "11:00 AM",
      type: "Video Call",
      status: "Scheduled",
      interviewer: "Sarah Williams",
      stage: "Technical Round",
      initialScore: 95,
      expectedDuration: "60 min",
      preparationNotes: "Portfolio review and design challenge",
      technicalFocus: ["Design Systems", "User Research", "Prototyping"]
    },
    {
      id: 2,
      candidate: "James Wilson",
      position: "Backend Developer",
      date: "2024-06-08",
      time: "3:00 PM",
      type: "In-Person",
      status: "Confirmed",
      interviewer: "Tech Team",
      stage: "Technical Round",
      initialScore: 88,
      expectedDuration: "90 min",
      preparationNotes: "System design and coding assessment",
      technicalFocus: ["System Architecture", "Database Design", "API Development"]
    },
    {
      id: 3,
      candidate: "Lisa Rodriguez",
      position: "Product Manager",
      date: "2024-06-09",
      time: "10:30 AM",
      type: "Video Call",
      status: "Pending",
      interviewer: "Product Team",
      stage: "Behavioral Round",
      initialScore: 92,
      expectedDuration: "45 min",
      preparationNotes: "Leadership scenarios and product strategy",
      technicalFocus: ["Strategy Planning", "Team Leadership", "Market Analysis"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'confirmed': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'completed': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video call': return <Video className="h-5 w-5 text-blue-600" />;
      case 'phone call': return <Phone className="h-5 w-5 text-green-600" />;
      case 'in-person': return <MapPin className="h-5 w-5 text-purple-600" />;
      default: return <Video className="h-5 w-5" />;
    }
  };

  const stats = [
    { 
      label: "Advanced Candidates", 
      value: interviews.length, 
      icon: TrendingUp, 
      gradient: "from-blue-500 to-purple-600",
      description: "Progressed from initial screening"
    },
    { 
      label: "Avg Initial Score", 
      value: Math.round(interviews.reduce((acc, int) => acc + int.initialScore, 0) / interviews.length) + "%", 
      icon: Star, 
      gradient: "from-yellow-500 to-orange-500",
      description: "From previous round"
    },
    { 
      label: "This Week", 
      value: "8", 
      icon: Calendar, 
      gradient: "from-green-500 to-teal-500",
      description: "Scheduled interviews"
    },
    { 
      label: "Success Rate", 
      value: "78%", 
      icon: CheckCircle2, 
      gradient: "from-purple-500 to-pink-500",
      description: "Progression to next round"
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
            placeholder="Search advanced interviews and candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-2 border-gray-200 focus:border-purple-500 rounded-2xl text-lg"
          />
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 border-gray-200 hover:border-purple-500 font-medium">
            <Filter className="mr-2 h-5 w-5" />
            Advanced Filter
          </Button>
          <Button className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl font-medium shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            Schedule Advanced Interview
          </Button>
        </div>
      </div>

      {/* Advanced Interviews */}
      <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <CardTitle className="text-2xl font-bold">Secondary Interview Round</CardTitle>
          <CardDescription className="text-purple-100 text-lg">
            Advanced technical and behavioral assessments for qualified candidates
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="space-y-6 p-8">
            {interviews.map((interview, index) => (
              <Card key={interview.id} className="border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 rounded-2xl overflow-hidden hover:shadow-xl">
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-1">
                  <div className="bg-white rounded-xl">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-6">
                          <div className="relative">
                            <Avatar className="h-16 w-16 ring-4 ring-purple-100 shadow-lg">
                              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xl">
                                {interview.candidate.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
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
                                <Calendar className="h-5 w-5 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{interview.date}</p>
                                  <p className="text-xs text-gray-500">Interview Date</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-blue-600" />
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
                            <MessageCircle className="h-4 w-4 mr-2 text-purple-600" />
                            Preparation Notes
                          </h4>
                          <p className="text-gray-700 text-sm">{interview.preparationNotes}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Technical Focus Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {interview.technicalFocus.map((focus, focusIndex) => (
                              <Badge key={focusIndex} variant="secondary" className="bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full">
                                {focus}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">Initial Round Score:</span>
                            <Progress value={interview.initialScore} className="w-24 h-2" />
                            <span className="text-sm font-bold text-green-600">{interview.initialScore}%</span>
                          </div>
                          
                          <div className="flex space-x-3">
                            <Button variant="outline" className="rounded-xl border-2 border-purple-200 hover:border-purple-400">
                              View Profile
                            </Button>
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg">
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

export default SecondaryInterview;
