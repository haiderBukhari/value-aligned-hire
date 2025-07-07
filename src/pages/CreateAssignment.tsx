import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, ArrowRight, CheckCircle, Sparkles, Clock, Users, Code, Video, MessageSquare, FileText, BarChart3, Zap, Plus, Trash2, Settings, Upload, Play, Mic, FileCode, Star, Target, Brain, Wand2, ChevronRight, Eye, Award, Timer, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const ASSESSMENT_TYPES = [
  {
    id: 'quiz',
    title: 'Quiz Assessment',
    description: 'Auto-generated questions based on job requirements',
    icon: CheckCircle,
    status: 'active',
    color: 'from-emerald-500 to-teal-500',
    features: ['Multiple choice questions', 'Auto-scoring', 'Instant results'],
    gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    iconBg: 'bg-emerald-500'
  },
  {
    id: 'video',
    title: 'Video Assessment',
    description: 'Record responses to interview prompts',
    icon: Video,
    status: 'active',
    color: 'from-blue-500 to-cyan-500',
    features: ['Video recording', 'AI analysis', 'Behavioral insights'],
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-500'
  },
  {
    id: 'interview',
    title: 'Interview Simulation',
    description: 'AI-powered mock interview sessions',
    icon: MessageSquare,
    status: 'active',
    color: 'from-purple-500 to-violet-500',
    features: ['Real-time conversation', 'Dynamic questions', 'Performance metrics'],
    gradient: 'bg-gradient-to-br from-purple-50 to-violet-50',
    iconBg: 'bg-purple-500'
  },
  {
    id: 'takeHome',
    title: 'Take-Home Test',
    description: 'Project-based assignments and submissions',
    icon: FileText,
    status: 'active',
    color: 'from-orange-500 to-red-500',
    features: ['File uploads', 'Project review', 'Code analysis'],
    gradient: 'bg-gradient-to-br from-orange-50 to-red-50',
    iconBg: 'bg-orange-500'
  },
  {
    id: 'situational',
    title: 'Situational Judgment',
    description: 'Scenario-based decision making tests',
    icon: BarChart3,
    status: 'active',
    color: 'from-pink-500 to-rose-500',
    features: ['Real scenarios', 'Decision analysis', 'Leadership assessment'],
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    iconBg: 'bg-pink-500'
  },
  {
    id: 'coding',
    title: 'Coding Challenge',
    description: 'Technical programming assessments',
    icon: Code,
    status: 'active',
    color: 'from-indigo-500 to-blue-500',
    features: ['Live coding', 'Multiple languages', 'Performance tracking'],
    gradient: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    iconBg: 'bg-indigo-500'
  }
];

