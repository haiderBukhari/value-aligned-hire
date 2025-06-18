
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Sparkles, Save, Send, Calendar, User, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Badge } from "@/components/ui/badge";

const genAI = new GoogleGenerativeAI("AIzaSyC8MPRWNW6xARNNyUdG1p3m2bd6QZuNP3A");

interface Assignment {
  id: string;
  title: string;
  details: string;
  deadline_hours: number;
}

interface Resume {
  id: string;
  applicant_name: string;
  email: string;
  total_weighted_score: number;
  final_recommendation: string;
  level_suggestion: string;
}

const CraftAssignment = () => {
  const { resumeId, jobId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    details: "",
    deadline: 48, // hours
  });
  
  const [existingTemplates, setExistingTemplates] = useState<Assignment[]>([
    {
      id: "1",
      title: "Frontend React Assessment",
      details: "<h2>Frontend Development Task</h2><p>Create a responsive React application with the following requirements:</p><ul><li>Implement user authentication</li><li>Create a dashboard with data visualization</li><li>Use TypeScript and modern React hooks</li></ul>",
      deadline_hours: 72
    },
    {
      id: "2", 
      title: "Backend API Development",
      details: "<h2>API Development Challenge</h2><p>Build a RESTful API with the following features:</p><ul><li>User management endpoints</li><li>Data persistence with database</li><li>Authentication and authorization</li></ul>",
      deadline_hours: 96
    }
  ]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch resume details
        const resumeResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          const foundResume = resumeData.resumes?.find((r: Resume) => r.id === resumeId);
          setResume(foundResume || null);
        }

        // Fetch job details
        const jobResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (jobResponse.ok) {
          const jobData = await jobResponse.json();
          setJobTitle(jobData.title || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId, resumeId]);

  const generateAssignmentSuggestion = async () => {
    if (!assignmentData.title.trim()) {
      toast.error("Please enter an assignment title first");
      return;
    }

    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
Create a comprehensive technical assignment for the position "${jobTitle}" based on the following information:

Assignment Title: "${assignmentData.title}"
Candidate Level: ${resume?.level_suggestion || "Not specified"}
Candidate Score: ${resume?.total_weighted_score || 0}%

Generate detailed HTML content for a technical assignment that includes:
1. A clear introduction explaining the task
2. Specific requirements and deliverables
3. Technical specifications
4. Evaluation criteria
5. Bonus points (optional features)

Make it challenging but appropriate for a ${resume?.level_suggestion || "mid"} level candidate. Use proper HTML formatting with headings, lists, and emphasis. Keep it professional and detailed.

Return only the HTML content without any markdown code blocks or explanations.
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      setAssignmentData(prev => ({ ...prev, details: response.trim() }));
      toast.success("Assignment details generated successfully!");
    } catch (error) {
      console.error("AI generation failed:", error);
      toast.error("Failed to generate assignment details. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: Assignment) => {
    setAssignmentData({
      title: template.title,
      details: template.details,
      deadline: template.deadline_hours,
    });
    setShowTemplateModal(false);
    toast.success("Template loaded successfully!");
  };

  const saveAsTemplate = async () => {
    if (!assignmentData.title || !assignmentData.details) {
      toast.error("Please fill in title and details before saving as template");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call to save template
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTemplate: Assignment = {
        id: Date.now().toString(),
        title: assignmentData.title,
        details: assignmentData.details,
        deadline_hours: assignmentData.deadline,
      };
      
      setExistingTemplates(prev => [...prev, newTemplate]);
      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const sendAssignment = async () => {
    if (!assignmentData.title || !assignmentData.details) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSending(true);
    try {
      // Simulate API call to send assignment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Assignment sent to ${resume?.applicant_name} successfully!`);
      navigate("/dashboard/assessments");
    } catch (error) {
      toast.error("Failed to send assignment");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading assignment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard/assessments")}
            className="text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Craft Assignment</h1>
              <p className="text-gray-600 mt-2">Create a technical assignment for {resume?.applicant_name}</p>
            </div>
            
            <Button
              onClick={() => setShowTemplateModal(true)}
              variant="outline"
              className="bg-white"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Use Template
            </Button>
          </div>
        </div>

        {/* Candidate Info Card */}
        <Card className="mb-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Candidate Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Candidate</p>
                <p className="font-semibold">{resume?.applicant_name}</p>
                <p className="text-sm text-gray-600">{resume?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold">{jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Level</p>
                <Badge className="bg-blue-100 text-blue-800">{resume?.level_suggestion}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-semibold text-lg">{resume?.total_weighted_score}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assignment Title */}
            <div>
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                value={assignmentData.title}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Frontend React Component Challenge"
                className="mt-2"
              />
            </div>

            {/* Assignment Details with AI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="details">Assignment Details *</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateAssignmentSuggestion}
                  disabled={isGenerating}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-1">AI Suggest</span>
                </Button>
              </div>
              <div className="border rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={assignmentData.details}
                  onChange={(value) => setAssignmentData(prev => ({ ...prev, details: value }))}
                  modules={modules}
                  placeholder="Write detailed assignment instructions, requirements, and deliverables..."
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <Label htmlFor="deadline">Deadline (Hours) *</Label>
              <div className="flex items-center gap-2 mt-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <Input
                  id="deadline"
                  type="number"
                  value={assignmentData.deadline}
                  onChange={(e) => setAssignmentData(prev => ({ ...prev, deadline: parseInt(e.target.value) || 48 }))}
                  placeholder="48"
                  className="w-32"
                />
                <span className="text-sm text-gray-500">hours from now</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                onClick={sendAssignment}
                disabled={isSending || !assignmentData.title || !assignmentData.details}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Assignment...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Assignment
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={saveAsTemplate}
                disabled={isSaving || !assignmentData.title || !assignmentData.details}
                className="bg-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Template
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Selection Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Select Assignment Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setAssignmentData({ title: "", details: "", deadline: 48 });
                setShowTemplateModal(false);
              }}
              variant="outline"
              className="w-full p-6 h-auto border-2 border-dashed border-gray-300 hover:border-blue-300"
            >
              <div className="text-center">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Create New Assignment</h3>
                <p className="text-sm text-gray-500">Start from scratch</p>
              </div>
            </Button>
            
            {existingTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                    <Badge variant="outline">{template.deadline_hours}h</Badge>
                  </div>
                  <div 
                    className="text-sm text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: template.details.replace(/<[^>]*>/g, '').substring(0, 200) + '...' }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CraftAssignment;
