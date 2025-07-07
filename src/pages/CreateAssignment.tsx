import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Clock, Users, Code, Video, MessageSquare, FileText, Target, Zap, Wand2, Plus, Trash2, Edit } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: string;
}

interface GeneratedAssignment {
  title: string;
  description: string;
  difficulty_level: string;
  instructions: string;
  passed_instructions: string;
  passing_score: number;
  time_limit: number;
  questions: GeneratedQuestion[];
}

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
  creationMode: 'manual' | 'ai-assisted';
  difficultyLevel: string;
  
  // Type-specific settings
  typeSpecific: Record<string, any>;
  
  // Manual questions for quiz
  questions: Question[];
  numberOfQuestions: number;
}

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resume_id');
  const isEditMode = searchParams.get('edit') === 'true';
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAssignment, setGeneratedAssignment] = useState<GeneratedAssignment | null>(null);
  const [editableQuestions, setEditableQuestions] = useState<Question[]>([]);
  const [config, setConfig] = useState<AssessmentConfig>({
    title: '',
    description: '',
    timeLimit: '',
    passingScore: '',
    instructions: '',
    useAI: false,
    aiPrompt: '',
    creationMode: 'manual',
    difficultyLevel: '',
    typeSpecific: {},
    questions: [],
    numberOfQuestions: 0
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
      status: 'Upcoming'
    },
    {
      id: 'interview',
      title: 'Interview Simulation',
      description: 'AI-powered mock interview sessions',
      icon: MessageSquare,
      features: ['Real-time conversation', 'Dynamic questions', 'Performance metrics'],
      color: 'bg-green-500',
      status: 'Upcoming'
    },
    {
      id: 'takehome',
      title: 'Take-Home Test',
      description: 'Project-based assignments and submissions',
      icon: FileText,
      features: ['File uploads', 'Project review', 'Code analysis'],
      color: 'bg-orange-500',
      status: 'Upcoming'
    },
    {
      id: 'situational',
      title: 'Situational Judgment',
      description: 'Scenario-based decision making tests',
      icon: Target,
      features: ['Real scenarios', 'Decision analysis', 'Leadership assessment'],
      color: 'bg-red-500',
      status: 'Upcoming'
    },
    {
      id: 'coding',
      title: 'Coding Challenge',
      description: 'Technical programming assessments',
      icon: Code,
      features: ['Live coding', 'Multiple languages', 'Performance tracking'],
      color: 'bg-indigo-500',
      status: 'Upcoming'
    }
  ];

  // Scroll to top when selectedType changes
  useEffect(() => {
    if (selectedType) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedType]);

  // Load existing assignment if in edit mode
  useEffect(() => {
    const loadExistingAssignment = async () => {
      if (isEditMode && resumeId) {
        setIsLoading(true);
        try {
          const response = await fetch(`https://talo-recruitment.vercel.app/assignments/${resumeId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            
            // Handle both API response formats
            let template;
            if (data.candidates && data.candidates.length > 0) {
              // New API format with candidates array
              template = data.candidates[0].assignment_template[0];
            } else if (data.assignment_template && data.assignment_template.length > 0) {
              // Old API format
              template = data.assignment_template[0];
            }
            
            if (template) {
              // Set the assessment type
              setSelectedType('quiz');
              
              // Populate config with existing data
              setConfig(prev => ({
                ...prev,
                title: template.title || template.assessmentTitle || '',
                description: template.description || '',
                timeLimit: template.time_limit?.toString() || '',
                passingScore: template.passing_score?.toString() || '',
                instructions: template.instructions || '',
                creationMode: template.creationMode || 'ai-assisted',
                difficultyLevel: template.difficulty_level || '',
                questions: template.questions ? [] : prev.questions,
                numberOfQuestions: template.questions?.length || 0
              }));

              // If there's a generated assignment structure, set it
              if (template.questions) {
                setGeneratedAssignment(template);
                
                // Convert generated questions to editable format
                const editableQs = template.questions.map((q: GeneratedQuestion, index: number) => ({
                  id: `existing-${index}`,
                  question: q.question,
                  type: 'multiple-choice' as const,
                  options: q.options,
                  correctAnswer: q.options.findIndex((opt: string) => opt === q.correct_answer)
                }));
                setEditableQuestions(editableQs);
              }
            }
          }
        } catch (error) {
          console.error('Error loading existing assignment:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingAssignment();
  }, [isEditMode, resumeId]);

  // Functions to handle editable questions for AI-generated content
  const updateEditableQuestion = (id: string, field: string, value: any) => {
    setEditableQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, [field]: value } : q)
    );
  };

  const updateEditableQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setEditableQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    );
  };

  const deleteEditableQuestion = (id: string) => {
    setEditableQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addEditableQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setEditableQuestions(prev => [...prev, newQuestion]);
  };

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

  // Question management functions
  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setConfig(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const deleteQuestion = (id: string) => {
    setConfig(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const isFormValid = () => {
    // For AI-assisted mode, check if we have generated assignment
    if (config.creationMode === 'ai-assisted') {
      return generatedAssignment !== null;
    }
    
    // For manual mode, require basic fields and questions
    const basicValid = config.title && config.description && config.timeLimit && config.passingScore;
    if (selectedType === 'quiz' && config.creationMode === 'manual') {
      return basicValid && config.questions.length > 0 && config.questions.every(q => 
        q.question.trim() && 
        (q.type !== 'multiple-choice' || (q.options && q.options.every(opt => opt.trim())))
      );
    }
    return basicValid;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Call generate API
      const generateResponse = await fetch('https://talo-recruitment.vercel.app/assignment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resumeId || "95f2f83a-8a8f-4fb8-b2bb-66226ea592ef",
          difficulty_level: config.difficultyLevel || "mixed",
          instructions: config.aiPrompt || "Generate assessment questions"
        })
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate assessment');
      }

      const generateData = await generateResponse.json();
      console.log('=== AI GENERATED ASSESSMENT ===');
      console.log(JSON.stringify(generateData, null, 2));
      console.log('=== END AI GENERATED ASSESSMENT ===');

      // Store the generated assignment
      setGeneratedAssignment(generateData.assignment);
      
      // Convert generated questions to editable format
      const editableQs = generateData.assignment.questions.map((q: GeneratedQuestion, index: number) => ({
        id: `generated-${Date.now()}-${index}`,
        question: q.question,
        type: 'multiple-choice' as const,
        options: q.options,
        correctAnswer: q.options.findIndex((opt: string) => opt === q.correct_answer)
      }));
      setEditableQuestions(editableQs);
      
      console.log('✅ Assessment generated successfully with AI assistance!');
      
    } catch (error) {
      console.error('Error generating assessment:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAssessment = async () => {
    try {
      let assessmentData;

      if (config.creationMode === 'ai-assisted' && generatedAssignment) {
        // Use edited questions from AI generation
        const updatedQuestions = editableQuestions.map(q => ({
          question: q.question,
          options: q.options,
          correct_answer: q.options ? q.options[q.correctAnswer as number] : '',
          difficulty: 'mixed'
        }));

        assessmentData = {
          assessmentType: selectedType,
          assessmentTitle: generatedAssignment.title,
          creationMode: config.creationMode,
          ...generatedAssignment,
          questions: updatedQuestions
        };
      } else {
        // Manual creation
        const selectedAssessment = assessmentTypes.find(type => type.id === selectedType);
        assessmentData = {
          assessmentType: selectedType,
          assessmentTitle: selectedAssessment?.title,
          creationMode: config.creationMode,
          basicConfig: {
            title: config.title,
            description: config.description,
            timeLimit: config.timeLimit,
            passingScore: config.passingScore,
            instructions: config.instructions
          },
          typeSpecificConfig: config.typeSpecific,
          questions: config.questions,
          totalQuestions: config.questions.length,
          timestamp: new Date().toISOString()
        };
      }

      const url = isEditMode 
        ? `https://talo-recruitment.vercel.app/assignments/${resumeId}`
        : 'https://talo-recruitment.vercel.app/assessments/create';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const createResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(isEditMode ? assessmentData : {
          resume_id: resumeId || "95f2f83a-8a8f-4fb8-b2bb-66226ea592ef",
          details: assessmentData
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} assessment`);
      }

      const createData = await createResponse.json();
      console.log(`=== ASSESSMENT ${isEditMode ? 'UPDATED' : 'CREATED'} ===`);
      console.log(JSON.stringify(createData, null, 2));
      console.log(`=== END ASSESSMENT ${isEditMode ? 'UPDATED' : 'CREATED'} ===`);

      console.log(`✅ Assessment ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      // Navigate to assessments page
      navigate('/dashboard/assessments');
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} assessment:`, error);
    }
  };

  const handleAssessmentTypeClick = (typeId: string) => {
    const selectedAssessment = assessmentTypes.find(type => type.id === typeId);
    if (selectedAssessment?.status === 'Upcoming') {
      console.log(`${selectedAssessment.title} is coming soon!`);
      return;
    }
    setSelectedType(typeId);
  };

  const generateEmptyQuestions = (count: number) => {
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        id: `${Date.now()}-${i}`,
        question: '',
        type: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: 0
      });
    }
    setConfig(prev => ({ ...prev, questions }));
  };

  // Show loading screen while loading existing assignment in edit mode
  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading assignment data...</p>
        </div>
      </div>
    );
  }

  // For edit mode, skip type selection if we have loaded data
  if (!selectedType && !isEditMode) {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Assessment</h1>
            <p className="text-lg text-gray-600">Choose the type of assessment you want to create</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTypes.map((type) => {
              const Icon = type.icon;
              const isUpcoming = type.status === 'Upcoming';
              return (
                <Card 
                  key={type.id} 
                  className={`transition-all duration-300 border-2 bg-white/80 backdrop-blur-sm ${
                    isUpcoming 
                      ? 'opacity-75 cursor-not-allowed border-gray-200' 
                      : 'cursor-pointer hover:shadow-xl hover:scale-105 hover:border-blue-300'
                  }`}
                  onClick={() => handleAssessmentTypeClick(type.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center mb-4 ${isUpcoming ? 'opacity-75' : ''}`}>
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
              <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit ' + selectedAssessment?.title : selectedAssessment?.title}</h1>
              <p className="text-lg text-gray-600">{selectedAssessment?.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* AI Assistant Configuration - Hide in edit mode */}
          {!isEditMode && (
            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                  Creation Mode & AI Assistant
                </CardTitle>
                <CardDescription>
                  Choose how you want to create your assessment - manually or with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Creation Mode</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${config.creationMode === 'manual' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'}`}
                    onClick={() => updateConfig('creationMode', 'manual')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.creationMode === 'manual' ? 'bg-purple-500' : 'bg-gray-300'}`}>
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Manual Creation</h3>
                          <p className="text-sm text-gray-600">Create assessment manually with full control</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${config.creationMode === 'ai-assisted' ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:bg-gray-50'}`}
                    onClick={() => updateConfig('creationMode', 'ai-assisted')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.creationMode === 'ai-assisted' ? 'bg-purple-500' : 'bg-gray-300'}`}>
                          <Wand2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">AI-Assisted</h3>
                          <p className="text-sm text-gray-600">Let AI help generate content and structure</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {config.creationMode === 'ai-assisted' && (
                <div className="space-y-6">
                  <div className="space-y-4 pl-6 border-l-2 border-purple-200 bg-white/50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Difficulty Level</Label>
                        <Select value={config.difficultyLevel} onValueChange={(value) => updateConfig('difficultyLevel', value)}>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="aiPrompt" className="text-sm font-medium">AI Instructions & Context</Label>
                      <Textarea 
                        id="aiPrompt"
                        placeholder="Provide specific instructions for the AI to help generate assessment content, target audience, difficulty level, specific topics to focus on, etc..."
                        value={config.aiPrompt}
                        onChange={(e) => updateConfig('aiPrompt', e.target.value)}
                        className="min-h-[100px] bg-white/80"
                      />
                      <p className="text-xs text-gray-500">
                        Example: "Create a mid-level software engineer assessment focusing on React, Node.js, and system design. Target 3-5 years experience."
                      </p>
                    </div>
                  </div>

                  {/* Generate Assessment Button for AI-Assisted Mode */}
                  <div className="text-center">
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Wand2 className="h-5 w-5 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </Button>
                    <p className="text-sm text-gray-600 mt-3">
                      {isGenerating ? 'AI is generating your assessment...' : 'AI will help generate your assessment'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          )}

          {/* Generated Assessment Preview - Now Editable */}
          {config.creationMode === 'ai-assisted' && generatedAssignment && (
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-green-600" />
                  Generated Assessment - Edit as Needed
                </CardTitle>
                <CardDescription>
                  Review and edit the AI-generated assessment details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Title</Label>
                    <div className="p-3 bg-white/80 rounded-md border">{generatedAssignment.title}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Time Limit</Label>
                    <div className="p-3 bg-white/80 rounded-md border">{generatedAssignment.time_limit} minutes</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description</Label>
                  <div className="p-3 bg-white/80 rounded-md border">{generatedAssignment.description}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Passing Score</Label>
                    <div className="p-3 bg-white/80 rounded-md border">{generatedAssignment.passing_score}%</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <div className="p-3 bg-white/80 rounded-md border capitalize">{generatedAssignment.difficulty_level}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Questions ({editableQuestions.length})</h3>
                    <Button onClick={addEditableQuestion} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  {editableQuestions.map((question, index) => (
                    <Card key={question.id} className="border border-green-200 bg-white/90">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteEditableQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Question</Label>
                          <Textarea 
                            placeholder="Enter your question here..."
                            value={question.question}
                            onChange={(e) => updateEditableQuestion(question.id, 'question', e.target.value)}
                            className="bg-white"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Options</Label>
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <input 
                                type="radio" 
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => updateEditableQuestion(question.id, 'correctAnswer', optionIndex)}
                                className="text-green-600"
                              />
                              <Input 
                                placeholder={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => updateEditableQuestionOption(question.id, optionIndex, e.target.value)}
                                className="bg-white"
                              />
                            </div>
                          ))}
                          <p className="text-xs text-gray-500">Select the radio button next to the correct answer</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Basic Configuration - only show for manual mode */}
          {config.creationMode === 'manual' && (
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
          )}

          {/* Quiz-Specific Configuration - only show for manual mode */}
          {selectedType === 'quiz' && config.creationMode === 'manual' && (
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
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Number of Questions</Label>
                    <Input 
                      type="number"
                      placeholder="0"
                      value={config.numberOfQuestions}
                      onChange={(e) => {
                        const count = parseInt(e.target.value) || 0;
                        updateConfig('numberOfQuestions', count);
                        if (count > 0 && count !== config.questions.length) {
                          generateEmptyQuestions(count);
                        }
                      }}
                      className="bg-white/80"
                    />
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

                {/* Manual Question Creation */}
                {config.numberOfQuestions > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Questions ({config.questions.length}/{config.numberOfQuestions})</h3>
                    </div>

                    {config.questions.map((question, index) => (
                      <Card key={question.id} className="border border-green-200 bg-white/90">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Question {index + 1}</h4>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Question</Label>
                            <Textarea 
                              placeholder="Enter your question here..."
                              value={question.question}
                              onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                              className="bg-white"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Question Type</Label>
                            <Select 
                              value={question.type} 
                              onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="true-false">True/False</SelectItem>
                                <SelectItem value="short-answer">Short Answer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {question.type === 'multiple-choice' && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Options</Label>
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-3">
                                  <input 
                                    type="radio" 
                                    name={`correct-${question.id}`}
                                    checked={question.correctAnswer === optionIndex}
                                    onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                                    className="text-green-600"
                                  />
                                  <Input 
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={option}
                                    onChange={(e) => updateQuestionOption(question.id, optionIndex, e.target.value)}
                                    className="bg-white"
                                  />
                                </div>
                              ))}
                              <p className="text-xs text-gray-500">Select the radio button next to the correct answer</p>
                            </div>
                          )}

                          {question.type === 'true-false' && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium">Correct Answer</Label>
                              <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name={`tf-${question.id}`}
                                    checked={question.correctAnswer === 'true'}
                                    onChange={() => updateQuestion(question.id, 'correctAnswer', 'true')}
                                    className="text-green-600"
                                  />
                                  <span>True</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="radio" 
                                    name={`tf-${question.id}`}
                                    checked={question.correctAnswer === 'false'}
                                    onChange={() => updateQuestion(question.id, 'correctAnswer', 'false')}
                                    className="text-green-600"
                                  />
                                  <span>False</span>
                                </label>
                              </div>
                            </div>
                          )}

                          {question.type === 'short-answer' && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Sample Answer (for reference)</Label>
                              <Textarea 
                                placeholder="Enter a sample correct answer..."
                                value={question.correctAnswer as string || ''}
                                onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                                className="bg-white"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {config.questions.length === 0 && (
                      <div className="text-center py-8 bg-white/50 rounded-lg border-2 border-dashed border-green-300">
                        <Brain className="h-12 w-12 text-green-400 mx-auto mb-3" />
                        <p className="text-gray-600">Set the number of questions above to get started.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Create Assessment Button - shown for both modes at the bottom */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                 <Button 
                   onClick={handleCreateAssessment}
                   disabled={!isFormValid()}
                   size="lg"
                   className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                 >
                   <Zap className="h-5 w-5 mr-2" />
                   {isEditMode ? 'Update Assignment' : 'Create Assessment'}
                 </Button>
                <p className="text-sm text-gray-600 mt-3">
                  {!isFormValid() 
                    ? config.creationMode === 'ai-assisted'
                      ? 'Please generate an assessment first to continue'
                      : selectedType === 'quiz' && config.creationMode === 'manual' 
                        ? 'Please fill in all required fields and add at least one complete question' 
                        : 'Please fill in all required fields to continue'
                    : 'Ready to create your assessment'
                  }
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