const CreateAssignment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resume_id');
  const isEdit = searchParams.get('edit') === 'true';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);

  // Basic configuration
  const [basicConfig, setBasicConfig] = useState({
    title: "",
    description: "",
    duration: "30",
    deadline: "",
    instructions: "Please complete this assessment to the best of your ability."
  });

  // AI Configuration
  const [aiConfig, setAiConfig] = useState({
    useJobSpec: true,
    additionalContext: "",
    focusAreas: "",
    difficulty: "medium"
  });

  // Assessment-specific configurations
  const [quizConfig, setQuizConfig] = useState({
    numberOfQuestions: "10",
    difficulty: "medium",
    questionTypes: ["multiple_choice", "true_false"],
    categories: ["Technical Skills", "Problem Solving"],
    passingScore: "70",
    showCorrectAnswers: true,
    shuffleQuestions: true,
    allowRetakes: false
  });

  const [videoConfig, setVideoConfig] = useState({
    promptCategories: ["Behavioral", "Situational"],
    customPrompts: ["Tell me about a challenging project you worked on"],
    enablePracticeRound: true,
    allowReRecording: true
  });

  const [interviewConfig, setInterviewConfig] = useState({
    focusAreas: ["Communication", "Technical", "Leadership"],
    enableFollowUps: true,
    realTimeAnalysis: true,
    customScenarios: ["Describe how you handle conflict in a team"],
    voiceEnabled: true
  });

  const [takeHomeConfig, setTakeHomeConfig] = useState({
    submissionDeadline: "72",
    maxFileSize: "10",
    allowedFileTypes: [".pdf", ".doc", ".zip", ".js", ".py"],
    projectType: "coding",
    requirements: ["Create a functional web application", "Include documentation"],
    evaluationCriteria: ["Code Quality", "Problem Solving", "Documentation"],
    provideSampleCode: false,
    githubIntegration: true
  });

  const [situationalConfig, setSituationalConfig] = useState({
    numberOfScenarios: "5",
    scenarioComplexity: "medium",
    focusAreas: ["Leadership", "Decision Making", "Ethics"],
    responseFormat: "multiple_choice",
    customScenarios: ["How would you handle a team member missing deadlines?"],
    includeRealCases: true,
    timePerScenario: "10",
    videoResponse: false
  });

  const [codingConfig, setCodingConfig] = useState({
    programmingLanguages: ["JavaScript", "Python"],
    difficulty: "medium",
    numberOfProblems: "3",
    timeLimit: "90",
    problemTypes: ["Algorithm", "Data Structure"],
    customProblems: ["Implement a function to reverse a linked list"]
  });

  const [generatedContent, setGeneratedContent] = useState<any>(null);

  useEffect(() => {
    fetchJobDetails();
    if (isEdit && resumeId) {
      fetchExistingAssignment();
    }
  }, [jobId, isEdit, resumeId]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJobDetails(data.job);
        setBasicConfig(prev => ({
          ...prev,
          title: `${data.job?.title || 'Job'} Assessment`,
          description: `Assessment for ${data.job?.title || 'this position'} role`
        }));
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const fetchExistingAssignment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.assignment_template && data.assignment_template.length > 0) {
          const template = data.assignment_template[0];
          setBasicConfig({
            title: template.title || "",
            description: template.description || "",
            duration: template.duration || "30",
            deadline: template.deadline || "",
            instructions: template.instructions || ""
          });
          setGeneratedContent(template.questions || []);
          setSelectedAssessmentType('quiz');
          setCurrentStep(3);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch existing assignment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return selectedAssessmentType !== '';
    }
    if (currentStep === 2) {
      return basicConfig.title.trim() !== '' && basicConfig.description.trim() !== '';
    }
    return true;
  };

  const getCurrentConfig = () => {
    switch (selectedAssessmentType) {
      case 'quiz': return quizConfig;
      case 'video': return videoConfig;
      case 'interview': return interviewConfig;
      case 'takeHome': return takeHomeConfig;
      case 'situational': return situationalConfig;
      case 'coding': return codingConfig;
      default: return {};
    }
  };

  const generateAssessment = async () => {
    const currentConfig = getCurrentConfig();
    const aiPayload = {
      assessmentType: selectedAssessmentType,
      basicConfig,
      aiConfig,
      specificConfig: currentConfig,
      jobDetails,
      jobSpecification: jobDetails?.description || ''
    };

    console.log("AI Generation Payload:", JSON.stringify(aiPayload, null, 2));

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let mockContent;
      switch (selectedAssessmentType) {
        case 'quiz':
          mockContent = [
            {
              question: "What is the primary purpose of React hooks?",
              type: "multiple_choice",
              options: [
                "To replace class components entirely",
                "To allow state and lifecycle methods in functional components",
                "To improve performance only",
                "To handle routing in React applications"
              ],
              correctAnswer: 1,
              difficulty: "medium",
              category: "React"
            },
            {
              question: "Explain the difference between SQL and NoSQL databases.",
              type: "text",
              difficulty: "medium",
              category: "Database"
            }
          ];
          break;
        case 'video':
          mockContent = [
            {
              prompt: "Tell me about a challenging project you worked on and how you overcame obstacles.",
              category: "Behavioral",
              preparationTime: 120,
              maxDuration: 300
            },
            {
              prompt: "Describe your approach to working in a team environment.",
              category: "Team Collaboration",
              preparationTime: 120,
              maxDuration: 300
            }
          ];
          break;
        case 'interview':
          mockContent = [
            {
              question: "How do you prioritize tasks when facing multiple deadlines?",
              category: "Time Management",
              followUpEnabled: true,
              difficulty: "medium"
            }
          ];
          break;
        case 'takeHome':
          mockContent = {
            project: "Build a task management application",
            requirements: ["User authentication", "CRUD operations", "Responsive design"],
            submissionFormat: "GitHub repository link"
          };
          break;
        case 'situational':
          mockContent = [
            {
              scenario: "A team member consistently misses deadlines affecting project delivery.",
              options: ["Address privately first", "Escalate immediately", "Reassign tasks", "Set stricter deadlines"],
              correctAnswer: 0
            }
          ];
          break;
        case 'coding':
          mockContent = [
            {
              problem: "Implement a function to find the longest palindromic substring",
              difficulty: "medium",
              timeLimit: 30,
              testCases: ["raceacar -> raceacar", "hello -> ll"]
            }
          ];
          break;
        default:
          mockContent = { message: `${selectedAssessmentType} assessment generated successfully` };
      }

      setGeneratedContent(mockContent);
      setCurrentStep(3);
      
      toast({
        title: "Success",
        description: `${ASSESSMENT_TYPES.find(t => t.id === selectedAssessmentType)?.title} generated successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate assessment",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAssessment = async () => {
    if (!basicConfig.title.trim() || !generatedContent) {
      toast({
        title: "Error",
        description: "Please complete all required fields and generate content",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const assessmentDetails = {
        title: basicConfig.title,
        description: basicConfig.description,
        content: `<h2>Assessment Instructions</h2><p>${basicConfig.instructions}</p>`,
        duration: `${basicConfig.duration} minutes`,
        deadline: basicConfig.deadline,
        instructions: basicConfig.instructions,
        assessment_type: selectedAssessmentType,
        configuration: getCurrentConfig(),
        generated_content: generatedContent,
        auto_generated: true,
        job_spec_based: true
      };

      const url = isEdit 
        ? `${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}`
        : `${import.meta.env.VITE_BACKEND_URL}/assessments/create`;
      
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit 
        ? JSON.stringify({ details: assessmentDetails })
        : JSON.stringify({ resume_id: resumeId, details: assessmentDetails });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} assessment`);

      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message || `Assessment ${isEdit ? 'updated' : 'created and sent to candidate'}!`,
      });
      
      navigate(-1);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} assessment`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-8">
        {[
          { step: 1, title: 'Select Type', icon: Target },
          { step: 2, title: 'Configure', icon: Settings },
          { step: 3, title: 'Generate', icon: Sparkles }
        ].map(({ step, title, icon: Icon }, index) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div 
                className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-110' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
                whileHover={{ scale: currentStep >= step ? 1.15 : 1.05 }}
              >
                {currentStep > step ? <CheckCircle className="h-7 w-7" /> : <Icon className="h-7 w-7" />}
              </motion.div>
              <span className={`mt-3 text-sm font-medium ${
                currentStep >= step ? 'text-indigo-600' : 'text-gray-400'
              }`}>
                {title}
              </span>
            </div>
            {index < 2 && (
              <div className={`w-24 h-1 mx-6 rounded-full transition-all duration-300 ${
                currentStep > step ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssessmentConfig = () => {
    const type = ASSESSMENT_TYPES.find(t => t.id === selectedAssessmentType);
    if (!type) return null;

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* AI Assistant Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                AI Assistant Configuration
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">Optional</Badge>
              </CardTitle>
              <p className="text-gray-600 text-lg">Let AI generate personalized content based on your requirements</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    Difficulty Level
                  </Label>
                  <select 
                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"
                    value={aiConfig.difficulty}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                  >
                    <option value="easy">Easy - Beginner Level</option>
                    <option value="medium">Medium - Intermediate Level</option>
                    <option value="hard">Hard - Advanced Level</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    Focus Areas
                  </Label>
                  <Input
                    value={aiConfig.focusAreas}
                    onChange={(e) => setAiConfig(prev => ({ ...prev, focusAreas: e.target.value }))}
                    placeholder="e.g., React, Node.js, Leadership, Communication"
                    className="border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 p-3"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-purple-500" />
                  Additional Context for AI
                </Label>
                <Textarea
                  value={aiConfig.additionalContext}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, additionalContext: e.target.value }))}
                  placeholder="Provide additional context to help AI generate better content (e.g., specific skills to test, company culture aspects, etc.)"
                  className="h-24 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-4 focus:ring-purple-100 p-3 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  Job Description
                  <Badge variant="outline" className="text-xs">Auto-filled</Badge>
                </Label>
                <Textarea
                  value={jobDetails?.description || ''}
                  readOnly
                  placeholder="Job description will be used automatically for AI generation..."
                  className="h-24 resize-none bg-gray-50/80 border-2 border-gray-100 rounded-xl p-3 text-gray-600"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Basic Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                Basic Configuration
                <Badge className="bg-red-100 text-red-700 border-red-200">Required</Badge>
              </CardTitle>
              <p className="text-gray-600 text-lg">Configure the fundamental settings for your assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-500" />
                    Assessment Title *
                  </Label>
                  <Input
                    value={basicConfig.title}
                    onChange={(e) => setBasicConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a compelling assessment title"
                    required
                    className="border-2 border-gray-200 rounded-xl bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 p-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-500" />
                    Duration (minutes)
                  </Label>
                  <Input
                    type="number"
                    value={basicConfig.duration}
                    onChange={(e) => setBasicConfig(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="30"
                    className="border-2 border-gray-200 rounded-xl bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 p-3"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Description *
                </Label>
                <Textarea
                  value={basicConfig.description}
                  onChange={(e) => setBasicConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a detailed description of what this assessment evaluates"
                  className="h-24 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 p-3 resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Instructions
                </Label>
                <Textarea
                  value={basicConfig.instructions}
                  onChange={(e) => setBasicConfig(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="Clear instructions for candidates on how to complete the assessment"
                  className="h-32 border-2 border-gray-200 rounded-xl bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 p-3 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Deadline
                </Label>
                <Input
                  type="datetime-local"
                  value={basicConfig.deadline}
                  onChange={(e) => setBasicConfig(prev => ({ ...prev, deadline: e.target.value }))}
                  className="border-2 border-gray-200 rounded-xl bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 p-3"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessment-Specific Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`border-0 shadow-2xl ${type.gradient} backdrop-blur-sm overflow-hidden`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -translate-y-20 translate-x-20"></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className={`p-3 ${type.iconBg} rounded-xl shadow-lg`}>
                  <type.icon className="h-6 w-6 text-white" />
                </div>
                {type.title} Configuration
                <Badge className="bg-white/80 text-gray-700 border-gray-200">Customize</Badge>
              </CardTitle>
              <p className="text-gray-700 text-lg">Fine-tune the specific settings for this assessment type</p>
            </CardHeader>
            <CardContent className="bg-white/60 backdrop-blur-sm rounded-xl mx-6 mb-6 p-6">
              {selectedAssessmentType === 'quiz' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Number of Questions</Label>
                      <Input
                        type="number"
                        value={quizConfig.numberOfQuestions}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, numberOfQuestions: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Difficulty Level</Label>
                      <select 
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        value={quizConfig.difficulty}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Passing Score (%)</Label>
                      <Input
                        type="number"
                        value={quizConfig.passingScore}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, passingScore: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Question Categories
                    </Label>
                    <div className="flex flex-wrap gap-3">
                      {quizConfig.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
                          {category}
                          <button onClick={() => setQuizConfig(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }))}>
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newCategory = prompt("Enter category name:");
                          if (newCategory) setQuizConfig(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
                        }}
                        className="rounded-xl"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Category
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizConfig.showCorrectAnswers}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, showCorrectAnswers: e.target.checked }))}
                        className="w-5 h-5 text-emerald-600"
                      />
                      <span className="font-medium">Show Correct Answers</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizConfig.shuffleQuestions}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                        className="w-5 h-5 text-emerald-600"
                      />
                      <span className="font-medium">Shuffle Questions</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizConfig.allowRetakes}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, allowRetakes: e.target.checked }))}
                        className="w-5 h-5 text-emerald-600"
                      />
                      <span className="font-medium">Allow Retakes</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedAssessmentType === 'video' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Prompts
                    </Label>
                    {videoConfig.customPrompts.map((prompt, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          value={prompt}
                          onChange={(e) => {
                            const newPrompts = [...videoConfig.customPrompts];
                            newPrompts[index] = e.target.value;
                            setVideoConfig(prev => ({ ...prev, customPrompts: newPrompts }));
                          }}
                          placeholder="Enter video prompt question"
                          className="rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setVideoConfig(prev => ({ ...prev, customPrompts: prev.customPrompts.filter((_, i) => i !== index) }))}
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => setVideoConfig(prev => ({ ...prev, customPrompts: [...prev.customPrompts, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Video Prompt
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoConfig.enablePracticeRound}
                        onChange={(e) => setVideoConfig(prev => ({ ...prev, enablePracticeRound: e.target.checked }))}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium">Enable Practice Round</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={videoConfig.allowReRecording}
                        onChange={(e) => setVideoConfig(prev => ({ ...prev, allowReRecording: e.target.checked }))}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-medium">Allow Re-recording</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedAssessmentType === 'interview' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Interview Scenarios
                    </Label>
                    {interviewConfig.customScenarios.map((scenario, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          value={scenario}
                          onChange={(e) => {
                            const newScenarios = [...interviewConfig.customScenarios];
                            newScenarios[index] = e.target.value;
                            setInterviewConfig(prev => ({ ...prev, customScenarios: newScenarios }));
                          }}
                          placeholder="Enter interview scenario or question"
                          className="rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setInterviewConfig(prev => ({ ...prev, customScenarios: prev.customScenarios.filter((_, i) => i !== index) }))}
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => setInterviewConfig(prev => ({ ...prev, customScenarios: [...prev.customScenarios, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Scenario
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interviewConfig.enableFollowUps}
                        onChange={(e) => setInterviewConfig(prev => ({ ...prev, enableFollowUps: e.target.checked }))}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="font-medium">Enable Follow-up Questions</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interviewConfig.realTimeAnalysis}
                        onChange={(e) => setInterviewConfig(prev => ({ ...prev, realTimeAnalysis: e.target.checked }))}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="font-medium">Real-time Analysis</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={interviewConfig.voiceEnabled}
                        onChange={(e) => setInterviewConfig(prev => ({ ...prev, voiceEnabled: e.target.checked }))}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="font-medium">Voice Enabled</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedAssessmentType === 'takeHome' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Submission Deadline (hours)</Label>
                      <Input
                        type="number"
                        value={takeHomeConfig.submissionDeadline}
                        onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Max File Size (MB)</Label>
                      <Input
                        type="number"
                        value={takeHomeConfig.maxFileSize}
                        onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, maxFileSize: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Project Type</Label>
                      <select 
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        value={takeHomeConfig.projectType}
                        onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, projectType: e.target.value }))}
                      >
                        <option value="coding">Coding Project</option>
                        <option value="design">Design Project</option>
                        <option value="analysis">Analysis Project</option>
                        <option value="presentation">Presentation</option>
                        <option value="research">Research Paper</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Allowed File Types</Label>
                    <div className="flex flex-wrap gap-3">
                      {takeHomeConfig.allowedFileTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm">
                          <FileCode className="h-3 w-3" />
                          {type}
                          <button onClick={() => setTakeHomeConfig(prev => ({ ...prev, allowedFileTypes: prev.allowedFileTypes.filter((_, i) => i !== index) }))}>
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newType = prompt("Enter file extension (e.g., .txt):");
                          if (newType) setTakeHomeConfig(prev => ({ ...prev, allowedFileTypes: [...prev.allowedFileTypes, newType] }));
                        }}
                        className="rounded-xl"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Type
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Project Requirements
                    </Label>
                    {takeHomeConfig.requirements.map((req, index) => (
                      <div key={index} className="flex gap-3">
                        <Input
                          value={req}
                          onChange={(e) => {
                            const newReqs = [...takeHomeConfig.requirements];
                            newReqs[index] = e.target.value;
                            setTakeHomeConfig(prev => ({ ...prev, requirements: newReqs }));
                          }}
                          placeholder="Enter project requirement"
                          className="rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setTakeHomeConfig(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }))}
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => setTakeHomeConfig(prev => ({ ...prev, requirements: [...prev.requirements, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Requirement
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={takeHomeConfig.provideSampleCode}
                        onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, provideSampleCode: e.target.checked }))}
                        className="w-5 h-5 text-orange-600"
                      />
                      <span className="font-medium">Provide Sample Code</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={takeHomeConfig.githubIntegration}
                        onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, githubIntegration: e.target.checked }))}
                        className="w-5 h-5 text-orange-600"
                      />
                      <span className="font-medium">GitHub Integration</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedAssessmentType === 'situational' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Number of Scenarios</Label>
                      <Input
                        type="number"
                        value={situationalConfig.numberOfScenarios}
                        onChange={(e) => setSituationalConfig(prev => ({ ...prev, numberOfScenarios: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Scenario Complexity</Label>
                      <select 
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        value={situationalConfig.scenarioComplexity}
                        onChange={(e) => setSituationalConfig(prev => ({ ...prev, scenarioComplexity: e.target.value }))}
                      >
                        <option value="simple">Simple</option>
                        <option value="medium">Medium</option>
                        <option value="complex">Complex</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Time per Scenario (minutes)</Label>
                      <Input
                        type="number"
                        value={situationalConfig.timePerScenario}
                        onChange={(e) => setSituationalConfig(prev => ({ ...prev, timePerScenario: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Custom Scenarios
                    </Label>
                    {situationalConfig.customScenarios.map((scenario, index) => (
                      <div key={index} className="flex gap-3">
                        <Textarea
                          value={scenario}
                          onChange={(e) => {
                            const newScenarios = [...situationalConfig.customScenarios];
                            newScenarios[index] = e.target.value;
                            setSituationalConfig(prev => ({ ...prev, customScenarios: newScenarios }));
                          }}
                          placeholder="Describe a workplace scenario for judgment testing"
                          className="h-24 rounded-xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 resize-none"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setSituationalConfig(prev => ({ ...prev, customScenarios: prev.customScenarios.filter((_, i) => i !== index) }))}
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => setSituationalConfig(prev => ({ ...prev, customScenarios: [...prev.customScenarios, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Scenario
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Response Format</Label>
                      <select 
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
                        value={situationalConfig.responseFormat}
                        onChange={(e) => setSituationalConfig(prev => ({ ...prev, responseFormat: e.target.value }))}
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="text">Text Response</option>
                        <option value="ranking">Ranking</option>
                      </select>
                    </div>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={situationalConfig.includeRealCases}
                        onChange={(e) => setSituationalConfig(prev => ({ ...prev, includeRealCases: e.target.checked }))}
                        className="w-5 h-5 text-pink-600"
                      />
                      <span className="font-medium">Include Real Cases</span>
                    </label>
                    <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 border-2 border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={situationalConfig.videoResponse}
                        onChange={(e) => setSituationalConfig(prev => ({ ...prev, videoResponse: e.target.checked }))}
                        className="w-5 h-5 text-pink-600"
                      />
                      <span className="font-medium">Video Response Option</span>
                    </label>
                  </div>
                </div>
              )}

              {selectedAssessmentType === 'coding' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Number of Problems</Label>
                      <Input
                        type="number"
                        value={codingConfig.numberOfProblems}
                        onChange={(e) => setCodingConfig(prev => ({ ...prev, numberOfProblems: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Time Limit (minutes)</Label>
                      <Input
                        type="number"
                        value={codingConfig.timeLimit}
                        onChange={(e) => setCodingConfig(prev => ({ ...prev, timeLimit: e.target.value }))}
                        className="rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Difficulty</Label>
                      <select 
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                        value={codingConfig.difficulty}
                        onChange={(e) => setCodingConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Programming Languages</Label>
                    <div className="flex flex-wrap gap-3">
                      {codingConfig.programmingLanguages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm">
                          <Code className="h-3 w-3" />
                          {lang}
                          <button onClick={() => setCodingConfig(prev => ({ ...prev, programmingLanguages: prev.programmingLanguages.filter((_, i) => i !== index) }))}>
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const newLang = prompt("Enter programming language:");
                          if (newLang) setCodingConfig(prev => ({ ...prev, programmingLanguages: [...prev.programmingLanguages, newLang] }));
                        }}
                        className="rounded-xl"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Language
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Custom Coding Problems
                    </Label>
                    {codingConfig.customProblems.map((problem, index) => (
                      <div key={index} className="flex gap-3">
                        <Textarea
                          value={problem}
                          onChange={(e) => {
                            const newProblems = [...codingConfig.customProblems];
                            newProblems[index] = e.target.value;
                            setCodingConfig(prev => ({ ...prev, customProblems: newProblems }));
                          }}
                          placeholder="Describe the coding problem statement"
                          className="h-24 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 resize-none"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setCodingConfig(prev => ({ ...prev, customProblems: prev.customProblems.filter((_, i) => i !== index) }))}
                          className="rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl"
                      onClick={() => setCodingConfig(prev => ({ ...prev, customProblems: [...prev.customProblems, ""] }))}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Problem
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-center gap-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(1)}
            className="px-8 py-4 rounded-xl border-2 hover:bg-gray-50 transition-all text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-3" />
            Back to Selection
          </Button>
          <Button 
            onClick={generateAssessment}
            disabled={isGenerating || !validateCurrentStep()}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Assessment...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-3" />
                Generate Assessment
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-12"
        >
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="hover:scale-110 transition-transform rounded-xl border-2 w-12 h-12"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Assessment' : 'Create Assessment'}
            </h1>
            {jobDetails?.title && (
              <p className="text-xl text-gray-600 mt-3 font-medium">
                For {jobDetails.title} position
              </p>
            )}
          </div>
        </motion.div>

        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Assessment Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-6xl mx-auto">
                <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 pb-8">
                    <CardTitle className="text-3xl flex items-center justify-center gap-3 mb-4">
                      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      Choose Assessment Type
                    </CardTitle>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                      Select the perfect assessment method to evaluate your candidates' skills and competencies
                    </p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {ASSESSMENT_TYPES.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <motion.div
                            key={type.id}
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all duration-300 border-3 h-full ${
                                selectedAssessmentType === type.id 
                                  ? 'border-indigo-500 shadow-2xl ring-4 ring-indigo-100' 
                                  : 'border-gray-200 hover:border-indigo-300 hover:shadow-xl'
                              } ${type.gradient} backdrop-blur-sm overflow-hidden`}
                              onClick={() => setSelectedAssessmentType(type.id)}
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                              <CardContent className="p-6 relative">
                                <div className="flex items-center justify-between mb-6">
                                  <div className={`p-4 ${type.iconBg} rounded-2xl shadow-lg`}>
                                    <IconComponent className="h-8 w-8 text-white" />
                                  </div>
                                  <Badge 
                                    variant="default"
                                    className="bg-green-500 text-white font-semibold px-3 py-1"
                                  >
                                    Available
                                  </Badge>
                                </div>
                                <h3 className="font-bold text-xl mb-3 text-gray-800">{type.title}</h3>
                                <p className="text-gray-600 text-base mb-6 leading-relaxed">{type.description}</p>
                                <div className="space-y-3">
                                  {type.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-sm text-gray-700">
                                      <CheckCircle className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />
                                      <span className="font-medium">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                                {selectedAssessmentType === type.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 p-3 bg-white/80 rounded-xl border-2 border-indigo-200"
                                  >
                                    <div className="flex items-center text-indigo-700 font-semibold">
                                      <CheckCircle className="h-5 w-5 mr-2" />
                                      Selected
                                    </div>
                                  </motion.div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <motion.div 
                      className="flex justify-center mt-12"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        onClick={() => validateCurrentStep() && setCurrentStep(2)}
                        disabled={!validateCurrentStep()}
                        className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ChevronRight className="h-5 w-5 ml-3" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step 2: Configure Assessment */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {renderAssessmentConfig()}
            </motion.div>
          )}

          {/* Step 3: Review Generated Content */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    Generated Assessment Content
                    <Badge className="bg-green-100 text-green-700 border-green-200">Ready</Badge>
                  </CardTitle>
                  <p className="text-gray-600 text-lg">Review and customize the AI-generated assessment content</p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {selectedAssessmentType === 'quiz' && Array.isArray(generatedContent) && (
                    <>
                      {generatedContent.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-lg px-3 py-1">Q{index + 1}</Badge>
                              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">{question.category}</Badge>
                              <Badge variant="secondary" className="px-3 py-1">{question.difficulty}</Badge>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-800 mb-4 text-lg">{question.question}</h4>
                          
                          {question.type === 'multiple_choice' && question.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {question.options.map((option: string, optionIndex: number) => (
                                <div 
                                  key={optionIndex} 
                                  className={`p-4 rounded-xl border-2 transition-all ${
                                    question.correctAnswer === optionIndex 
                                      ? 'bg-green-100 border-green-300 text-green-800 font-semibold' 
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <span className="font-bold mr-2">{String.fromCharCode(65 + optionIndex)}.</span> 
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'text' && (
                            <div className="p-4 bg-white border-2 border-gray-200 rounded-xl text-gray-600 italic">
                              <Eye className="h-4 w-4 inline mr-2" />
                              Open-ended text response question
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </>
                  )}

                  {selectedAssessmentType === 'video' && Array.isArray(generatedContent) && (
                    <>
                      {generatedContent.map((prompt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-lg px-3 py-1">Prompt {index + 1}</Badge>
                              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">{prompt.category}</Badge>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-800 mb-4 text-lg">{prompt.prompt}</h4>
                          
                          <div className="flex gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Prep: {prompt.preparationTime}s</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4" />
                              <span>Max: {prompt.maxDuration}s</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {!Array.isArray(generatedContent) && (
                    <div className="p-12 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                      >
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        Assessment Generated Successfully!
                      </h3>
                      <p className="text-gray-600 text-lg max-w-md mx-auto">
                        Your {ASSESSMENT_TYPES.find(t => t.id === selectedAssessmentType)?.title} has been generated and is ready to be sent to candidates.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <motion.div 
                className="flex justify-center gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-4 rounded-xl border-2 hover:bg-gray-50 transition-all text-lg"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Back to Configuration
                </Button>
                <Button 
                  onClick={handleSaveAssessment}
                  disabled={isSaving}
                  className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Assessment...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create & Send Assessment
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateAssignment;
