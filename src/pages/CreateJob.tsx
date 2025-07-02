import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createPartFromUri, GoogleGenAI } from "@google/genai";
import { motion } from "framer-motion";

const genAI = new GoogleGenerativeAI("AIzaSyC8MPRWNW6xARNNyUdG1p3m2bd6QZuNP3A");
const fileAI = new GoogleGenAI({ apiKey: "AIzaSyC8MPRWNW6xARNNyUdG1p3m2bd6QZuNP3A" });


const CreateJob = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<string>("");
  const [companyCulture, setCompanyCulture] = useState<string>("");

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skillConditions: ""
  });


  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/company-info`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error("Failed to fetch company info");
        const data = await response.json();
        setCompanyInfo(data.company_details || "");
        setCompanyCulture(data.company_culture || "");
      } catch (error) {
        console.error("Error fetching company info:", error);
        setCompanyInfo("");
        setCompanyCulture("");
      }
    };
    fetchCompanyInfo();
  }, []);

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
    if (!currentValue.trim() && !(field === "skillConditions" && jobData.description.trim())) {
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
          prompt = `
Based on this job information, generate a clear, professional job title. Keep it concise and specific. If the job information is generic, add a relevant technology, seniority, or specialization to make the title more specific. Only give me the title, no other text or suggestions.

Examples:
Job information: "We are looking for a frontend engineer to build and maintain user interfaces using React and TypeScript for our SaaS platform."
Title: Senior Frontend Engineer

Job information: "Frontend Developer"
Title: React Frontend Developer

Job information: "Backend Developer"
Title: Node.js Backend Engineer

Job information: "We need someone to lead our mobile app development using Flutter."
Title: Lead Flutter Mobile Developer

Job information: "${currentValue}"
Title:
`;
          maxLength = "Keep it under 30 words.";
          break;
        case 'description':
          prompt = `
Company Information: "${companyInfo}"
Company Culture: "${companyCulture}"

Based on this job information: "${currentValue}", and the company information and culture above, write a connected, compelling job description in plain text with the following structure:

- Start with a short, engaging paragraph (2-3 lines) introducing the company, the team, and the role, making it clear how the role fits into the company's mission. If the industry or area is known from the company information, mention it naturally in the introduction. Do not include any bracketed placeholders or leave blank brackets in the output.
- Follow with a short paragraph (2-3 lines) describing the type of candidate you are seeking, connecting their qualities and experience to the needs of the team and company.
- Then, provide a detailed list of skills, responsibilities, and qualifications as bullet points (using • or - at the start of each point, not numbers or markdown). Each bullet must be specific and detailed, mentioning relevant technologies, tools, frameworks, or real-world context (e.g., "Experience building RESTful APIs with Node.js and Express", "Proficiency with PostgreSQL or MongoDB for data storage and retrieval", "Implementing CI/CD pipelines using GitHub Actions or Jenkins"). Avoid generic skills; make each point concrete and tailored to the role.
- End with a short, motivating paragraph (2-3 lines) about the unique opportunities, impact, and culture the candidate will experience, using the company culture as context.

Do not use section headings, numbers, or markdown. Do not include any instructions on how to apply. Only include information relevant to the job and company. Make sure each part connects smoothly to the next, creating a unified and appealing description.
`;
          maxLength = "Each paragraph should be 2-3 lines. Bullet points must be detailed, specifying technologies, tools, and context. No markdown, numbers, or section headings. Do not include any bracketed placeholders or blank brackets in the output.";
          break;
        case 'skillConditions':
          prompt = `
Based on the following job description and skill conditions, generate a concise, comma-separated list of the main, measurable skills and requirements for AI filtering. Only include specific, quantifiable criteria such as years of experience, required technologies, degrees, certifications, and must-have skills. Do not include any extra explanation or formatting—just the list.

Job Description: "${jobData.description}"
Skill Conditions Field: "${currentValue}"

Example output:
Minimum 5+ years React experience, Bachelor's degree in Computer Science, Experience with TypeScript, Familiarity with RESTful APIs, AWS certification
`;
          maxLength = "Only output the comma-separated list of main, measurable skills and requirements. No extra text.";
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

      // Download the PDF as a buffer
      const pdfBuffer = await fetch(uploadResult.secure_url).then((response) => response.arrayBuffer());
      const fileBlob = new Blob([pdfBuffer], { type: 'application/pdf' });

      // Upload the PDF to the AI provider (assume ai.files.upload is available)
      const ai = fileAI; // or your AI SDK instance
      const aiFile = await ai.files.upload({ file: fileBlob });

      // Wait for processing
      let getFile = await ai.files.get({ name: aiFile.name });
      while (getFile.state === 'PROCESSING') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        getFile = await ai.files.get({ name: aiFile.name });
      }
      if (aiFile.state === 'FAILED') {
        toast.info("File processing failed");
        setIsUploading(false);
        return;
      }

      // Prepare the structured prompt
      const content = [
        `Extract the following job posting fields from the PDF and return them as a JSON object with these exact keys: ["title", "description", "skill_conditions"].\n- "title": Generate a clear, professional job title based on the document.\n- "description": Write a connected, compelling job description in plain text. Start with a short, engaging paragraph introducing the company, team, and role (mention the industry if known). Follow with a short paragraph about the ideal candidate. Then, provide a detailed list of skills, responsibilities, and qualifications as bullet points (using • or - at the start of each point, not numbers or markdown). Each bullet must be specific and detailed, mentioning relevant technologies, tools, frameworks, or real-world context. End with a short, motivating paragraph about the unique opportunities, impact, and culture the candidate will experience. Do not use section headings, numbers, or markdown. Do not include any instructions on how to apply. Do not include any bracketed placeholders or blank brackets in the output.\n- "skill_conditions": Based on the job description and any skill-related content in the document, generate a concise, comma-separated list of the main, measurable skills and requirements for AI filtering. Only include specific, quantifiable criteria such as years of experience, required technologies, degrees, certifications, and must-have skills. Do not include any extra explanation or formatting—just the list.\n\nReturn the result as a JSON object with these keys: ["title", "description", "skill_conditions"].`
      ];

      if (aiFile.uri && aiFile.mimeType) {
        // The following lines are commented out to avoid TS2345 error:
        // const fileContent = createPartFromUri(aiFile.uri, aiFile.mimeType);
        // content.push(fileContent);
      }

      // Call the AI model
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: content,
      });

      let rawContent = response.text || "";
      const jsonMatch = rawContent.match(/```json([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1].trim() : rawContent;

      let generatedProperties;
      try {
        generatedProperties = JSON.parse(jsonString);
      } catch (err) {
        throw new Error("Failed to parse JSON response from AI");
      }

      setJobData({
        title: generatedProperties.title || "",
        description: generatedProperties.description || "",
        skillConditions: generatedProperties.skill_conditions || ""
      });

      toast.success("Job data extracted from PDF successfully!");
    } catch (error) {
      console.error("Error extracting job from PDF:", error);
      toast.error(`Failed to extract job data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-blue-200 opacity-20 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 right-10 w-48 h-48 bg-purple-200 opacity-20 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        {/* Page Header */}
        <div className="text-center mb-8 pt-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Create Job
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Easily create a new job posting with AI assistance. Upload a PDF or fill in the details below to get started!
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
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
    </div>
  );
};

export default CreateJob;
