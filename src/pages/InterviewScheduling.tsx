import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addMonths, subMonths, getHours, setHours, isSameMonth } from "date-fns";
import { 
  Settings, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Copy, 
  Trash2,
  Video,
  Phone,
  MapPin,
  User,
  Users
} from "lucide-react";

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
    interviewer: "Sarah Johnson"
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
    interviewer: "Mike Chen"
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
    interviewer: "Alex Rodriguez"
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
    interviewer: "Lisa Wong"
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
    interviewer: "John Smith"
  }
];

// Default availability template
const defaultAvailability = {
  monday: { enabled: true, slots: [{ from: "09:00", to: "17:00" }] },
  tuesday: { enabled: true, slots: [{ from: "09:00", to: "17:00" }] },
  wednesday: { enabled: true, slots: [{ from: "09:00", to: "17:00" }] },
  thursday: { enabled: true, slots: [{ from: "09:00", to: "17:00" }] },
  friday: { enabled: true, slots: [{ from: "09:00", to: "17:00" }] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] }
};

const InterviewScheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(defaultAvailability);
  const [availabilityMonth, setAvailabilityMonth] = useState(new Date());

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  // Add time slot to availability
  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: [...prev[day as keyof typeof prev].slots, { from: "09:00", to: "17:00" }]
      }
    }));
  };

  // Remove time slot
  const removeTimeSlot = (day: string, index: number) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: prev[day as keyof typeof prev].slots.filter((_, i) => i !== index)
      }
    }));
  };

  // Update time slot
  const updateTimeSlot = (day: string, index: number, field: 'from' | 'to', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: prev[day as keyof typeof prev].slots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  // Copy availability to all weekdays
  const copyToWeekdays = (sourceDay: string) => {
    const sourceAvailability = availability[sourceDay as keyof typeof availability];
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    setAvailability(prev => {
      const updated = { ...prev };
      weekdays.forEach(day => {
        updated[day as keyof typeof updated] = {
          enabled: sourceAvailability.enabled,
          slots: [...sourceAvailability.slots]
        };
      });
      return updated;
    });
  };

  // Toggle day availability
  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        enabled: !prev[day as keyof typeof prev].enabled
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Scheduling</h1>
          <p className="text-gray-600 mt-1">Manage your availability and interview calendar</p>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Interview Calendar
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Availability Settings
          </TabsTrigger>
        </TabsList>

        {/* Interview Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Interview Calendar
                  </CardTitle>
                  <CardDescription>
                    View and manage your scheduled interviews (GMT+1)
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={calendarView} onValueChange={(value: "day" | "week") => setCalendarView(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day View</SelectItem>
                      <SelectItem value="week">Week View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Mini Calendar */}
                <div className="lg:col-span-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    className="rounded-md border"
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground"
                    }}
                  />
                  
                  {/* Interview Summary */}
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Today's Interviews</h4>
                    {getInterviewsForDate(new Date()).map((interview) => (
                      <div key={interview.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          {getMeetingIcon(interview.meetingType)}
                          <span className="text-sm font-medium text-blue-900">{interview.time}</span>
                        </div>
                        <p className="text-sm text-blue-800">{interview.candidateName}</p>
                        <p className="text-xs text-blue-600">{interview.type}</p>
                      </div>
                    ))}
                    {getInterviewsForDate(new Date()).length === 0 && (
                      <p className="text-sm text-gray-500">No interviews scheduled</p>
                    )}
                  </div>
                </div>

                {/* Main Calendar View */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg border">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDate(subMonths(selectedDate, 1))}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-lg font-semibold">
                          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDate(addMonths(selectedDate, 1))}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        GMT+1
                      </Badge>
                    </div>

                    {/* Time Slots */}
                    <div className="p-4">
                      {calendarView === "day" ? (
                        <div className="space-y-2">
                          {generateTimeSlots().map((timeSlot) => {
                            const interview = getInterviewsForDate(selectedDate).find(
                              int => int.time === timeSlot
                            );
                            
                            return (
                              <div key={timeSlot} className="flex items-center border-b border-gray-100 py-2">
                                <div className="w-16 text-sm text-gray-500 font-mono">
                                  {timeSlot}
                                </div>
                                <div className="flex-1 ml-4">
                                  {interview ? (
                                    <div className={`p-3 rounded-lg border transition-all hover:shadow-md ${getStatusColor(interview.status)}`}>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src="" />
                                            <AvatarFallback className="text-xs">
                                              {interview.candidateName.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium text-sm">{interview.candidateName}</p>
                                            <p className="text-xs opacity-75">{interview.type} • {interview.position}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {getMeetingIcon(interview.meetingType)}
                                          <span className="text-xs">{interview.duration}min</span>
                                          <Badge variant="outline" className="text-xs">
                                            {interview.interviewer}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400 py-3">
                                      Available
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-7 gap-2">
                          {weekDayLabels.map((day, index) => {
                            const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
                            const dayDate = addDays(weekStart, index);
                            const dayInterviews = getInterviewsForDate(dayDate);
                            
                            return (
                              <div key={day} className="border rounded-lg p-3 min-h-[200px]">
                                <div className="text-center mb-2">
                                  <p className="text-sm font-medium text-gray-900">{day}</p>
                                  <p className="text-xs text-gray-500">{format(dayDate, 'd')}</p>
                                </div>
                                <div className="space-y-1">
                                  {dayInterviews.map((interview) => (
                                    <div key={interview.id} className={`p-2 rounded text-xs ${getStatusColor(interview.status)}`}>
                                      <p className="font-medium">{interview.time}</p>
                                      <p className="truncate">{interview.candidateName}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Settings Tab */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Availability Settings
              </CardTitle>
              <CardDescription>
                Set your weekly availability schedule (GMT+1)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {weekDays.map((day, index) => (
                <div key={day} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={availability[day as keyof typeof availability].enabled}
                        onCheckedChange={() => toggleDayAvailability(day)}
                      />
                      <Label className="text-sm font-medium capitalize">{day}</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToWeekdays(day)}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy to weekdays
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day)}
                        disabled={!availability[day as keyof typeof availability].enabled}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add slot
                      </Button>
                    </div>
                  </div>

                  {availability[day as keyof typeof availability].enabled && (
                    <div className="space-y-3 ml-6">
                      {availability[day as keyof typeof availability].slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-gray-500">From</Label>
                            <Input
                              type="time"
                              value={slot.from}
                              onChange={(e) => updateTimeSlot(day, slotIndex, 'from', e.target.value)}
                              className="w-24 h-8"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-xs text-gray-500">To</Label>
                            <Input
                              type="time"
                              value={slot.to}
                              onChange={(e) => updateTimeSlot(day, slotIndex, 'to', e.target.value)}
                              className="w-24 h-8"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(day, slotIndex)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline">Reset to Default</Button>
                <Button>Save Availability</Button>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Calendar Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Monthly Schedule Preview
              </CardTitle>
              <CardDescription>
                Preview and adjust availability for specific dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={() => setAvailabilityMonth(subMonths(availabilityMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {format(availabilityMonth, 'MMMM yyyy')}
                </h3>
                <Button variant="outline" size="sm" onClick={() => setAvailabilityMonth(addMonths(availabilityMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={availabilityMonth}
                onMonthChange={setAvailabilityMonth}
                className="rounded-md border w-full"
                classNames={{
                  months: "flex w-full",
                  month: "space-y-4 w-full",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent w-full",
                  day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground"
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewScheduling;