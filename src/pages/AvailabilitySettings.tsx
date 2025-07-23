import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths } from "date-fns";
import { 
  Settings, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2,
  Save,
  RotateCcw,
  CheckCircle
} from "lucide-react";

// Default availability template - all days disabled initially
const defaultAvailability = {
  monday: { enabled: false, slots: [] },
  tuesday: { enabled: false, slots: [] },
  wednesday: { enabled: false, slots: [] },
  thursday: { enabled: false, slots: [] },
  friday: { enabled: false, slots: [] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] }
};

const AvailabilitySettings = () => {
  const [availability, setAvailability] = useState(defaultAvailability);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilityMonth, setAvailabilityMonth] = useState(new Date());
  const [hasChanges, setHasChanges] = useState(false);

  // Dummy booking data for selected date
  const getBookingsForDate = (date: Date) => {
    const dummyBookings = [
      { time: "09:30", candidate: "John Doe", type: "Initial Interview" },
      { time: "14:00", candidate: "Jane Smith", type: "Final Interview" },
      { time: "16:30", candidate: "Alex Johnson", type: "Technical Assessment" }
    ];
    
    // Return bookings only for specific dates (for demo)
    if (date.getDate() === new Date().getDate()) {
      return dummyBookings;
    }
    return [];
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekDayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Add time slot to availability
  const addTimeSlot = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: [...prev[day as keyof typeof prev].slots, { from: "09:00", to: "17:00" }]
      }
    }));
    setHasChanges(true);
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
    setHasChanges(true);
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
    setHasChanges(true);
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
    setHasChanges(true);
  };

  // Reset to default
  const resetToDefault = () => {
    setAvailability(defaultAvailability);
    setHasChanges(false);
  };

  // Save availability
  const saveAvailability = () => {
    // Here you would typically save to backend
    setHasChanges(false);
    console.log('Saving availability:', availability);
  };

  const getDayIcon = (day: string, enabled: boolean) => {
    if (!enabled) return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    return <div className="w-4 h-4 rounded-full bg-green-500" />;
  };

  const getEnabledDaysCount = () => {
    return Object.values(availability).filter(day => day.enabled).length;
  };

  const getTotalSlots = () => {
    return Object.values(availability).reduce((total, day) => {
      return total + (day.enabled ? day.slots.length : 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability Settings</h1>
          <p className="text-gray-600 mt-1">Configure your weekly availability schedule (GMT+1)</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <Clock className="h-4 w-4" />
              Unsaved changes
            </div>
          )}
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveAvailability} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Days</p>
                <p className="text-2xl font-bold text-blue-900">{getEnabledDaysCount()}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Time Slots</p>
                <p className="text-2xl font-bold text-green-900">{getTotalSlots()}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Status</p>
                <p className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {hasChanges ? 'Modified' : 'Saved'}
                </p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
              <CardDescription>
                Set your availability for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weekDays.map((day, index) => (
                <div key={day} className={`border rounded-xl p-5 transition-all ${
                  availability[day as keyof typeof availability].enabled 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={availability[day as keyof typeof availability].enabled}
                        onCheckedChange={() => toggleDayAvailability(day)}
                      />
                      {getDayIcon(day, availability[day as keyof typeof availability].enabled)}
                      <Label className="text-lg font-medium capitalize">{weekDayLabels[index]}</Label>
                    </div>
                    <div className="flex gap-2">
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
                    <div className="space-y-3">
                      {availability[day as keyof typeof availability].slots.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No time slots configured</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(day)}
                            className="mt-2"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add first slot
                          </Button>
                        </div>
                      ) : (
                        availability[day as keyof typeof availability].slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600 min-w-[40px]">From</Label>
                                <Input
                                  type="time"
                                  value={slot.from}
                                  onChange={(e) => updateTimeSlot(day, slotIndex, 'from', e.target.value)}
                                  className="w-32 h-9"
                                />
                              </div>
                              <div className="w-4 h-px bg-gray-300" />
                              <div className="flex items-center gap-2">
                                <Label className="text-sm text-gray-600 min-w-[20px]">To</Label>
                                <Input
                                  type="time"
                                  value={slot.to}
                                  onChange={(e) => updateTimeSlot(day, slotIndex, 'to', e.target.value)}
                                  className="w-32 h-9"
                                />
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeTimeSlot(day, slotIndex)}
                              className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {!availability[day as keyof typeof availability].enabled && (
                    <div className="text-center py-4 text-gray-400">
                      <p className="text-sm">Day is disabled</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Calendar Preview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weekDayLabels.map((dayLabel, index) => {
                const day = weekDays[index];
                const dayData = availability[day as keyof typeof availability];
                return (
                  <div key={day} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {getDayIcon(day, dayData.enabled)}
                      <span className="text-sm font-medium">{dayLabel}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {dayData.enabled ? `${dayData.slots.length} slot${dayData.slots.length !== 1 ? 's' : ''}` : 'Disabled'}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Monthly Calendar Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Calendar Preview</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setAvailabilityMonth(subMonths(availabilityMonth, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAvailabilityMonth(addMonths(availabilityMonth, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {format(availabilityMonth, 'MMMM yyyy')} - Click dates to view bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={availabilityMonth}
                onMonthChange={setAvailabilityMonth}
                className="rounded-md border-0 w-full"
                classNames={{
                  months: "flex w-full flex-col",
                  month: "space-y-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-8",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground font-medium"
                }}
              />
              
              {/* Selected Date Details */}
              {selectedDate && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-sm text-gray-900 mb-3">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </h4>
                  {getBookingsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getBookingsForDate(selectedDate).map((booking, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-blue-100">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-blue-500" />
                            <span className="text-xs font-medium">{booking.time}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-gray-900">{booking.candidate}</p>
                            <p className="text-xs text-gray-600">{booking.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <CalendarIcon className="h-6 w-6 text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">No bookings for this date</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timezone Info */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium text-gray-900">Current Timezone</p>
                <p className="text-lg font-bold text-blue-600">GMT+1</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySettings;