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
    <div className="min-h-screen bg-gray-50">
      {/* Top banner */}
      <div className="bg-slate-700 text-white px-6 py-3 text-right">
        <span className="text-sm font-medium">Powered by Calendly</span>
      </div>

      {/* Main Content */}
      <div className="flex justify-center py-8 px-4">
        <div className="w-full max-w-7xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              
              {/* Left Sidebar */}
              <div className="lg:w-2/5 p-8 border-r border-gray-200 bg-white">
                {showForm && (
                  <Button 
                    variant="ghost" 
                    onClick={handleBack}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto mb-6 hover:bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                
                <div className="flex items-start space-x-4 mb-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">AI</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Zain Mirza</p>
                    <h1 className="text-2xl font-bold text-gray-900">Anthropic 1:1</h1>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">20 min</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Video className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-gray-700 text-sm">Web conferencing details provided upon confirmation.</span>
                  </div>
                </div>

                {showForm && selectedDate && selectedTime && (
                  <div className="space-y-3 mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-gray-700 text-sm font-medium">
                        {selectedTime} - {selectedTime === '3:00pm' ? '3:20pm' : selectedTime === '3:30pm' ? '3:50pm' : selectedTime === '4:30pm' ? '4:50pm' : '5:20pm'}, {formatSelectedDate()}, 2025
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 text-sm">Pakistan, Maldives Time</span>
                    </div>
                  </div>
                )}

                <div className="text-gray-700 mb-8">
                  <p className="mb-6 leading-relaxed">Open invite to chat about all things AI, Claude, and campus innovation.</p>
                  <p className="font-semibold mb-3 text-gray-900">Book a 1:1 call to discuss:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Bringing Claude to your university
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Event sponsorships or hackathons
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Becoming a Claude Campus Ambassador
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      Edtech & AI product ideas
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      API credits for student builders
                    </li>
                    <li className="flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      How to get involved as a non-technical
                    </li>
                  </ul>
                </div>

                {/* Footer links */}
                <div className="flex space-x-6 text-sm text-blue-600 mt-auto pt-8">
                  <button className="hover:underline">Cookie settings</button>
                  <button className="hover:underline">Report abuse</button>
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:w-3/5 p-8 bg-white">
                {!showForm ? (
                  <div className="h-full flex flex-col">
                    {/* Calendar Header */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Select a Date & Time</h2>
                      
                      {/* Month Navigation */}
                      <div className="flex items-center justify-between mb-6">
                        <button 
                          onClick={() => navigateMonth('prev')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h3 className="text-lg font-semibold text-blue-600">
                          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </h3>
                        <button 
                          onClick={() => navigateMonth('next')}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="mb-6">
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {daysOfWeek.map(day => (
                            <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-blue-600">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {days.map((day, index) => (
                            <button
                              key={index}
                              onClick={() => day && handleDateSelect(day)}
                              disabled={!day || unavailableDates.includes(day)}
                              className={`h-12 flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
                                !day 
                                  ? '' 
                                  : unavailableDates.includes(day)
                                  ? 'text-gray-300 cursor-not-allowed hover:bg-gray-50'
                                  : selectedDate?.getDate() === day
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : day === 30
                                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Timezone */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <Globe className="w-4 h-4" />
                        <span>Time zone</span>
                        <select className="text-gray-800 bg-transparent border-none focus:outline-none font-medium">
                          <option>Pakistan, Maldives Time (5:18pm)</option>
                        </select>
                      </div>
                    </div>

                    {/* Time Slots or Date Info */}
                    <div className="flex-1">
                      {selectedDate ? (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-6 text-lg">{formatSelectedDate()}</h3>
                          {selectedDate.getDate() === 30 ? (
                            <div className="space-y-3">
                              {availableTimes.map(time => (
                                <button
                                  key={time}
                                  onClick={() => handleTimeSelect(time)}
                                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                                    selectedTime === time
                                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                                      : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  <span className="font-medium">{time}</span>
                                </button>
                              ))}
                              {selectedTime && (
                                <div className="pt-4">
                                  <Button 
                                    onClick={handleNext}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                                  >
                                    Next
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="font-semibold text-gray-700 mb-2">No times available {formatSelectedDate()}</p>
                              <p className="text-sm text-gray-500">Please select another date</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          Please select a date to see available times
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Form */
                  <div className="h-full flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">Enter Details</h2>
                    
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <Input
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <Input
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Is there anything specific you want to arrange in meeting?
                        </label>
                        <Textarea
                          value={formData.meetingNotes}
                          onChange={(e) => setFormData({...formData, meetingNotes: e.target.value})}
                          className="w-full h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                          placeholder="Optional"
                        />
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => setFormData({...formData, agreedToTerms: checked as boolean})}
                          className="mt-1"
                        />
                        <label className="text-sm text-gray-600 leading-relaxed">
                          By proceeding, you confirm that you have read and agree to{' '}
                          <a href="#" className="text-blue-600 hover:underline">Calendly's Terms of Use</a> and{' '}
                          <a href="#" className="text-blue-600 hover:underline">Privacy Notice</a>.
                        </label>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={handleSubmit}
                          disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.agreedToTerms}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Schedule Event
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;