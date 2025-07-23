import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addMonths, subMonths, getHours, setHours, isSameMonth } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Video,
  Phone,
  MapPin,
  User,
  Users,
  Filter,
  Search,
  MoreVertical,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Dummy data for interviews
const dummyInterviews = [
  {
    id: 1,
    candidateName: "Abdullah Rahman",
    position: "Frontend Developer",
    type: "Final Interview",
    date: new Date(2025, 0, 23), // January 23, 2025
    time: "10:00",
    duration: 60,
    status: "scheduled",
    meetingType: "video",
    interviewer: "Sarah Johnson",
    avatar: ""
  },
  {
    id: 2,
    candidateName: "Fatima Al-Zahra",
    position: "Backend Developer", 
    type: "Initial Interview",
    date: new Date(2025, 0, 23),
    time: "14:30",
    duration: 45,
    status: "scheduled",
    meetingType: "phone",
    interviewer: "Mike Chen",
    avatar: ""
  },
  {
    id: 3,
    candidateName: "Omar Hassan",
    position: "Full Stack Developer",
    type: "Technical Assessment",
    date: new Date(2025, 0, 24),
    time: "09:00",
    duration: 90,
    status: "completed",
    meetingType: "video",
    interviewer: "Alex Rodriguez",
    avatar: ""
  },
  {
    id: 4,
    candidateName: "Aisha Patel",
    position: "UI/UX Designer",
    type: "Portfolio Review",
    date: new Date(2025, 0, 24),
    time: "15:00",
    duration: 60,
    status: "scheduled",
    meetingType: "video",
    interviewer: "Lisa Wong",
    avatar: ""
  },
  {
    id: 5,
    candidateName: "Mohamed El-Rashid",
    position: "DevOps Engineer",
    type: "Final Interview",
    date: new Date(2025, 0, 25),
    time: "11:00",
    duration: 75,
    status: "upcoming",
    meetingType: "video",
    interviewer: "John Smith",
    avatar: ""
  }
];

const InterviewCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  // Get stats for selected date
  const getDateStats = (date: Date) => {
    const dayInterviews = getInterviewsForDate(date);
    const completed = dayInterviews.filter(i => i.status === 'completed').length;
    const scheduled = dayInterviews.filter(i => i.status === 'scheduled').length;
    const upcoming = dayInterviews.filter(i => i.status === 'upcoming').length;
    
    return { total: dayInterviews.length, completed, scheduled, upcoming };
  };

  // Get interviews for selected date
  const getInterviewsForDate = (date: Date) => {
    return dummyInterviews.filter(interview => 
      isSameDay(interview.date, date)
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  // Generate time slots for day view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'completed': return 'bg-green-50 text-green-700 border border-green-200';
      case 'upcoming': return 'bg-purple-50 text-purple-700 border border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-blue-500" />;
      case 'phone': return <Phone className="h-4 w-4 text-green-500" />;
      case 'in-person': return <MapPin className="h-4 w-4 text-orange-500" />;
      default: return <Video className="h-4 w-4 text-blue-500" />;
    }
  };

  const todaysInterviews = getInterviewsForDate(new Date());
  const upcomingInterviews = dummyInterviews.filter(interview => 
    interview.date > new Date()
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Calendar</h1>
          <p className="text-gray-600 mt-1">View and manage your scheduled interviews (GMT+1)</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={calendarView} onValueChange={(value: "day" | "week") => setCalendarView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Today's Interviews</p>
                <p className="text-2xl font-bold text-blue-900">{todaysInterviews.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">This Week</p>
                <p className="text-2xl font-bold text-green-900">12</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Completed</p>
                <p className="text-2xl font-bold text-purple-900">45</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Pending</p>
                <p className="text-2xl font-bold text-orange-900">8</p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Navigation Calendar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-hidden">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="rounded-md border-0 w-full"
                  classNames={{
                    months: "flex w-full flex-col",
                    month: "space-y-2 w-full",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-7 font-normal text-[0.7rem]",
                    row: "flex w-full mt-1",
                    cell: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20 w-7",
                    day: "h-7 w-7 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md text-xs",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground font-medium"
                  }}
                />
              </div>
              
              {/* Selected Date Stats */}
              {selectedDate && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">
                    {format(selectedDate, 'MMM d, yyyy')}
                  </h4>
                  {(() => {
                    const stats = getDateStats(selectedDate);
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Total Interviews</span>
                          <span className="font-medium text-gray-900">{stats.total}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Completed</span>
                          <span className="font-medium text-green-600">{stats.completed}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Scheduled</span>
                          <span className="font-medium text-blue-600">{stats.scheduled}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Upcoming</span>
                          <span className="font-medium text-purple-600">{stats.upcoming}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Today's Interviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysInterviews.length > 0 ? (
                todaysInterviews.map((interview) => (
                  <div key={interview.id} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      {getMeetingIcon(interview.meetingType)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{interview.candidateName}</p>
                        <p className="text-xs text-gray-600">{interview.time} • {interview.type}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CalendarIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No interviews today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {interview.candidateName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{interview.candidateName}</p>
                      <p className="text-xs text-gray-600">{format(interview.date, 'MMM d')} • {interview.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar View */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader className="border-b bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h2>
                    <p className="text-sm text-gray-500">GMT+1 Timezone</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Search interviews..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Button size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {calendarView === "day" ? (
                <div className="max-h-[600px] overflow-y-auto">
                  {generateTimeSlots().map((timeSlot, index) => {
                    const interview = getInterviewsForDate(selectedDate).find(
                      int => int.time === timeSlot
                    );
                    
                    return (
                      <div key={timeSlot} className={`flex border-b border-gray-100 min-h-[50px] ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                        <div className="w-16 p-3 border-r border-gray-100 bg-gray-50 flex items-center">
                          <span className="text-xs font-mono text-gray-600">{timeSlot}</span>
                        </div>
                        <div className="flex-1 p-3">
                          {interview ? (
                            <div className={`p-3 rounded-lg transition-all hover:shadow-lg cursor-pointer ${getStatusColor(interview.status)}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                      {interview.candidateName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-sm">{interview.candidateName}</h4>
                                    <p className="text-xs opacity-80">{interview.type} • {interview.position}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getMeetingIcon(interview.meetingType)}
                                  <Badge variant="outline" className="text-xs">
                                    {interview.duration}min
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {interview.interviewer}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 py-2 border-l-2 border-transparent hover:border-blue-200 pl-3 transition-colors">
                              Available
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 max-h-[600px] overflow-y-auto">
                  <div className="grid grid-cols-7 gap-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                      const dayDate = addDays(weekStart, index);
                      const dayInterviews = getInterviewsForDate(dayDate);
                      
                      return (
                        <div key={day} className={`border rounded-lg p-3 min-h-[250px] bg-gradient-to-b from-white to-gray-50 cursor-pointer transition-all hover:shadow-md ${isSameDay(dayDate, selectedDate) ? 'ring-2 ring-blue-500' : ''}`}
                             onClick={() => setSelectedDate(dayDate)}>
                          <div className="text-center mb-3 pb-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{day}</p>
                            <p className="text-xl font-bold text-blue-600">{format(dayDate, 'd')}</p>
                          </div>
                          <div className="space-y-2">
                            {dayInterviews.slice(0, 3).map((interview) => (
                              <div key={interview.id} className={`p-2 rounded text-xs transition-all hover:shadow-md ${getStatusColor(interview.status)}`}>
                                <p className="font-medium">{interview.time}</p>
                                <p className="truncate">{interview.candidateName}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {getMeetingIcon(interview.meetingType)}
                                  <span className="text-xs opacity-75">{interview.duration}m</span>
                                 </div>
                               </div>
                             ))}
                             {dayInterviews.length > 3 && (
                               <div className="text-xs text-gray-500 text-center py-1">
                                 +{dayInterviews.length - 3} more
                               </div>
                             )}
                             {dayInterviews.length === 0 && (
                               <div className="text-xs text-gray-400 text-center py-4">
                                 No interviews
                               </div>
                             )}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}
             </CardContent>
           </Card>
         </div>
       </div>
     </div>
   );
 };
 
 export default InterviewCalendar;