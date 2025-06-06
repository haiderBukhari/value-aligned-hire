import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Briefcase, MapPin, DollarSign, Clock, Users, Sparkles, 
  Plus, X, Building2, Calendar, Target, Zap, Save, Eye, 
  Globe, Linkedin, Twitter, Instagram 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateJob = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  
  const [jobData, setJobData] = useState({
    title: "",
    company: "Talo Technologies",
    location: "",
    type: "",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [] as string[],
    department: "",
    reportingTo: "",
    teamSize: "",
    workModel: "",
    urgency: "medium",
    applicationDeadline: "",
    startDate: "",
    perks: [] as string[],
    aiScreening: true,
    autoResponse: true,
    skillAssessment: false,
    videoInterview: false
  });

  const [newSkill, setNewSkill] = useState("");
  const [newPerk, setNewPerk] = useState("");

  const predefinedSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", 
    "SQL", "MongoDB", "AWS", "Docker", "Git", "Agile", "Scrum"
  ];

  const predefinedPerks = [
    "Health Insurance", "Dental Coverage", "Vision Insurance", "401k Matching",
    "Flexible Hours", "Remote Work", "Paid Time Off", "Professional Development",
    "Gym Membership", "Free Lunch", "Stock Options", "Maternity Leave"
  ];

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setJobData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !jobData.skills.includes(skill)) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addPerk = (perk: string) => {
    if (perk && !jobData.perks.includes(perk)) {
      setJobData(prev => ({
        ...prev,
        perks: [...prev.perks, perk]
      }));
      setNewPerk("");
    }
  };

  const removePerk = (perkToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      perks: prev.perks.filter(perk => perk !== perkToRemove)
    }));
  };

  const generateWithAI = async (field: string) => {
    if (!jobData.title) {
      toast({
        title: "Missing Information",
        description: "Please enter a job title first to generate AI content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      let prompt = "";
      switch (field) {
        case "description":
          prompt = `Write a compelling job description for a ${jobData.title} position at ${jobData.company}. Include key responsibilities, what makes this role exciting, and the impact they'll have. Keep it professional but engaging.`;
          break;
        case "requirements":
          prompt = `List the key requirements for a ${jobData.title} position. Include education, experience, technical skills, and soft skills. Format as bullet points.`;
          break;
        case "benefits":
          prompt = `Write an attractive benefits section for a ${jobData.title} position at a modern tech company. Include compensation philosophy, health benefits, work-life balance, and growth opportunities.`;
          break;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      handleInputChange(field, text);
      
      toast({
        title: "AI Content Generated",
        description: `Successfully generated ${field} content.`,
      });
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveJob = () => {
    // Here you would typically save to a backend
    toast({
      title: "Job Created Successfully",
      description: `"${jobData.title}" has been posted and is now live.`,
    });
  };

  const handlePreview = () => {
    // Here you would typically open a preview modal
    toast({
      title: "Preview Mode",
      description: "Opening job preview...",
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
            <p className="text-gray-600">Post a new position with AI assistance</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSaveJob} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Save className="mr-2 h-4 w-4" />
            Save & Publish
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Basics</CardTitle>
                <CardDescription>Essential information about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Senior Frontend Developer"
                    className="font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={jobData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={jobData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workModel">Work Model</Label>
                    <Select value={jobData.workModel} onValueChange={(value) => handleInputChange('workModel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select value={jobData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select value={jobData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                        <SelectItem value="senior">Senior Level (5-8 years)</SelectItem>
                        <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={jobData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g. $80,000 - $120,000 per year"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timeline & Team</CardTitle>
                <CardDescription>When and who they'll work with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Preferred Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={jobData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={jobData.applicationDeadline}
                    onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportingTo">Reports To</Label>
                  <Input
                    id="reportingTo"
                    value={jobData.reportingTo}
                    onChange={(e) => handleInputChange('reportingTo', e.target.value)}
                    placeholder="e.g. VP of Engineering"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select value={jobData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="11-20">11-20 people</SelectItem>
                      <SelectItem value="20+">20+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Urgency Level</Label>
                  <Select value={jobData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Standard hiring</SelectItem>
                      <SelectItem value="medium">Medium - Preferred timing</SelectItem>
                      <SelectItem value="high">High - Urgent need</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Job Details */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>Describe the responsibilities and day-to-day tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <div className="flex items-center justify-end mb-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => generateWithAI('description')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the job role and responsibilities"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Perks</CardTitle>
              <CardDescription>Highlight the required skills and offered benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {jobData.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 flex items-center gap-2">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(newSkill);
                        e.preventDefault();
                      }
                    }}
                  />
                  <Button onClick={() => addSkill(newSkill)} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {predefinedSkills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Popular Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {predefinedSkills.map(skill => (
                        <Badge key={skill} variant="ghost" className="text-blue-500 hover:bg-blue-50 cursor-pointer" onClick={() => addSkill(skill)}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Company Perks</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {jobData.perks.map(perk => (
                    <Badge key={perk} variant="secondary" className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 flex items-center gap-2">
                      {perk}
                      <button onClick={() => removePerk(perk)} className="hover:bg-green-200 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newPerk}
                    onChange={(e) => setNewPerk(e.target.value)}
                    placeholder="Add a new perk"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addPerk(newPerk);
                        e.preventDefault();
                      }
                    }}
                  />
                  <Button onClick={() => addPerk(newPerk)} size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {predefinedPerks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Popular Perks:</p>
                    <div className="flex flex-wrap gap-2">
                      {predefinedPerks.map(perk => (
                        <Badge key={perk} variant="ghost" className="text-green-500 hover:bg-green-50 cursor-pointer" onClick={() => addPerk(perk)}>
                          {perk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requirements */}
        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Requirements</CardTitle>
              <CardDescription>Specify the qualifications and expectations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Job Requirements</Label>
                <div className="flex items-center justify-end mb-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => generateWithAI('requirements')}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the required skills, experience, and qualifications"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure how applications are processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="aiScreening">AI Screening</Label>
                <Switch
                  id="aiScreening"
                  checked={jobData.aiScreening}
                  onCheckedChange={(checked) => handleInputChange('aiScreening', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoResponse">Automated Response</Label>
                <Switch
                  id="autoResponse"
                  checked={jobData.autoResponse}
                  onCheckedChange={(checked) => handleInputChange('autoResponse', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="skillAssessment">Skill Assessment</Label>
                <Switch
                  id="skillAssessment"
                  checked={jobData.skillAssessment}
                  onCheckedChange={(checked) => handleInputChange('skillAssessment', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="videoInterview">Video Interview</Label>
                <Switch
                  id="videoInterview"
                  checked={jobData.videoInterview}
                  onCheckedChange={(checked) => handleInputChange('videoInterview', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateJob;
