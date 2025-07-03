
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image, Bold, Italic, Underline, List, ListOrdered, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateAssignment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    content: "",
    duration: "",
    deadline: "",
    instructions: "",
    resources: [] as string[],
    images: [] as string[]
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products");
    const response = await fetch("https://api.cloudinary.com/v1_1/djunaxxv0/raw/upload", {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file to Cloudinary");
    }
    const result = await response.json();
    return result.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setAssignment(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const insertTextFormat = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = assignment.content.substring(start, end);
    
    let formattedText = "";
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText || 'underlined text'}__`;
        break;
      case 'ul':
        formattedText = `\n- ${selectedText || 'list item'}`;
        break;
      case 'ol':
        formattedText = `\n1. ${selectedText || 'numbered item'}`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        break;
    }

    const newContent = assignment.content.substring(0, start) + formattedText + assignment.content.substring(end);
    setAssignment(prev => ({ ...prev, content: newContent }));
  };

  const removeImage = (index: number) => {
    setAssignment(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!assignment.title.trim() || !assignment.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in at least the title and content",
        variant: "destructive",
      });
      return;
    }

    if (!selectedResumeId) {
      toast({
        title: "Error",
        description: "Please select a candidate",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      // Prepare assignment details
      const assignmentDetails = {
        title: assignment.title,
        description: assignment.description,
        content: assignment.content,
        duration: assignment.duration,
        deadline: assignment.deadline,
        instructions: assignment.instructions,
        images: assignment.images,
        resources: assignment.resources
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assessments/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: selectedResumeId,
          details: assignmentDetails
        }),
      });

      if (!response.ok) throw new Error('Failed to create assignment');

      const result = await response.json();
      
      toast({
        title: "Success",
        description: result.message || "Assignment created and sent to candidate!",
      });
      
      navigate(-1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
        </div>

        <Card className="border border-gray-200 rounded-xl shadow-lg bg-white/95">
          <CardHeader>
            <CardTitle className="text-xl">Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Candidate Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Candidate *
              </label>
              <Input
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                placeholder="Enter candidate resume ID"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can get the resume ID from the candidate list
              </p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title *
                </label>
                <Input
                  value={assignment.title}
                  onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter assignment title"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <Input
                  value={assignment.duration}
                  onChange={(e) => setAssignment(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2 hours, 3 days"
                  className="w-full"
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <Input
                type="datetime-local"
                value={assignment.deadline}
                onChange={(e) => setAssignment(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={assignment.description}
                onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the assignment"
                className="w-full h-20"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Content *
              </label>
              
              {/* Formatting Toolbar */}
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-t-lg">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTextFormat('bold')}
                  className="h-8"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTextFormat('italic')}
                  className="h-8"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTextFormat('underline')}
                  className="h-8"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTextFormat('ul')}
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTextFormat('ol')}
                  className="h-8"
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertTextFormat('link')}
                  className="h-8"
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Content Textarea */}
              <Textarea
                id="content"
                value={assignment.content}
                onChange={(e) => setAssignment(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your assignment content here. Use the toolbar above for formatting."
                className="w-full h-64 rounded-t-none border-t-0 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                      <Image className="h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload Images"}
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
                
                {/* Image Preview */}
                {assignment.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {assignment.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Instructions
              </label>
              <Textarea
                value={assignment.instructions}
                onChange={(e) => setAssignment(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Any additional instructions for candidates"
                className="w-full h-24"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving || isUploading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Creating..." : "Create & Send Assignment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssignment;
