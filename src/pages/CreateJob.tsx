import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "");

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    salary: '',
    type: '',
    department: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateJobSuggestion = async () => {
    if (!jobData.title.trim()) {
      toast.error("Please enter a job title first");
      return;
    }

    setIsGenerating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const prompt = `
Create a comprehensive job description for the position "${jobData.title}" with the following structure:

1. Job Summary (2-3 sentences)
2. Key Responsibilities (5-7 bullet points)
3. Required Qualifications (4-6 bullet points)
4. Preferred Qualifications (3-4 bullet points)
5. What We Offer (3-4 bullet points about benefits and growth)

Make it professional, engaging, and specific to the role. Use clear, concise language that attracts qualified candidates.

Return only the job description content without any markdown formatting or code blocks.
`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      setJobData(prev => ({
        ...prev,
        description: text.trim()
      }));
      
      toast.success("Job description generated successfully!");
    } catch (error) {
      console.error("AI generation failed:", error);
      toast.error("Failed to generate job description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job Data:', jobData);
    toast.success("Job created successfully!");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader className="p-5">
          <CardTitle className="text-2xl font-bold">Create a New Job</CardTitle>
          <CardDescription>Fill in the details below to create a new job listing.</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title</Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={generateJobSuggestion}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Suggest Job Description"}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the job role and responsibilities"
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                placeholder="List the required skills and qualifications"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                name="responsibilities"
                value={jobData.responsibilities}
                onChange={handleChange}
                placeholder="Detail the job responsibilities"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input
                type="text"
                id="salary"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div>
              <Label htmlFor="type">Job Type</Label>
              <Input
                type="text"
                id="type"
                name="type"
                value={jobData.type}
                onChange={handleChange}
                placeholder="e.g., Full-time"
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                type="text"
                id="department"
                name="department"
                value={jobData.department}
                onChange={handleChange}
                placeholder="e.g., Engineering"
              />
            </div>

            <Button type="submit" className="w-full">Create Job</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
