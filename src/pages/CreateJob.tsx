
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Briefcase, Sparkles, Upload, FileText, Loader2, Plus, X, ArrowLeft } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useMutation } from "@tanstack/react-query";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const CreateJob = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [] as string[],
    benefits: [] as string[],
    location: '',
    type: 'full-time',
    salary_range: '',
    experience_level: 'mid-level'
  });
  
  const [aiInput, setAiInput] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [generatingWithAI, setGeneratingWithAI] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData: typeof formData) => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Job created successfully!');
      navigate('/dashboard/jobs');
    },
    onError: (error) => {
      console.error('Job creation error:', error);
      toast.error('Failed to create job');
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addBenefit = () => {
    if (currentBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, currentBenefit.trim()]
      }));
      setCurrentBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const generateWithAI = async () => {
    if (!aiInput.trim()) {
      toast.error('Please provide some context for AI generation');
      return;
    }

    setGeneratingWithAI(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Based on this input: "${aiInput}", generate a comprehensive job posting with the following structure:
      
      Title: [Job Title]
      Description: [Detailed job description]
      Requirements: [List of requirements, separated by newlines with bullet points]
      Benefits: [List of benefits, separated by newlines with bullet points]
      Location: [Work location or "Remote"]
      Type: [full-time, part-time, contract, or internship]
      Salary Range: [Salary range if mentioned]
      Experience Level: [entry-level, mid-level, or senior-level]
      
      Please provide a realistic and professional job posting.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the AI response
      const parseAIResponse = (text: string) => {
        const lines = text.split('\n');
        const parsed = {
          title: '',
          description: '',
          requirements: [] as string[],
          benefits: [] as string[],
          location: '',
          type: 'full-time',
          salary_range: '',
          experience_level: 'mid-level'
        };

        let currentSection = '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.toLowerCase().startsWith('title:')) {
            parsed.title = trimmed.substring(6).trim();
          } else if (trimmed.toLowerCase().startsWith('description:')) {
            parsed.description = trimmed.substring(12).trim();
          } else if (trimmed.toLowerCase().startsWith('requirements:')) {
            currentSection = 'requirements';
          } else if (trimmed.toLowerCase().startsWith('benefits:')) {
            currentSection = 'benefits';
          } else if (trimmed.toLowerCase().startsWith('location:')) {
            parsed.location = trimmed.substring(9).trim();
          } else if (trimmed.toLowerCase().startsWith('type:')) {
            const type = trimmed.substring(5).trim().toLowerCase();
            if (['full-time', 'part-time', 'contract', 'internship'].includes(type)) {
              parsed.type = type;
            }
          } else if (trimmed.toLowerCase().startsWith('salary range:')) {
            parsed.salary_range = trimmed.substring(13).trim();
          } else if (trimmed.toLowerCase().startsWith('experience level:')) {
            const level = trimmed.substring(17).trim().toLowerCase();
            if (['entry-level', 'mid-level', 'senior-level'].includes(level)) {
              parsed.experience_level = level;
            }
          } else if (currentSection === 'requirements' && (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
            parsed.requirements.push(trimmed.substring(1).trim());
          } else if (currentSection === 'benefits' && (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
            parsed.benefits.push(trimmed.substring(1).trim());
          } else if (currentSection === 'requirements' && trimmed) {
            parsed.requirements.push(trimmed);
          } else if (currentSection === 'benefits' && trimmed) {
            parsed.benefits.push(trimmed);
          }
        }

        return parsed;
      };

      const parsedData = parseAIResponse(text);
      setFormData(prev => ({ ...prev, ...parsedData }));
      setStep(2);
      toast.success('Job posting generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate job posting with AI');
    } finally {
      setGeneratingWithAI(false);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // Here you could also extract information from the resume using AI
      toast.success('Resume uploaded successfully');
    }
  };

  const analyzeResumeWithAI = async () => {
    if (!resumeFile) {
      toast.error('Please upload a resume first');
      return;
    }

    setGeneratingWithAI(true);
    try {
      // For this demo, we'll generate a job posting that might match the resume
      // In a real implementation, you'd extract text from the PDF/document first
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Generate a job posting that would be suitable for someone with the following background (simulate based on common resume patterns):
      
      Create a comprehensive job posting with:
      Title: [Relevant Job Title]
      Description: [Detailed job description]
      Requirements: [List of requirements]
      Benefits: [List of benefits]
      Location: [Work location]
      Type: [Employment type]
      Salary Range: [Competitive salary range]
      Experience Level: [Appropriate level]
      
      Make it professional and realistic.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Use the same parsing logic as before
      const parseAIResponse = (text: string) => {
        const lines = text.split('\n');
        const parsed = {
          title: '',
          description: '',
          requirements: [] as string[],
          benefits: [] as string[],
          location: '',
          type: 'full-time',
          salary_range: '',
          experience_level: 'mid-level'
        };

        let currentSection = '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.toLowerCase().startsWith('title:')) {
            parsed.title = trimmed.substring(6).trim();
          } else if (trimmed.toLowerCase().startsWith('description:')) {
            parsed.description = trimmed.substring(12).trim();
          } else if (trimmed.toLowerCase().startsWith('requirements:')) {
            currentSection = 'requirements';
          } else if (trimmed.toLowerCase().startsWith('benefits:')) {
            currentSection = 'benefits';
          } else if (trimmed.toLowerCase().startsWith('location:')) {
            parsed.location = trimmed.substring(9).trim();
          } else if (trimmed.toLowerCase().startsWith('type:')) {
            const type = trimmed.substring(5).trim().toLowerCase();
            if (['full-time', 'part-time', 'contract', 'internship'].includes(type)) {
              parsed.type = type;
            }
          } else if (trimmed.toLowerCase().startsWith('salary range:')) {
            parsed.salary_range = trimmed.substring(13).trim();
          } else if (trimmed.toLowerCase().startsWith('experience level:')) {
            const level = trimmed.substring(17).trim().toLowerCase();
            if (['entry-level', 'mid-level', 'senior-level'].includes(level)) {
              parsed.experience_level = level;
            }
          } else if (currentSection === 'requirements' && (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
            parsed.requirements.push(trimmed.substring(1).trim());
          } else if (currentSection === 'benefits' && (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*'))) {
            parsed.benefits.push(trimmed.substring(1).trim());
          }
        }

        return parsed;
      };

      const parsedData = parseAIResponse(text);
      setFormData(prev => ({ ...prev, ...parsedData }));
      setStep(2);
      toast.success('Job posting generated from resume analysis!');
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast.error('Failed to analyze resume');
    } finally {
      setGeneratingWithAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    createJobMutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? navigate('/dashboard') : setStep(1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
            <p className="text-gray-600">Use AI to generate job postings or create manually</p>
          </div>
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Generation */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span>AI-Powered Generation</span>
              </CardTitle>
              <CardDescription>
                Describe the role you want to create and let AI generate a complete job posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ai-input">Job Description</Label>
                <Textarea
                  id="ai-input"
                  placeholder="e.g., We need a senior React developer for our fintech startup..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button 
                onClick={generateWithAI}
                disabled={generatingWithAI}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {generatingWithAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resume Analysis */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Resume-Based Generation</span>
              </CardTitle>
              <CardDescription>
                Upload a resume and AI will generate a suitable job posting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resume-upload">Upload Resume</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300 border-dashed rounded-md hover:border-green-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-green-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500">
                        <span>Upload a file</span>
                        <input
                          id="resume-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
                {resumeFile && (
                  <p className="mt-2 text-sm text-green-600">✓ {resumeFile.name}</p>
                )}
              </div>
              <Button 
                onClick={analyzeResumeWithAI}
                disabled={generatingWithAI || !resumeFile}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                {generatingWithAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate from Resume
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Creation */}
          <Card className="lg:col-span-2 border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-gray-600" />
                <span>Manual Creation</span>
              </CardTitle>
              <CardDescription>
                Create a job posting from scratch with full control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setStep(2)}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-gray-400"
              >
                <Plus className="mr-2 h-4 w-4" />
                Start Manual Creation
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Fill in the basic information about the position</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., San Francisco, CA or Remote"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Employment Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="experience_level">Experience Level</Label>
                  <select
                    id="experience_level"
                    value={formData.experience_level}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="entry-level">Entry Level</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior-level">Senior Level</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="salary_range">Salary Range</Label>
                  <Input
                    id="salary_range"
                    value={formData.salary_range}
                    onChange={(e) => handleInputChange('salary_range', e.target.value)}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Add the skills and qualifications needed for this role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentRequirement}
                  onChange={(e) => setCurrentRequirement(e.target.value)}
                  placeholder="Add a requirement..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{req}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeRequirement(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>Highlight what makes this opportunity attractive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={currentBenefit}
                  onChange={(e) => setCurrentBenefit(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                />
                <Button type="button" onClick={addBenefit}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.benefits.map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{benefit}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeBenefit(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              Back to Options
            </Button>
            <Button
              type="submit"
              disabled={createJobMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateJob;
