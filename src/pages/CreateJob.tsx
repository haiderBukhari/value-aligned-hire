import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, MapPin, Users, Clock, DollarSign, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google-generative-ai";

const CreateJob = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    department: "",
    experience_level: "",
    salary_range: "",
    description: "",
    requirements: "",
    company_description: "",
    company_values: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      toast.success('Job created successfully!');
      navigate('/dashboard/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateJobDescription = async () => {
    if (!formData.title) {
      toast.error('Please enter a job title first');
      return;
    }

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate a comprehensive job description for a ${formData.title} position. Include:
      1. A compelling job summary (2-3 sentences)
      2. Key responsibilities (5-7 bullet points)
      3. Required qualifications and skills
      4. Preferred qualifications
      5. What we offer/benefits

      Make it professional, engaging, and suitable for attracting top talent.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setFormData(prev => ({
        ...prev,
        description: text
      }));

      toast.success('Job description generated successfully!');
    } catch (error) {
      console.error('Error generating job description:', error);
      toast.error('Failed to generate job description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/jobs')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        {/* Create Job Card */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create a New Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Title */}
              <div>
                <Label htmlFor="title" className="text-gray-700">
                  Job Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="e.g., Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-gray-700">
                  Location
                </Label>
                <Input
                  type="text"
                  id="location"
                  placeholder="e.g., New York, NY"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department" className="text-gray-700">
                  Department
                </Label>
                <Input
                  type="text"
                  id="department"
                  placeholder="e.g., Engineering"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              </div>

              {/* Experience Level */}
              <div>
                <Label htmlFor="experience_level" className="text-gray-700">
                  Experience Level
                </Label>
                <Input
                  type="text"
                  id="experience_level"
                  placeholder="e.g., Mid-Level"
                  value={formData.experience_level}
                  onChange={(e) => handleInputChange('experience_level', e.target.value)}
                />
              </div>

              {/* Salary Range */}
              <div>
                <Label htmlFor="salary_range" className="text-gray-700">
                  Salary Range
                </Label>
                <Input
                  type="text"
                  id="salary_range"
                  placeholder="e.g., $80,000 - $120,000"
                  value={formData.salary_range}
                  onChange={(e) => handleInputChange('salary_range', e.target.value)}
                />
              </div>

              {/* Job Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Job Description
                  </Label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={generateJobDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the job responsibilities and requirements"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements" className="text-gray-700">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="List the job requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                />
              </div>

              {/* Company Description */}
              <div>
                <Label htmlFor="company_description" className="text-gray-700">
                  Company Description
                </Label>
                <Textarea
                  id="company_description"
                  placeholder="Describe your company"
                  rows={3}
                  value={formData.company_description}
                  onChange={(e) => handleInputChange('company_description', e.target.value)}
                />
              </div>

              {/* Company Values */}
              <div>
                <Label htmlFor="company_values" className="text-gray-700">
                  Company Values
                </Label>
                <Textarea
                  id="company_values"
                  placeholder="List your company values"
                  rows={3}
                  value={formData.company_values}
                  onChange={(e) => handleInputChange('company_values', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-t-2 border-white mr-2"></div>
                    Creating Job...
                  </>
                ) : (
                  "Create Job"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CreateJob;
