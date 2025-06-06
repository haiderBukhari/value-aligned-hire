
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Video, Phone, MapPin, Plus, Filter, Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

const InterviewManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
      duration: "45 min",
      stage: "Technical Round"
    },
    {
      id: 2,
      candidate: "Alex Rodriguez",
      position: "Data Scientist",
      date: "2024-06-08",
      time: "2:00 PM",
      type: "In-Person",
      status: "Confirmed",
      interviewer: "Emily Davis",
      duration: "60 min",
      stage: "Final Round"
    },
    {
      id: 3,
      candidate: "Maria Garcia",
      position: "UX Designer",
      date: "2024-06-09",
      time: "11:30 AM",
      type: "Phone Call",
      status: "Pending",
      interviewer: "John Smith",
      duration: "30 min",
      stage: "Initial Screening"
    },
    {
      id: 4,
      candidate: "David Kim",
      position: "Product Manager",
      date: "2024-06-09",
      time: "3:30 PM",
      type: "Video Call",
      status: "Completed",
      interviewer: "Lisa Wang",
      duration: "50 min",
      stage: "Behavioral Round"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video call': return <Video className="h-4 w-4" />;
      case 'phone call': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  const todayInterviews = interviews.filter(interview => interview.date === "2024-06-08");
  const upcomingInterviews = interviews.filter(interview => interview.date > "2024-06-08");

  return (
    <div className="space-y-8">
      {/* Header */}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search interviews, candidates, or positions..."
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Interviews</p>
                <p className="text-3xl font-bold text-gray-900">{todayInterviews.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Clock className="h-6 w-6 text-green-600" />
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
              <div className="p-3 rounded-lg bg-purple-50">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Interviews</CardTitle>
          <CardDescription>Interviews scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {interview.candidate.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{interview.candidate}</h4>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {interview.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {getTypeIcon(interview.type)}
                        <span className="ml-1">{interview.type}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{interview.stage}</p>
                  <p className="text-sm text-gray-500">with {interview.interviewer}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Interviews */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Interviews</CardTitle>
          <CardDescription>Interviews scheduled for the coming days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                      {interview.candidate.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">{interview.candidate}</h4>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                    <div className="flex items-center space-x-3 mt-1">
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
                <div className="text-right">
                  <Badge variant="outline" className={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{interview.stage}</p>
                  <p className="text-sm text-gray-500">with {interview.interviewer}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewManagement;
