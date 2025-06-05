
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, Mail, User, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

const JobApplication = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    cv_link: '',
    coverletter_link: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('Job not found');
      }
      const data = await response.json();
      return data.job;
    },
  });

  // Submit application mutation
  const submitApplicationMutation = useMutation({
    mutationFn: async (applicationData: typeof formData) => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          job_id: jobId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setFormData({
        applicant_name: '',
        email: '',
        cv_link: '',
        coverletter_link: ''
      });
      setCvFile(null);
      setCoverLetterFile(null);
    },
    onError: (error) => {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application');
    },
  });

  // Upload file to Cloudinary (placeholder function)
  const uploadToCloudinary = async (file: File): Promise<string> => {
    // This is a placeholder - you'll need to implement Cloudinary upload
    // For now, returning a dummy URL
    return `https://cloudinary.com/uploads/${file.name}`;
  };

  const handleFileUpload = async (file: File, type: 'cv' | 'coverletter') => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      if (type === 'cv') {
        setFormData(prev => ({ ...prev, cv_link: url }));
        setCvFile(file);
      } else {
        setFormData(prev => ({ ...prev, coverletter_link: url }));
        setCoverLetterFile(file);
      }
      toast.success(`${type === 'cv' ? 'CV' : 'Cover letter'} uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'cv' ? 'CV' : 'cover letter'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicant_name || !formData.email || !formData.cv_link) {
      toast.error('Please fill in all required fields');
      return;
    }
    submitApplicationMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
            <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (job.status === 'inactive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-16 w-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-4">{job.description}</p>
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full inline-block">
              Job is Currently Inactive
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Talo HR</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-fit shadow-lg border-0 bg-white">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {job.title}
                  </h2>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full inline-block text-sm font-medium">
                    Active Position
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0 bg-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Apply for this Position</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        value={formData.applicant_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">
                      CV/Resume *
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {cvFile ? cvFile.name : 'Upload your CV/Resume'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'cv');
                        }}
                        className="hidden"
                        id="cv-upload"
                      />
                      <Label htmlFor="cv-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" disabled={uploading}>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </Label>
                    </div>
                  </div>

                  {/* Cover Letter Upload */}
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">
                      Cover Letter (Optional)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        {coverLetterFile ? coverLetterFile.name : 'Upload your cover letter'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'coverletter');
                        }}
                        className="hidden"
                        id="cover-letter-upload"
                      />
                      <Label htmlFor="cover-letter-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm" disabled={uploading}>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                    disabled={submitApplicationMutation.isPending || uploading}
                  >
                    {submitApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
