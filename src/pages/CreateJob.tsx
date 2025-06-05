
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Wand2, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CreateJob = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("manual");
  
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skillConditions: "",
    requirements: ""
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

  const generateFromText = async () => {
    if (!jobData.requirements.trim()) {
      toast.error("Please enter job requirements first");
      return;
    }

    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const prompt = `
        Based on the following job requirements, generate a professional job posting with these specific sections:

        Job Requirements: "${jobData.requirements}"

        Please provide the response in this exact format:

        TITLE: [Generate a clear, professional job title]

        DESCRIPTION: [Write a comprehensive job description including company overview, role summary, key responsibilities, and what makes this role exciting]

        SKILL_CONDITIONS: [List specific filtering criteria for AI screening - include required years of experience, must-have technical skills, education requirements, certifications, etc. This is for internal AI filtering only and won't be visible to candidates]

        Make sure each section is detailed and professional. The skill conditions should be very specific for AI filtering purposes.
      `;

      const result = await model.generateContent(prompt);
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

      toast.success("Job details generated successfully!");
    } catch (error) {
      console.error("AI generation failed:", error);
      toast.error("Failed to generate job details. Please try again.");
    } finally {
      setIsGenerating(false);
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

      // Upload file to Gemini AI
      const uploadedFile = await model.uploadFile(fileBlob, {
        displayName: file.name,
      });

      // Wait for file processing
      let fileStatus = await model.getFile(uploadedFile.name);
      while (fileStatus.state === 'PROCESSING') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        fileStatus = await model.getFile(uploadedFile.name);
        console.log(`File processing status: ${fileStatus.state}`);
      }

      if (fileStatus.state === 'FAILED') {
        throw new Error('File processing failed');
      }

      // Generate content from PDF
      const prompt = `
        Analyze this document and extract job-related information to create a professional job posting. Please provide the response in this exact format:

        TITLE: [Generate a clear, professional job title based on the document]

        DESCRIPTION: [Create a comprehensive job description including role summary, key responsibilities, required qualifications, and what makes this role appealing]

        SKILL_CONDITIONS: [List specific filtering criteria for AI screening - include required years of experience, must-have technical skills, education requirements, certifications, etc. This is for internal AI filtering only and won't be visible to candidates]

        Extract and interpret all relevant job-related information from the document to create these sections.
      `;

      const result = await model.generateContent([
        prompt,
        {
          fileData: {
            fileUri: uploadedFile.uri,
            mimeType: uploadedFile.mimeType,
          },
        },
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

  const handleSaveJob = () => {
    if (!jobData.title || !jobData.description) {
      toast.error("Please fill in at least the job title and description");
      return;
    }

    // Here you would typically save to your backend
    console.log("Saving job:", jobData);
    toast.success("Job created successfully!");
    navigate("/dashboard/jobs");
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
              <p className="text-sm text-gray-500">Use AI to generate job details or create manually</p>
            </div>
          </div>
          <Button onClick={handleSaveJob} className="bg-blue-600 hover:bg-blue-700">
            Save Job
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Creation</TabsTrigger>
            <TabsTrigger value="ai-text">AI from Text</TabsTrigger>
            <TabsTrigger value="pdf-upload">PDF Upload</TabsTrigger>
          </TabsList>

          {/* Manual Creation Tab */}
          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Manual Job Creation
                </CardTitle>
                <CardDescription>
                  Create your job posting from scratch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={jobData.description}
                    onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed job description including responsibilities, requirements, and benefits..."
                    className="min-h-[200px]"
                  />
                </div>
                <div>
                  <Label htmlFor="skillConditions">
                    Skill Conditions (AI Filtering)
                    <span className="text-xs text-gray-500 block">
                      This is for AI filtering only and won't be visible to candidates
                    </span>
                  </Label>
                  <Textarea
                    id="skillConditions"
                    value={jobData.skillConditions}
                    onChange={(e) => setJobData(prev => ({ ...prev, skillConditions: e.target.value }))}
                    placeholder="e.g., Minimum 5 years React experience, Bachelor's degree in Computer Science, Experience with TypeScript..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI from Text Tab */}
          <TabsContent value="ai-text" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="h-5 w-5 mr-2" />
                  AI-Powered Job Generation
                </CardTitle>
                <CardDescription>
                  Describe your requirements and let AI create the job posting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="requirements">Job Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={jobData.requirements}
                    onChange={(e) => setJobData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Describe what you're looking for: role type, experience level, key skills, team size, etc..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button 
                  onClick={generateFromText} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Job Details
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content Preview */}
            {(jobData.title || jobData.description || jobData.skillConditions) && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Job Details</CardTitle>
                  <CardDescription>Review and edit the AI-generated content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="gen-title">Job Title</Label>
                    <Input
                      id="gen-title"
                      value={jobData.title}
                      onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gen-description">Job Description</Label>
                    <Textarea
                      id="gen-description"
                      value={jobData.description}
                      onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[200px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gen-skillConditions">Skill Conditions (AI Filtering)</Label>
                    <Textarea
                      id="gen-skillConditions"
                      value={jobData.skillConditions}
                      onChange={(e) => setJobData(prev => ({ ...prev, skillConditions: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* PDF Upload Tab */}
          <TabsContent value="pdf-upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Job Document
                </CardTitle>
                <CardDescription>
                  Upload a PDF document and let AI extract job details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload PDF Document
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Upload a job description, requirements document, or any PDF with job-related information
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
                            Choose PDF File
                          </>
                        )}
                      </span>
                    </Button>
                  </label>
                </div>

                {/* Extracted Content Preview */}
                {(jobData.title || jobData.description || jobData.skillConditions) && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Extracted Job Details</h3>
                    <div>
                      <Label htmlFor="pdf-title">Job Title</Label>
                      <Input
                        id="pdf-title"
                        value={jobData.title}
                        onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pdf-description">Job Description</Label>
                      <Textarea
                        id="pdf-description"
                        value={jobData.description}
                        onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pdf-skillConditions">Skill Conditions (AI Filtering)</Label>
                      <Textarea
                        id="pdf-skillConditions"
                        value={jobData.skillConditions}
                        onChange={(e) => setJobData(prev => ({ ...prev, skillConditions: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateJob;
