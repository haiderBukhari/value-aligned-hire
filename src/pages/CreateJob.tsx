
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@/constants';
import { CheckCircle, Copy, Loader2 } from 'lucide-react';

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateJobDescription = async () => {
    if (!GEMINI_API_KEY) {
      toast({
        variant: "destructive",
        title: "API Key Missing",
        description: "Please set your VITE_GEMINI_API_KEY environment variable.",
      });
      return;
    }

    setIsGenerating(true);
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
      const prompt = `Create a job description for: ${jobTitle} at ${company}. 
        Requirements: ${requirements}
        Benefits: ${benefits}
        Additional context: ${additionalContext}
        
        Please provide a professional job description with sections for job summary, responsibilities, requirements, and benefits.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setGeneratedDescription(text);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error generating job description:", error);
      toast({
        variant: "destructive",
        title: "Error generating job description.",
        description: "Please try again.",
      })
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDescription);
    toast({
      title: "Copied!",
      description: "Job description copied to clipboard.",
    })
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Job Description</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List the job requirements"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea
              id="benefits"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="List the benefits"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="additionalContext">Additional Context</Label>
            <Textarea
              id="additionalContext"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional context or information"
            />
          </div>
          <Button onClick={generateJobDescription} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Job Description"
            )}
          </Button>
          {generatedDescription && (
            <div className="mt-4">
              <Label>Generated Job Description</Label>
              <Textarea
                value={generatedDescription}
                readOnly
                className="h-48 resize-none"
              />
              <Button variant="secondary" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
