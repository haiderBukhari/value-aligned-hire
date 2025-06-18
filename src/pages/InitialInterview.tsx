
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, Phone, MapPin, Search, Filter, Plus, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const InitialInterview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedView, setSelectedView] = useState("grid");

  const interviews = [
    {
      id: 1,
      candidate: "Sarah Johnson",
      position: "Senior Frontend Developer",
      date: "2024-06-08",
      time: "10:00 AM",
      type: "Video Call",
      status: "Scheduled",
      interviewer: "Mike Chen",
      stage: "Initial Screening",
      notes: "Strong technical background, great communication skills",
      rating: 4
    },
    {
      id: 2,
      candidate: "Alex Rodriguez",
      position: "Data Scientist",
      date: "2024-06-08",
      time: "2:00 PM",
      type: "Phone Call",
      status: "Confirmed",
      interviewer: "Emily Davis",
      stage: "Initial Screening",
      notes: "Excellent analytical skills, previous experience relevant",
      rating: 5
    },
    {
      id: 3,
      candidate: "Maria Garcia",
      position: "UX Designer",
      date: "2024-06-09",
      time: "11:30 AM",
      type: "Video Call",
      status: "Pending",
      interviewer: "John Smith",
      stage: "Initial Screening",
      notes: "Creative portfolio, needs technical assessment",
      rating: 3
    },
    {
      id: 4,
      candidate: "David Kim",
      position: "Product Manager",
      date: "2024-06-07",
      time: "3:30 PM",
      type: "In-Person",
      status: "Completed",
      interviewer: "Lisa Wang",
      stage: "Initial Screening",
      notes: "Great leadership potential, ready for next round",
      rating: 4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video call': return <Video className="h-4 w-4 text-blue-600" />;
      case 'phone call': return <Phone className="h-4 w-4 text-green-600" />;
      case 'in-person': return <MapPin className="h-4 w-4 text-purple-600" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'confirmed': 
      case 'scheduled': return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <XCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const todayInterviews = interviews.filter(interview => interview.date === "2024-06-08");
  const upcomingInterviews = interviews.filter(interview => interview.date > "2024-06-08");
  const completedInterviews = interviews.filter(interview => interview.status === "Completed");

  const stats = [
    { label: "Today's Interviews", value: todayInterviews.length, icon: Calendar, color: "bg-blue-500" },
    { label: "This Week", value: 12, icon: Clock, color: "bg-green-500" },
    { label: "Completed", value: completedInterviews.length, icon: CheckCircle, color: "bg-purple-500" },
    { label: "Success Rate", value: "85%", icon: Users, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards with Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`absolute top-0 left-0 w-full h-1 ${stat.color}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search interviews, candidates, or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="shrink-0 rounded-xl border-2 border-gray-200 hover:border-blue-500">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Interview Tabs */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="today" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Today's Interviews
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <div className="grid gap-6">
            {todayInterviews.map((interview) => (
              <Card key={interview.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1">
                  <div className="bg-white rounded-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-14 w-14 ring-4 ring-blue-100">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                              {interview.candidate.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{interview.candidate}</h3>
                              <p className="text-gray-600 font-medium">{interview.position}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span className="font-medium">{interview.time}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                {getTypeIcon(interview.type)}
                                <span>{interview.type}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(interview.status)}
                                <Badge className={`${getStatusColor(interview.status)} font-medium`}>
                                  {interview.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Interviewer:</span> {interview.interviewer}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-1">
                            {getRatingStars(interview.rating)}
                          </div>
                          <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg">
                            Join Interview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid gap-6">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-gray-200">
                        <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold">
                          {interview.candidate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{interview.candidate}</h4>
                        <p className="text-gray-600">{interview.position}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-3 w-3" />
                            {interview.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            {interview.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            {getTypeIcon(interview.type)}
                            <span className="ml-1">{interview.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                      <p className="text-sm text-gray-500">with {interview.interviewer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid gap-6">
            {completedInterviews.map((interview) => (
              <Card key={interview.id} className="border-0 shadow-lg rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-200">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold">
                          {interview.candidate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{interview.candidate}</h4>
                          <p className="text-gray-600">{interview.position}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-700">Rating:</span>
                          {getRatingStars(interview.rating)}
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 italic">"{interview.notes}"</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Completed
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{interview.date}</p>
                      <Button variant="outline" className="mt-2" size="sm">
                        View Details
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

export default InitialInterview;
