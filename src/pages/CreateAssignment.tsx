
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, ArrowRight, CheckCircle, Sparkles, Clock, Users, Code, Video, MessageSquare, FileText, BarChart3, Zap, Plus, Trash2, Settings } from "lucide-react";
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
    color: 'from-green-500 to-emerald-500',
    features: ['Multiple choice questions', 'Auto-scoring', 'Instant results']
  },
  {
    id: 'video',
    title: 'Video Assessment',
    description: 'Record responses to interview prompts',
    icon: Video,
    status: 'coming-soon',
    color: 'from-blue-500 to-cyan-500',
    features: ['Video recording', 'AI analysis', 'Behavioral insights']
  },
  {
    id: 'interview',
    title: 'Interview Simulation',
    description: 'AI-powered mock interview sessions',
    icon: MessageSquare,
    status: 'coming-soon',
    color: 'from-purple-500 to-violet-500',
    features: ['Real-time conversation', 'Dynamic questions', 'Performance metrics']
  },
  {
    id: 'takeHome',
    title: 'Take-Home Test',
    description: 'Project-based assignments and submissions',
    icon: FileText,
    status: 'coming-soon',
    color: 'from-orange-500 to-red-500',
    features: ['File uploads', 'Project review', 'Code analysis']
  },
  {
    id: 'situational',
    title: 'Situational Judgment',
    description: 'Scenario-based decision making tests',
    icon: BarChart3,
    status: 'coming-soon',
    color: 'from-pink-500 to-rose-500',
    features: ['Real scenarios', 'Decision analysis', 'Leadership assessment']
  },
  {
    id: 'coding',
    title: 'Coding Challenge',
    description: 'Technical programming assessments',
    icon: Code,
    status: 'coming-soon',
    color: 'from-indigo-500 to-blue-500',
    features: ['Live coding', 'Multiple languages', 'Performance tracking']
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
    maxVideoDuration: "5",
    numberOfPrompts: "3",
    preparationTime: "2",
    recordingAttempts: "2",
    promptCategories: ["Behavioral", "Situational"],
    customPrompts: [""],
    enablePracticeRound: true
  });

  const [interviewConfig, setInterviewConfig] = useState({
    sessionDuration: "45",
    numberOfQuestions: "8",
    questionDifficulty: "adaptive",
    focusAreas: ["Communication", "Technical", "Leadership"],
    enableFollowUps: true,
    realTimeAnalysis: true,
    customScenarios: [""]
  });

  const [takeHomeConfig, setTakeHomeConfig] = useState({
    submissionDeadline: "72",
    maxFileSize: "10",
    allowedFileTypes: [".pdf", ".doc", ".zip"],
    projectType: "coding",
    requirements: [""],
    evaluationCriteria: ["Code Quality", "Problem Solving", "Documentation"],
    provideSampleCode: false
  });

  const [situationalConfig, setSituationalConfig] = useState({
    numberOfScenarios: "5",
    scenarioComplexity: "medium",
    focusAreas: ["Leadership", "Decision Making", "Ethics"],
    responseFormat: "multiple_choice",
    customScenarios: [""],
    includeRealCases: true,
    timePerScenario: "10"
  });

  const [codingConfig, setCodingConfig] = useState({
    programmingLanguages: ["JavaScript", "Python"],
    difficulty: "medium",
    numberOfProblems: "3",
    timeLimit: "90",
    problemTypes: ["Algorithm", "Data Structure"],
    allowDebugger: true,
    showTestCases: true,
    customProblems: [""]
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
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep >= step 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 3 && (
            <div className={`w-20 h-1 mx-2 ${
              currentStep > step ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderAssessmentConfig = () => {
    const type = ASSESSMENT_TYPES.find(t => t.id === selectedAssessmentType);
    if (!type) return null;

    return (
      <div className="space-y-6">
        {/* Basic Configuration */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Basic Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Assessment Title</Label>
                <Input
                  value={basicConfig.title}
                  onChange={(e) => setBasicConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter assessment title"
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={basicConfig.duration}
                  onChange={(e) => setBasicConfig(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={basicConfig.description}
                onChange={(e) => setBasicConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assessment"
                className="h-20"
              />
            </div>

            <div>
              <Label>Instructions</Label>
              <Textarea
                value={basicConfig.instructions}
                onChange={(e) => setBasicConfig(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Instructions for candidates"
                className="h-24"
              />
            </div>

            <div>
              <Label>Deadline</Label>
              <Input
                type="datetime-local"
                value={basicConfig.deadline}
                onChange={(e) => setBasicConfig(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Assessment-Specific Configuration */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <type.icon className="h-5 w-5" />
              {type.title} Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedAssessmentType === 'quiz' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      value={quizConfig.numberOfQuestions}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, numberOfQuestions: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Difficulty Level</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={quizConfig.difficulty}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <Label>Passing Score (%)</Label>
                    <Input
                      type="number"
                      value={quizConfig.passingScore}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, passingScore: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Question Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quizConfig.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizConfig.showCorrectAnswers}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, showCorrectAnswers: e.target.checked }))}
                    />
                    <span>Show Correct Answers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizConfig.shuffleQuestions}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                    />
                    <span>Shuffle Questions</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={quizConfig.allowRetakes}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, allowRetakes: e.target.checked }))}
                    />
                    <span>Allow Retakes</span>
                  </label>
                </div>
              </div>
            )}

            {selectedAssessmentType === 'video' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Max Video Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={videoConfig.maxVideoDuration}
                      onChange={(e) => setVideoConfig(prev => ({ ...prev, maxVideoDuration: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Number of Prompts</Label>
                    <Input
                      type="number"
                      value={videoConfig.numberOfPrompts}
                      onChange={(e) => setVideoConfig(prev => ({ ...prev, numberOfPrompts: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Preparation Time (minutes)</Label>
                    <Input
                      type="number"
                      value={videoConfig.preparationTime}
                      onChange={(e) => setVideoConfig(prev => ({ ...prev, preparationTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Custom Prompts</Label>
                  {videoConfig.customPrompts.map((prompt, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={prompt}
                        onChange={(e) => {
                          const newPrompts = [...videoConfig.customPrompts];
                          newPrompts[index] = e.target.value;
                          setVideoConfig(prev => ({ ...prev, customPrompts: newPrompts }));
                        }}
                        placeholder="Enter video prompt"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setVideoConfig(prev => ({ ...prev, customPrompts: prev.customPrompts.filter((_, i) => i !== index) }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setVideoConfig(prev => ({ ...prev, customPrompts: [...prev.customPrompts, ""] }))}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prompt
                  </Button>
                </div>
              </div>
            )}

            {selectedAssessmentType === 'interview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Session Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={interviewConfig.sessionDuration}
                      onChange={(e) => setInterviewConfig(prev => ({ ...prev, sessionDuration: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      value={interviewConfig.numberOfQuestions}
                      onChange={(e) => setInterviewConfig(prev => ({ ...prev, numberOfQuestions: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Question Difficulty</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={interviewConfig.questionDifficulty}
                      onChange={(e) => setInterviewConfig(prev => ({ ...prev, questionDifficulty: e.target.value }))}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="adaptive">Adaptive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Focus Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interviewConfig.focusAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {area}
                        <button onClick={() => setInterviewConfig(prev => ({ ...prev, focusAreas: prev.focusAreas.filter((_, i) => i !== index) }))}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedAssessmentType === 'takeHome' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Submission Deadline (hours)</Label>
                    <Input
                      type="number"
                      value={takeHomeConfig.submissionDeadline}
                      onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, submissionDeadline: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Max File Size (MB)</Label>
                    <Input
                      type="number"
                      value={takeHomeConfig.maxFileSize}
                      onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, maxFileSize: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Project Type</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={takeHomeConfig.projectType}
                      onChange={(e) => setTakeHomeConfig(prev => ({ ...prev, projectType: e.target.value }))}
                    >
                      <option value="coding">Coding Project</option>
                      <option value="design">Design Project</option>
                      <option value="analysis">Analysis Project</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Project Requirements</Label>
                  {takeHomeConfig.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={req}
                        onChange={(e) => {
                          const newReqs = [...takeHomeConfig.requirements];
                          newReqs[index] = e.target.value;
                          setTakeHomeConfig(prev => ({ ...prev, requirements: newReqs }));
                        }}
                        placeholder="Enter project requirement"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTakeHomeConfig(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setTakeHomeConfig(prev => ({ ...prev, requirements: [...prev.requirements, ""] }))}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </div>
            )}

            {selectedAssessmentType === 'situational' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Number of Scenarios</Label>
                    <Input
                      type="number"
                      value={situationalConfig.numberOfScenarios}
                      onChange={(e) => setSituationalConfig(prev => ({ ...prev, numberOfScenarios: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Scenario Complexity</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={situationalConfig.scenarioComplexity}
                      onChange={(e) => setSituationalConfig(prev => ({ ...prev, scenarioComplexity: e.target.value }))}
                    >
                      <option value="simple">Simple</option>
                      <option value="medium">Medium</option>
                      <option value="complex">Complex</option>
                    </select>
                  </div>
                  <div>
                    <Label>Time per Scenario (minutes)</Label>
                    <Input
                      type="number"
                      value={situationalConfig.timePerScenario}
                      onChange={(e) => setSituationalConfig(prev => ({ ...prev, timePerScenario: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Focus Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {situationalConfig.focusAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {area}
                        <button onClick={() => setSituationalConfig(prev => ({ ...prev, focusAreas: prev.focusAreas.filter((_, i) => i !== index) }))}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedAssessmentType === 'coding' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Number of Problems</Label>
                    <Input
                      type="number"
                      value={codingConfig.numberOfProblems}
                      onChange={(e) => setCodingConfig(prev => ({ ...prev, numberOfProblems: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Time Limit (minutes)</Label>
                    <Input
                      type="number"
                      value={codingConfig.timeLimit}
                      onChange={(e) => setCodingConfig(prev => ({ ...prev, timeLimit: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={codingConfig.difficulty}
                      onChange={(e) => setCodingConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Programming Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {codingConfig.programmingLanguages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {lang}
                        <button onClick={() => setCodingConfig(prev => ({ ...prev, programmingLanguages: prev.programmingLanguages.filter((_, i) => i !== index) }))}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={codingConfig.allowDebugger}
                      onChange={(e) => setCodingConfig(prev => ({ ...prev, allowDebugger: e.target.checked }))}
                    />
                    <span>Allow Debugger</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={codingConfig.showTestCases}
                      onChange={(e) => setCodingConfig(prev => ({ ...prev, showTestCases: e.target.checked }))}
                    />
                    <span>Show Test Cases</span>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Specification for AI */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Assistant Configuration (Optional)
            </CardTitle>
            <p className="text-sm text-gray-600">Provide additional context to help AI generate better content</p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jobDetails?.description || ''}
              readOnly
              placeholder="Job description will be used automatically for AI generation..."
              className="h-32 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              The AI will use the job description and your configuration settings to generate relevant assessment content.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={generateAssessment}
            disabled={isGenerating || !basicConfig.title.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Assessment...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Assessment
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="hover:scale-110 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isEdit ? 'Edit Assessment' : 'Create Assessment'}
            </h1>
            <p className="text-gray-600 mt-1">
              {jobDetails?.title && `For ${jobDetails.title} position`}
            </p>
          </div>
        </motion.div>

        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Assessment Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                    Choose Assessment Type
                  </CardTitle>
                  <p className="text-gray-600">Select the type of assessment you want to create</p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ASSESSMENT_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <motion.div
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-300 border-2 ${
                              selectedAssessmentType === type.id 
                                ? 'border-purple-500 shadow-lg' 
                                : 'border-gray-200 hover:border-purple-300'
                            } ${type.status === 'coming-soon' ? 'opacity-70' : ''}`}
                            onClick={() => setSelectedAssessmentType(type.id)}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                                  <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <Badge 
                                  variant={type.status === 'active' ? 'default' : 'secondary'}
                                  className={type.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                                >
                                  {type.status === 'active' ? 'Available' : 'Coming Soon'}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                              <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                              <div className="space-y-1">
                                {type.features.map((feature, index) => (
                                  <div key={index} className="flex items-center text-sm text-gray-500">
                                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={() => selectedAssessmentType && setCurrentStep(2)}
                      disabled={!selectedAssessmentType}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8 py-3"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Configure Assessment */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderAssessmentConfig()}
            </motion.div>
          )}

          {/* Step 3: Review Generated Content */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Generated Content
                  </CardTitle>
                  <p className="text-gray-600">Review and customize the generated assessment content</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAssessmentType === 'quiz' && Array.isArray(generatedContent) && (
                    <>
                      {generatedContent.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border-2 border-gray-100 rounded-lg bg-gray-50/50"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Q{index + 1}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{question.category}</Badge>
                              <Badge variant="secondary">{question.difficulty}</Badge>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-800 mb-3">{question.question}</h4>
                          
                          {question.type === 'multiple_choice' && question.options && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.options.map((option: string, optionIndex: number) => (
                                <div 
                                  key={optionIndex} 
                                  className={`p-2 rounded border text-sm ${
                                    question.correctAnswer === optionIndex 
                                      ? 'bg-green-100 border-green-300 text-green-800' 
                                      : 'bg-white border-gray-200'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.type === 'text' && (
                            <div className="p-3 bg-white border rounded text-sm text-gray-600 italic">
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
                          className="p-4 border-2 border-gray-100 rounded-lg bg-gray-50/50"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Prompt {index + 1}</Badge>
                              <Badge className="bg-blue-100 text-blue-800">{prompt.category}</Badge>
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-800 mb-3">{prompt.prompt}</h4>
                          
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>Prep: {prompt.preparationTime}s</span>
                            <span>Max: {prompt.maxDuration}s</span>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {!Array.isArray(generatedContent) && (
                    <div className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Assessment Generated Successfully!
                      </h3>
                      <p className="text-gray-600">
                        Your {ASSESSMENT_TYPES.find(t => t.id === selectedAssessmentType)?.title} has been generated and is ready to be sent to candidates.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Configuration
                </Button>
                <Button 
                  onClick={handleSaveAssessment}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-8 py-3"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Assessment...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create & Send Assessment
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateAssignment;
