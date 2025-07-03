
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Image, FileText, Bold, Italic, Underline, List, ListOrdered, Link, Plus, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateAssignment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resume_id');
  
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    content: "",
    duration: "",
    deadline: "",
    instructions: "",
    resources: [] as string[],
    images: [] as string[],
    documents: [] as { name: string; url: string }[],
    questions: [] as { question: string; type: 'text' | 'file' | 'multiple_choice'; options?: string[] }[]
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const url = await uploadToCloudinary(file);
        return { name: file.name, url };
      });
      const uploadedDocs = await Promise.all(uploadPromises);
      
      setAssignment(prev => ({
        ...prev,
        documents: [...prev.documents, ...uploadedDocs]
      }));
      
      toast({
        title: "Success",
        description: `${uploadedDocs.length} document(s) uploaded successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload documents",
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

  const addQuestion = () => {
    setAssignment(prev => ({
      ...prev,
      questions: [...prev.questions, { question: "", type: "text" }]
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addOption = (questionIndex: number) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: [...(q.options || []), ""] }
          : q
      )
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.map((opt, oi) => oi === optionIndex ? value : opt) 
            }
          : q
      )
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.filter((_, oi) => oi !== optionIndex) 
            }
          : q
      )
    }));
  };

  const removeImage = (index: number) => {
    setAssignment(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeDocument = (index: number) => {
    setAssignment(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
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

    if (!resumeId) {
      toast({
        title: "Error",
        description: "Resume ID is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      const assignmentDetails = {
        title: assignment.title,
        description: assignment.description,
        content: assignment.content,
        duration: assignment.duration,
        deadline: assignment.deadline,
        instructions: assignment.instructions,
        images: assignment.images,
        documents: assignment.documents,
        questions: assignment.questions,
        resources: assignment.resources
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/assessments/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_id: resumeId,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-5xl mx-auto pt-8">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="hover:scale-110 transition-transform">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Assignment
            </h1>
            <p className="text-gray-600 mt-1">Design the perfect assessment for your candidate</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Assignment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Candidate Resume ID
                    </label>
                    <Input
                      value={resumeId || ""}
                      readOnly
                      className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-0"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Assignment Title *
                      </label>
                      <Input
                        value={assignment.title}
                        onChange={(e) => setAssignment(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter assignment title"
                        className="w-full border-2 border-indigo-100 focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration
                      </label>
                      <Input
                        value={assignment.duration}
                        onChange={(e) => setAssignment(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g., 2 hours, 3 days"
                        className="w-full border-2 border-indigo-100 focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deadline
                    </label>
                    <Input
                      type="datetime-local"
                      value={assignment.deadline}
                      onChange={(e) => setAssignment(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full border-2 border-indigo-100 focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={assignment.description}
                      onChange={(e) => setAssignment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the assignment"
                      className="w-full h-20 border-2 border-indigo-100 focus:border-indigo-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Content Editor Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="text-xl">Assignment Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-b">
                    {[
                      { icon: Bold, action: 'bold' },
                      { icon: Italic, action: 'italic' },
                      { icon: Underline, action: 'underline' },
                      { icon: List, action: 'ul' },
                      { icon: ListOrdered, action: 'ol' },
                      { icon: Link, action: 'link' }
                    ].map(({ icon: Icon, action }) => (
                      <Button
                        key={action}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertTextFormat(action)}
                        className="h-8 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                  
                  <Textarea
                    id="content"
                    value={assignment.content}
                    onChange={(e) => setAssignment(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your assignment content here..."
                    className="w-full h-64 border-0 resize-none focus:ring-0"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Questions Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="text-xl flex items-center justify-between">
                    Questions & Answers
                    <Button
                      onClick={addQuestion}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {assignment.questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No questions added yet. Click "Add Question" to get started.</p>
                    </div>
                  ) : (
                    assignment.questions.map((question, index) => (
                      <div key={index} className="p-4 border-2 border-emerald-100 rounded-lg bg-emerald-50/50">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-emerald-800">Question {index + 1}</h4>
                          <Button
                            onClick={() => removeQuestion(index)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            placeholder="Enter your question"
                            className="border-emerald-200 focus:border-emerald-400"
                          />
                          
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                            className="w-full p-2 border-2 border-emerald-200 rounded-md focus:border-emerald-400"
                          >
                            <option value="text">Text Answer</option>
                            <option value="file">File Upload</option>
                            <option value="multiple_choice">Multiple Choice</option>
                          </select>

                          {question.type === 'multiple_choice' && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-emerald-700">Options</label>
                                <Button
                                  onClick={() => addOption(index)}
                                  size="sm"
                                  variant="outline"
                                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Option
                                </Button>
                              </div>
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className="border-emerald-200 focus:border-emerald-400"
                                  />
                                  <Button
                                    onClick={() => removeOption(index, optionIndex)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Media Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
                  <CardTitle className="text-lg">Media & Documents</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-lg border-2 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all">
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
                    
                    {assignment.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {assignment.images.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Documents</label>
                    <label htmlFor="document-upload" className="cursor-pointer block">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 rounded-lg border-2 border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all">
                        <FileText className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Documents"}
                      </div>
                    </label>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    
                    {assignment.documents.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {assignment.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                            </div>
                            <button
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="text-lg">Additional Instructions</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Textarea
                    value={assignment.instructions}
                    onChange={(e) => setAssignment(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Any additional instructions for candidates..."
                    className="w-full h-24 border-2 border-amber-100 focus:border-amber-400"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Button 
                onClick={handleSave}
                disabled={isSaving || isUploading || !resumeId}
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Save className="h-5 w-5 mr-2" />
                {isSaving ? "Creating..." : "Create & Send Assignment"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                disabled={isSaving}
                className="w-full border-2 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;
