
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, ArrowRight, CheckCircle, Sparkles, Clock, Users, Code, Video, MessageSquare, FileText, BarChart3, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const [jobSpec, setJobSpec] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>(null);

  const [assessmentConfig, setAssessmentConfig] = useState({
    title: "",
    description: "",
    duration: "30",
    difficulty: "medium",
    numberOfQuestions: "10",
    deadline: "",
    instructions: "Please answer all questions to the best of your ability. You have limited time to complete this assessment."
  });

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
        setJobSpec(data.job?.description || '');
        setAssessmentConfig(prev => ({
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
          setAssessmentConfig({
            title: template.title || "",
            description: template.description || "",
            duration: template.duration || "30",
            difficulty: "medium",
            numberOfQuestions: template.questions?.length?.toString() || "10",
            deadline: template.deadline || "",
            instructions: template.instructions || ""
          });
          setGeneratedQuestions(template.questions || []);
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

  const generateQuizQuestions = async () => {
    if (!jobSpec.trim()) {
      toast({
        title: "Error",
        description: "Please provide job specifications first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockQuestions = [
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
        },
        {
          question: "Which of the following are Node.js frameworks?",
          type: "multiple_choice",
          options: ["Express.js", "Django", "Spring Boot", "Fastify"],
          correctAnswer: [0, 3],
          difficulty: "easy",
          category: "Node.js"
        }
      ];

      setGeneratedQuestions(mockQuestions);
      setCurrentStep(3);
      
      toast({
        title: "Success",
        description: `Generated ${mockQuestions.length} questions based on job requirements!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAssessment = async () => {
    if (!assessmentConfig.title.trim() || generatedQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please complete all required fields and generate questions",
        variant: "destructive",
      });
      return;
    }

    if (!resumeId) {
      toast({
        title: "Error",
        description: "Resume ID is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const assignmentDetails = {
        title: assessmentConfig.title,
        description: assessmentConfig.description,
        content: `<h2>Assessment Instructions</h2><p>${assessmentConfig.instructions}</p>`,
        duration: `${assessmentConfig.duration} minutes`,
        deadline: assessmentConfig.deadline,
        instructions: assessmentConfig.instructions,
        questions: generatedQuestions,
        assessment_type: selectedAssessmentType,
        difficulty: assessmentConfig.difficulty,
        auto_generated: true,
        job_spec_based: true
      };

      const url = isEdit 
        ? `${import.meta.env.VITE_BACKEND_URL}/assignments/${resumeId}`
        : `${import.meta.env.VITE_BACKEND_URL}/assessments/create`;
      
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit 
        ? JSON.stringify({ details: assignmentDetails })
        : JSON.stringify({ resume_id: resumeId, details: assignmentDetails });

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
                            onClick={() => type.status === 'active' && setSelectedAssessmentType(type.id)}
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
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Assessment Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Assessment Title</label>
                      <Input
                        value={assessmentConfig.title}
                        onChange={(e) => setAssessmentConfig(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter assessment title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <Textarea
                        value={assessmentConfig.description}
                        onChange={(e) => setAssessmentConfig(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the assessment"
                        className="h-20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
                        <Input
                          type="number"
                          value={assessmentConfig.duration}
                          onChange={(e) => setAssessmentConfig(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Questions</label>
                        <Input
                          type="number"
                          value={assessmentConfig.numberOfQuestions}
                          onChange={(e) => setAssessmentConfig(prev => ({ ...prev, numberOfQuestions: e.target.value }))}
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
                      <Input
                        type="datetime-local"
                        value={assessmentConfig.deadline}
                        onChange={(e) => setAssessmentConfig(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Job Specification</CardTitle>
                    <p className="text-sm text-gray-600">AI will generate questions based on this job description</p>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={jobSpec}
                      onChange={(e) => setJobSpec(e.target.value)}
                      placeholder="Paste the job description or requirements here..."
                      className="h-64 resize-none"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={generateQuizQuestions}
                  disabled={isGenerating || !jobSpec.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Quiz Questions
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review Generated Questions */}
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
                    Generated Questions ({generatedQuestions.length})
                  </CardTitle>
                  <p className="text-gray-600">Review and customize the auto-generated questions</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedQuestions.map((question, index) => (
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
                                question.correctAnswer === optionIndex || 
                                (Array.isArray(question.correctAnswer) && question.correctAnswer.includes(optionIndex))
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
