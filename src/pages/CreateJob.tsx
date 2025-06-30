import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Briefcase, Users, MapPin, Clock, DollarSign, Plus, X, 
  FileText, Target, Star, CheckCircle, Calendar, Send 
} from "lucide-react";

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    experience: "",
    salary: "",
    description: "",
    responsibilities: [],
    requirements: [],
    benefits: [],
    skills: []
  });

  const [newItem, setNewItem] = useState({
    responsibility: "",
    requirement: "",
    benefit: "",
    skill: ""
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewItemChange = (field: string, value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = (field: string) => {
    let value;
    let newItemField;

    switch (field) {
      case 'responsibilities':
        value = newItem.responsibility;
        newItemField = 'responsibility';
        break;
      case 'requirements':
        value = newItem.requirement;
        newItemField = 'requirement';
        break;
      case 'benefits':
        value = newItem.benefit;
        newItemField = 'benefit';
        break;
      case 'skills':
        value = newItem.skill;
        newItemField = 'skill';
        break;
      default:
        return;
    }

    if (value.trim()) {
      setJobData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setNewItem(prev => ({
        ...prev,
        [newItemField]: ""
      }));
    }
  };

  const removeItem = (field: string, index: number) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        toast.success("Job created successfully!");
        setJobData({
          title: "",
          department: "",
          location: "",
          type: "",
          experience: "",
          salary: "",
          description: "",
          responsibilities: [],
          requirements: [],
          benefits: [],
          skills: []
        });
      } else {
        toast.error("Failed to create job");
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error("Error creating job");
    }
  };

  const generateJobDescription = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = {
        description: `We are seeking a talented ${jobData.title} to join our dynamic team. This role offers an exciting opportunity to work with cutting-edge technologies and contribute to innovative projects that make a real impact.`,
        responsibilities: [
          `Lead ${jobData.title.toLowerCase()} initiatives and projects`,
          "Collaborate with cross-functional teams",
          "Mentor junior team members",
          "Drive technical excellence and innovation"
        ],
        requirements: [
          `${jobData.experience} years of relevant experience`,
          "Strong problem-solving and analytical skills",
          "Excellent communication and teamwork abilities",
          "Bachelor's degree in relevant field"
        ],
        skills: [
          "Leadership",
          "Problem Solving",
          "Communication",
          "Technical Expertise"
        ]
      };

      setJobData(prev => ({
        ...prev,
        ...generatedContent
      }));

      toast.success("Job description generated successfully!");
    } catch (error) {
      toast.error("Failed to generate job description");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="shadow-lg rounded-lg">
        <CardHeader className="p-6">
          <CardTitle className="text-2xl font-semibold flex items-center">
            <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
            Create Job Posting
          </CardTitle>
          <CardDescription>
            Fill out the form below to create a new job posting.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">
                <FileText className="mr-2 h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="requirements">
                <Target className="mr-2 h-4 w-4" />
                Requirements
              </TabsTrigger>
              <TabsTrigger value="benefits">
                <Star className="mr-2 h-4 w-4" />
                Benefits
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    type="text"
                    id="title"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    type="text"
                    id="department"
                    value={jobData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="e.g., Engineering"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    type="text"
                    id="location"
                    value={jobData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Select onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" value={jobData.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    type="text"
                    id="experience"
                    value={jobData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="e.g., 3+ years"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    type="text"
                    id="salary"
                    value={jobData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the job in detail..."
                  rows={5}
                />
              </div>
              <Button 
                onClick={generateJobDescription} 
                disabled={isGenerating}
                className="bg-blue-500 text-white hover:bg-blue-700 font-medium"
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </TabsContent>
            <TabsContent value="requirements" className="space-y-4">
              <div className="space-y-2">
                <Label>Requirements</Label>
                {jobData.requirements.map((item, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {item}
                    <Button variant="ghost" size="sm" onClick={() => removeItem('requirements', index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Add a requirement"
                    value={newItem.requirement}
                    onChange={(e) => handleNewItemChange('requirement', e.target.value)}
                  />
                  <Button onClick={() => addItem('requirements')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="benefits" className="space-y-4">
              <div className="space-y-2">
                <Label>Benefits</Label>
                {jobData.benefits.map((item, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {item}
                    <Button variant="ghost" size="sm" onClick={() => removeItem('benefits', index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Add a benefit"
                    value={newItem.benefit}
                    onChange={(e) => handleNewItemChange('benefit', e.target.value)}
                  />
                  <Button onClick={() => addItem('benefits')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <Separator className="my-6" />
          <Button onClick={handleSubmit} className="bg-green-500 text-white hover:bg-green-700 font-medium">
            <CheckCircle className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
