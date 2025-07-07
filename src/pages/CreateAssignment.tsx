
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Clock, Users, Code, Video, MessageSquare, FileText, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentConfig {
  // Basic settings
  title: string;
  description: string;
  timeLimit: string;
  passingScore: string;
  instructions: string;
  
  // AI Assistant
  useAI: boolean;
  aiPrompt: string;
  
  // Type-specific settings
  typeSpecific: Record<string, any>;
}

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [config, setConfig] = useState<AssessmentConfig>({
    title: '',
    description: '',
    timeLimit: '',
    passingScore: '',
    instructions: '',
    useAI: false,
    aiPrompt: '',
    typeSpecific: {}
  });

  const assessmentTypes = [
    {
      id: 'quiz',
      title: 'Quiz Assessment',
      description: 'Auto-generated questions based on job requirements',
      icon: Brain,
      features: ['Multiple choice questions', 'Auto-scoring', 'Instant results'],
      color: 'bg-blue-500',
      status: 'Available'
    },
    {
      id: 'video',
      title: 'Video Assessment',
      description: 'Record responses to interview prompts',
      icon: Video,
      features: ['Video recording', 'AI analysis', 'Behavioral insights'],
      color: 'bg-purple-500',
      status: 'Available'
    },
    {
      id: 'interview',
      title: 'Interview Simulation',
      description: 'AI-powered mock interview sessions',
      icon: MessageSquare,
      features: ['Real-time conversation', 'Dynamic questions', 'Performance metrics'],
      color: 'bg-green-500',
      status: 'Available'
    },
    {
      id: 'takehome',
      title: 'Take-Home Test',
      description: 'Project-based assignments and submissions',
      icon: FileText,
      features: ['File uploads', 'Project review', 'Code analysis'],
      color: 'bg-orange-500',
      status: 'Available'
    },
    {
      id: 'situational',
      title: 'Situational Judgment',
      description: 'Scenario-based decision making tests',
      icon: Target,
      features: ['Real scenarios', 'Decision analysis', 'Leadership assessment'],
      color: 'bg-red-500',
      status: 'Available'
    },
    {
      id: 'coding',
      title: 'Coding Challenge',
      description: 'Technical programming assessments',
      icon: Code,
      features: ['Live coding', 'Multiple languages', 'Performance tracking'],
      color: 'bg-indigo-500',
      status: 'Available'
    }
  ];

  // Scroll to top when selectedType changes
  useEffect(() => {
    if (selectedType) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedType]);

  const updateConfig = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateTypeSpecific = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      typeSpecific: {
        ...prev.typeSpecific,
        [field]: value
      }
    }));
  };

  const isFormValid = () => {
    return config.title && config.description && config.timeLimit && config.passingScore;
  };

  const handleGenerate = () => {
    const selectedAssessment = assessmentTypes.find(type => type.id === selectedType);
    const generationData = {
      assessmentType: selectedType,
      assessmentTitle: selectedAssessment?.title,
      basicConfig: {
        title: config.title,
        description: config.description,
        timeLimit: config.timeLimit,
        passingScore: config.passingScore,
        instructions: config.instructions
      },
      aiAssistant: {
        enabled: config.useAI,
        prompt: config.aiPrompt
      },
      typeSpecificConfig: config.typeSpecific
    };

    console.log('AI Generation Data:', JSON.stringify(generationData, null, 2));
    
    // Simulate AI generation
    console.log('🤖 AI is generating the assessment...');
    setTimeout(() => {
      console.log('✅ Assessment generated successfully!');
    }, 2000);
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4 hover:bg-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Assessment</h1>
            <p className="text-lg text-gray-600">Choose the type of assessment you want to create</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card 
                  key={type.id} 
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-300 bg-white/80 backdrop-blur-sm"
                  onClick={() => setSelectedType(type.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant={type.status === 'Available' ? 'default' : 'secondary'}>
                        {type.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">{type.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedAssessment = assessmentTypes.find(type => type.id === selectedType);
  const Icon = selectedAssessment?.icon || Brain;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedType(null)}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment Types
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-xl ${selectedAssessment?.color} flex items-center justify-center shadow-lg`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedAssessment?.title}</h1>
              <p className="text-lg text-gray-600">{selectedAssessment?.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Assistant Configuration */}
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-purple-600" />
                AI Assistant Configuration (Optional)
              </CardTitle>
              <CardDescription>
                Let AI help generate content and provide insights for your assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useAI" 
                  checked={config.useAI}
                  onCheckedChange={(checked) => updateConfig('useAI', checked)}
                />
                <Label htmlFor="useAI" className="font-medium">Enable AI Assistant</Label>
              </div>
              
              {config.useAI && (
                <div className="space-y-2 pl-6 border-l-2 border-purple-200">
                  <Label htmlFor="aiPrompt" className="text-sm font-medium">AI Instructions</Label>
                  <Textarea 
                    id="aiPrompt"
                    placeholder="Provide specific instructions for the AI to help generate assessment content..."
                    value={config.aiPrompt}
                    onChange={(e) => updateConfig('aiPrompt', e.target.value)}
                    className="min-h-[80px] bg-white/80"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Configuration */}
          <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-blue-600" />
                Basic Configuration
              </CardTitle>
              <CardDescription>
                Set up the fundamental details for your assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">Assessment Title *</Label>
                  <Input 
                    id="title"
                    placeholder="Enter assessment title"
                    value={config.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                    className="bg-white/80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeLimit" className="text-sm font-medium">Time Limit (minutes) *</Label>
                  <Input 
                    id="timeLimit"
                    type="number"
                    placeholder="60"
                    value={config.timeLimit}
                    onChange={(e) => updateConfig('timeLimit', e.target.value)}
                    className="bg-white/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe what this assessment evaluates..."
                  value={config.description}
                  onChange={(e) => updateConfig('description', e.target.value)}
                  className="min-h-[100px] bg-white/80"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passingScore" className="text-sm font-medium">Passing Score (%) *</Label>
                  <Input 
                    id="passingScore"
                    type="number"
                    placeholder="70"
                    value={config.passingScore}
                    onChange={(e) => updateConfig('passingScore', e.target.value)}
                    className="bg-white/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions" className="text-sm font-medium">Instructions for Candidates</Label>
                <Textarea 
                  id="instructions"
                  placeholder="Provide clear instructions for candidates..."
                  value={config.instructions}
                  onChange={(e) => updateConfig('instructions', e.target.value)}
                  className="min-h-[100px] bg-white/80"
                />
              </div>
            </CardContent>
          </Card>

          {/* Type-Specific Configuration */}
          {selectedType === 'quiz' && (
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-green-600" />
                  Quiz Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Number of Questions</Label>
                    <Input 
                      type="number"
                      placeholder="10"
                      value={config.typeSpecific.questionCount || ''}
                      onChange={(e) => updateTypeSpecific('questionCount', e.target.value)}
                      className="bg-white/80"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <Select value={config.typeSpecific.difficulty || ''} onValueChange={(value) => updateTypeSpecific('difficulty', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="randomize" 
                      checked={config.typeSpecific.randomizeQuestions || false}
                      onCheckedChange={(checked) => updateTypeSpecific('randomizeQuestions', checked)}
                    />
                    <Label htmlFor="randomize" className="font-medium">Randomize Question Order</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showProgress" 
                      checked={config.typeSpecific.showProgress || false}
                      onCheckedChange={(checked) => updateTypeSpecific('showProgress', checked)}
                    />
                    <Label htmlFor="showProgress" className="font-medium">Show Progress Bar</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedType === 'video' && (
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-purple-600" />
                  Video Assessment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Interview Questions</Label>
                  <Textarea 
                    placeholder="Enter questions for candidates to answer (one per line)"
                    value={config.typeSpecific.questions || ''}
                    onChange={(e) => updateTypeSpecific('questions', e.target.value)}
                    className="min-h-[120px] bg-white/80"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Video Quality</Label>
                    <Select value={config.typeSpecific.videoQuality || ''} onValueChange={(value) => updateTypeSpecific('videoQuality', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p HD</SelectItem>
                        <SelectItem value="1080p">1080p Full HD</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedType === 'interview' && (
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  Interview Simulation Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Interview Topics</Label>
                  <Textarea 
                    placeholder="Enter topics or areas to focus on during the simulation"
                    value={config.typeSpecific.topics || ''}
                    onChange={(e) => updateTypeSpecific('topics', e.target.value)}
                    className="min-h-[100px] bg-white/80"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Interview Style</Label>
                    <Select value={config.typeSpecific.interviewStyle || ''} onValueChange={(value) => updateTypeSpecific('interviewStyle', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="situational">Situational</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Difficulty Progression</Label>
                    <Select value={config.typeSpecific.progression || ''} onValueChange={(value) => updateTypeSpecific('progression', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select progression" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy-to-hard">Easy to Hard</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                        <SelectItem value="consistent">Consistent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedType === 'takehome' && (
            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-orange-600" />
                  Take-Home Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Project Description</Label>
                  <Textarea 
                    placeholder="Describe the project or task candidates need to complete"
                    value={config.typeSpecific.projectDescription || ''}
                    onChange={(e) => updateTypeSpecific('projectDescription', e.target.value)}
                    className="min-h-[120px] bg-white/80"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Submission Requirements</Label>
                  <Textarea 
                    placeholder="Specify what candidates should submit (files, formats, etc.)"
                    value={config.typeSpecific.requirements || ''}
                    onChange={(e) => updateTypeSpecific('requirements', e.target.value)}
                    className="min-h-[100px] bg-white/80"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Maximum File Size (MB)</Label>
                    <Input 
                      type="number"
                      placeholder="50"
                      value={config.typeSpecific.maxFileSize || ''}
                      onChange={(e) => updateTypeSpecific('maxFileSize', e.target.value)}
                      className="bg-white/80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Allowed File Types</Label>
                    <Input 
                      placeholder="pdf, doc, zip, etc."
                      value={config.typeSpecific.allowedTypes || ''}
                      onChange={(e) => updateTypeSpecific('allowedTypes', e.target.value)}
                      className="bg-white/80"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="plagiarismCheck" 
                      checked={config.typeSpecific.plagiarismCheck || false}
                      onCheckedChange={(checked) => updateTypeSpecific('plagiarismCheck', checked)}
                    />
                    <Label htmlFor="plagiarismCheck" className="font-medium">Enable Plagiarism Check</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="codeReview" 
                      checked={config.typeSpecific.codeReview || false}
                      onCheckedChange={(checked) => updateTypeSpecific('codeReview', checked)}
                    />
                    <Label htmlFor="codeReview" className="font-medium">Automated Code Review</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedType === 'situational' && (
            <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-red-600" />
                  Situational Judgment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Scenarios</Label>
                  <Textarea 
                    placeholder="Describe workplace scenarios candidates will need to navigate"
                    value={config.typeSpecific.scenarios || ''}
                    onChange={(e) => updateTypeSpecific('scenarios', e.target.value)}
                    className="min-h-[120px] bg-white/80"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Number of Scenarios</Label>
                    <Input 
                      type="number"
                      placeholder="5"
                      value={config.typeSpecific.scenarioCount || ''}
                      onChange={(e) => updateTypeSpecific('scenarioCount', e.target.value)}
                      className="bg-white/80"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Response Format</Label>
                    <Select value={config.typeSpecific.responseFormat || ''} onValueChange={(value) => updateTypeSpecific('responseFormat', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="ranking">Ranking</SelectItem>
                        <SelectItem value="text-response">Text Response</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="timedScenarios" 
                      checked={config.typeSpecific.timedScenarios || false}
                      onCheckedChange={(checked) => updateTypeSpecific('timedScenarios', checked)}
                    />
                    <Label htmlFor="timedScenarios" className="font-medium">Timed Scenarios</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="feedbackEnabled" 
                      checked={config.typeSpecific.feedbackEnabled || false}
                      onCheckedChange={(checked) => updateTypeSpecific('feedbackEnabled', checked)}
                    />
                    <Label htmlFor="feedbackEnabled" className="font-medium">Provide Immediate Feedback</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedType === 'coding' && (
            <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Code className="h-6 w-6 text-indigo-600" />
                  Coding Challenge Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Problem Statement</Label>
                  <Textarea 
                    placeholder="Describe the coding problem candidates need to solve"
                    value={config.typeSpecific.problemStatement || ''}
                    onChange={(e) => updateTypeSpecific('problemStatement', e.target.value)}
                    className="min-h-[120px] bg-white/80"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Programming Languages</Label>
                    <Select value={config.typeSpecific.languages || ''} onValueChange={(value) => updateTypeSpecific('languages', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="multiple">Multiple Languages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <Select value={config.typeSpecific.codingDifficulty || ''} onValueChange={(value) => updateTypeSpecific('codingDifficulty', value)}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Test Cases</Label>
                  <Textarea 
                    placeholder="Define test cases for the coding problem"
                    value={config.typeSpecific.testCases || ''}
                    onChange={(e) => updateTypeSpecific('testCases', e.target.value)}
                    className="min-h-[100px] bg-white/80"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="autoGrading" 
                      checked={config.typeSpecific.autoGrading || false}
                      onCheckedChange={(checked) => updateTypeSpecific('autoGrading', checked)}
                    />
                    <Label htmlFor="autoGrading" className="font-medium">Automatic Grading</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="codePlayback" 
                      checked={config.typeSpecific.codePlayback || false}
                      onCheckedChange={(checked) => updateTypeSpecific('codePlayback', checked)}
                    />
                    <Label htmlFor="codePlayback" className="font-medium">Code Playback Recording</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generate Assessment Button */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <Button 
                  onClick={handleGenerate}
                  disabled={!isFormValid()}
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Generate Assessment
                </Button>
                <p className="text-sm text-gray-600 mt-3">
                  {!isFormValid() ? 'Please fill in all required fields to continue' : 'Ready to generate your assessment'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
