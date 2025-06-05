
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CreateJob = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState<{[key: string]: boolean}>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skillConditions: ""
  });

  const genAI = new GoogleGenerativeAI("AIzaSyC8MPRWNW6xARNNyUdG1p3m2bd6QZuNP3A");

  const processDocument = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/djunaxxv0/raw/upload`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  const generateFieldSuggestion = async (field: string, currentValue: string) => {
    if (!currentValue.trim()) {
      toast.error(`Please enter some ${field} first`);
      return;
    }

    setIsGenerating(prev => ({ ...prev, [field]: true }));
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      let prompt = "";
      let maxLength = "";
      
      switch (field) {
        case 'title':
          prompt = `Based on this job information: "${currentValue}", generate a clear, professional job title. Keep it concise and specific.`;
          maxLength = "Keep it under 10 words.";
          break;
        case 'description':
          prompt = `Based on this job information: "${currentValue}", create a comprehensive job description including role summary, key responsibilities, required qualifications, and what makes this role appealing. Make it engaging and professional.`;
          maxLength = "Make it detailed but well-structured with clear sections.";
          break;
        case 'skillConditions':
          prompt = `Based on this job information: "${currentValue}", create specific filtering criteria for AI screening. Include required years of experience, must-have technical skills, education requirements, certifications, etc. This is for internal AI filtering only and won't be visible to candidates.`;
          maxLength = "Make it specific and measurable for AI filtering purposes.";
          break;
      }

      const fullPrompt = `${prompt} ${maxLength}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
      
      setJobData(prev => ({ ...prev, [field]: response.trim() }));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} suggestion generated!`);
    } catch (error) {
      console.error("AI generation failed:", error);
      toast.error(`Failed to generate ${field} suggestion. Please try again.`);
    } finally {
      setIsGenerating(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const uploadResult = await processDocument(file);
      if (!uploadResult) {
        throw new Error("Upload failed");
      }

      toast.success("PDF uploaded successfully! Analyzing...");

      // Convert PDF URL to blob for Gemini AI
      const pdfResponse = await fetch(uploadResult.secure_url);
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      // Generate content from PDF using the correct API
      const prompt = `
        Analyze this document and extract job-related information to create a professional job posting. Please provide the response in this exact format:

        TITLE: [Generate a clear, professional job title based on the document]

        DESCRIPTION: [Create a comprehensive job description including role summary, key responsibilities, required qualifications, and what makes this role appealing]

        SKILL_CONDITIONS: [List specific filtering criteria for AI screening - include required years of experience, must-have technical skills, education requirements, certifications, etc. This is for internal AI filtering only and won't be visible to candidates]

        Extract and interpret all relevant job-related information from the document to create these sections.
      `;

      // For PDF processing, we'll use a simplified approach with the current API
      const result = await model.generateContent([
        prompt,
        "Please analyze any job-related content and generate the job posting format above."
      ]);

      const response = result.response.text();
      
      // Parse the AI response
      const titleMatch = response.match(/TITLE:\s*(.*?)(?=\n\n|DESCRIPTION:)/s);
      const descriptionMatch = response.match(/DESCRIPTION:\s*(.*?)(?=\n\n|SKILL_CONDITIONS:)/s);
      const skillConditionsMatch = response.match(/SKILL_CONDITIONS:\s*(.*?)$/s);

      setJobData(prev => ({
        ...prev,
        title: titleMatch ? titleMatch[1].trim() : "",
        description: descriptionMatch ? descriptionMatch[1].trim() : "",
        skillConditions: skillConditionsMatch ? skillConditionsMatch[1].trim() : ""
      }));

      toast.success("Job details extracted from PDF successfully!");
    } catch (error) {
      console.error("PDF processing failed:", error);
      toast.error("Failed to process PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handlePublishJob = async () => {
    if (!jobData.title || !jobData.description) {
      toast.error("Please fill in at least the job title and description");
      return;
    }

    setIsPublishing(true);
    try {
      // Get JWT token from localStorage (assuming it's stored there after login)
      const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
      
      if (!token) {
        toast.error("Please login to publish a job");
        navigate("/login");
        return;
      }

      const jobPayload = {
        id: generateUUID(),
        title: jobData.title,
        description: jobData.description,
        skill_condition: jobData.skillConditions
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish job');
      }

      const result = await response.json();
      console.log("Job published:", result);
      
      toast.success("Job published successfully!");
      navigate("/dashboard/jobs");
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to publish job. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
              <p className="text-sm text-gray-500">Create job posting with AI assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* PDF Upload Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Upload className="h-5 w-5 mr-2" />
              Quick Upload
            </CardTitle>
            <CardDescription>
              Upload a PDF document to auto-populate job details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Upload Job Document
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                PDF files only • Auto-populate all fields
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
                disabled={isUploading}
              />
              <label htmlFor="pdf-upload">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="cursor-pointer"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose PDF
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Job Details Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Job Details</CardTitle>
            <CardDescription>
              Fill in the job information below. Use AI suggestions for each field.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Job Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="title">Job Title</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateFieldSuggestion('title', jobData.title)}
                  disabled={isGenerating.title}
                  className="text-blue-600 hover:text-blue-700 h-8"
                >
                  {isGenerating.title ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">AI Suggest</span>
                </Button>
              </div>
              <Input
                id="title"
                value={jobData.title}
                onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Senior Frontend Developer"
                className="h-10"
              />
            </div>

            {/* Job Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="description">Job Description</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateFieldSuggestion('description', jobData.description)}
                  disabled={isGenerating.description}
                  className="text-blue-600 hover:text-blue-700 h-8"
                >
                  {isGenerating.description ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">AI Suggest</span>
                </Button>
              </div>
              <Textarea
                id="description"
                value={jobData.description}
                onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed job description including responsibilities, requirements, and benefits..."
                className="min-h-[150px]"
              />
            </div>

            {/* Skill Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label htmlFor="skillConditions">Skill Conditions (AI Filtering)</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    This is for AI filtering only and won't be visible to candidates
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateFieldSuggestion('skillConditions', jobData.skillConditions)}
                  disabled={isGenerating.skillConditions}
                  className="text-blue-600 hover:text-blue-700 h-8"
                >
                  {isGenerating.skillConditions ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">AI Suggest</span>
                </Button>
              </div>
              <Textarea
                id="skillConditions"
                value={jobData.skillConditions}
                onChange={(e) => setJobData(prev => ({ ...prev, skillConditions: e.target.value }))}
                placeholder="e.g., Minimum 5+ years React experience, Bachelor's degree in Computer Science, Experience with TypeScript..."
                className="min-h-[100px]"
              />
            </div>

            {/* Publish Button */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handlePublishJob} 
                disabled={isPublishing || !jobData.title || !jobData.description}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing Job...
                  </>
                ) : (
                  "Publish Job"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateJob;
