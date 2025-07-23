import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Video, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const SchedulePage = () => {
  const { resumeId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    meetingNotes: '',
    agreedToTerms: false
  });

  // Dummy data
  const availableTimes = ['3:00pm', '3:30pm', '4:30pm', '5:00pm'];
  const unavailableDates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31];

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateSelect = (day: number) => {
    if (unavailableDates.includes(day)) return;
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedTime(null);
    setShowForm(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedTime) {
      setShowForm(true);
    }
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDate.toLocaleDateString('en-US', options);
  };

  const handleSubmit = () => {
    console.log('Scheduling meeting:', {
      resumeId,
      date: selectedDate,
      time: selectedTime,
      ...formData
    });
    // Handle form submission
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-background">
      {/* Top banner */}
      <div className="bg-slate-700 text-white px-4 py-2 text-right">
        <span className="text-sm">Powered by Calendly</span>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {showForm && (
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">AI</span>
              </div>
              <div>
                <h2 className="text-gray-600 text-sm">Zain Mirza</h2>
                <h1 className="text-2xl font-bold text-gray-900">Anthropic 1:1</h1>
              </div>
            </div>

            <div className="space-y-3 text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">20 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span className="text-sm">Web conferencing details provided upon confirmation.</span>
              </div>
            </div>

            {showForm && selectedDate && selectedTime && (
              <div className="space-y-3 text-gray-600 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span>{selectedTime} - {selectedTime === '3:00pm' ? '3:20pm' : selectedTime === '3:30pm' ? '3:50pm' : selectedTime === '4:30pm' ? '4:50pm' : '5:20pm'}, {formatSelectedDate()}, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Pakistan, Maldives Time</span>
                </div>
              </div>
            )}

            <div className="text-gray-700">
              <p className="mb-4">Open invite to chat about all things AI, Claude, and campus innovation.</p>
              <p className="font-medium mb-2">Book a 1:1 call to discuss:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Bringing Claude to your university</li>
                <li>Event sponsorships or hackathons</li>
                <li>Becoming a Claude Campus Ambassador</li>
                <li>Edtech & AI product ideas</li>
                <li>API credits for student builders</li>
                <li>How to get involved as a non-technical</li>
              </ul>
            </div>

            {/* Footer links */}
            <div className="flex space-x-6 text-sm text-blue-600 pt-8">
              <button className="hover:underline">Cookie settings</button>
              <button className="hover:underline">Report abuse</button>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            {!showForm ? (
              <>
                {/* Calendar Header */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Date & Time</h2>
                  
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h3 className="text-lg font-medium text-blue-600">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button 
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {daysOfWeek.map(day => (
                      <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-blue-600">
                        {day}
                      </div>
                    ))}
                    {days.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && handleDateSelect(day)}
                        disabled={!day || unavailableDates.includes(day)}
                        className={`h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
                          !day 
                            ? '' 
                            : unavailableDates.includes(day)
                            ? 'text-gray-300 cursor-not-allowed'
                            : selectedDate?.getDate() === day
                            ? 'bg-blue-600 text-white'
                            : day === 30
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Timezone */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                    <Globe className="w-4 h-4" />
                    <span>Time zone</span>
                    <select className="text-gray-800 bg-transparent border-none focus:outline-none">
                      <option>Pakistan, Maldives Time (5:18pm)</option>
                    </select>
                  </div>
                </div>

                {/* Time Slots or Date Info */}
                <div className="border-l-4 border-gray-100 pl-6">
                  {selectedDate ? (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">{formatSelectedDate()}</h3>
                      {selectedDate.getDate() === 30 ? (
                        <div className="space-y-2">
                          {availableTimes.map(time => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                                selectedTime === time
                                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-blue-300 text-gray-700'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                          {selectedTime && (
                            <Button 
                              onClick={handleNext}
                              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Next
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600">
                          <p className="font-medium">No times available {formatSelectedDate()}</p>
                          <p className="text-sm">Please select another date</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      Please select a date to see available times
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Form */
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Enter Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Is there anything specific you want to arrange in meeting?
                  </label>
                  <Textarea
                    value={formData.meetingNotes}
                    onChange={(e) => setFormData({...formData, meetingNotes: e.target.value})}
                    className="w-full h-24"
                    placeholder="Optional"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked as boolean})}
                  />
                  <label className="text-sm text-gray-600">
                    By proceeding, you confirm that you have read and agree to{' '}
                    <a href="#" className="text-blue-600 hover:underline">Calendly's Terms of Use</a> and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
                  </label>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.agreedToTerms}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Schedule Event
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;