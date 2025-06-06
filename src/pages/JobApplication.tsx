import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    cv_link: '',
    coverletter_link: ''
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  // Fetch job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('Job not found');
      }
      const data = await response.json();
      return data;
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
      setApplicationSubmitted(true);
    },
    onError: (error) => {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application');
    },
  });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "products"); // Change to your actual upload preset if needed

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <svg className="animate-spin h-14 w-14 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div className="text-xl font-semibold text-gray-800 mb-1">Loading job details...</div>
          <div className="text-sm text-gray-500">Please wait while we fetch the latest information for this position.</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-4 shadow-xl">
          <CardContent className="p-8 text-center">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Briefcase className="h-8 w-8 text-gray-900 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Talo HR</h1>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Details - Same for both active and inactive */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-fit shadow-xl border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {job.title}
                  </h2>
                  <div className={`px-3 py-1 rounded-full inline-block text-sm font-medium border ${
                    job.status === 'active' 
                      ? 'bg-green-100 text-green-800 border-green-300' 
                      : 'bg-orange-100 text-orange-800 border-orange-300'
                  }`}>
                    {job.status === 'active' ? 'Active Position' : 'Currently Inactive'}
                  </div>
                </div>
                
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Form or Inactive Message */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-xl border border-gray-200 bg-white">
              <CardContent className="p-8">
                {job.status === 'inactive' ? (
                  <div className="text-center">
                    <Briefcase className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Currently Inactive</h3>
                    <p className="text-gray-600 mb-6">
                      This position is not currently accepting applications. Please check back later or explore other opportunities.
                    </p>
                  </div>
                ) : (
                  applicationSubmitted ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                      <svg className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h3>
                      <p className="text-gray-700 text-center mb-4">Thank you for applying. We have received your application and will review it soon. You will be contacted if you are shortlisted for the next steps.</p>
                    </div>
                  ) : (
                    <>
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
                              className="pl-10 h-12 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
                              className="pl-10 h-12 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
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
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              {cvFile ? cvFile.name : 'Upload your CV/Resume'}
                            </p>
                            <Input
                              ref={cvInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'cv');
                              }}
                              className="hidden"
                              id="cv-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={uploading}
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              onClick={() => cvInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        </div>
                        {/* Cover Letter Upload */}
                        <div>
                          <Label className="text-gray-700 font-medium mb-2 block">
                            Cover Letter (Optional)
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors bg-gray-50">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              {coverLetterFile ? coverLetterFile.name : 'Upload your cover letter'}
                            </p>
                            <Input
                              ref={coverLetterInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, 'coverletter');
                              }}
                              className="hidden"
                              id="cover-letter-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={uploading}
                              className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              onClick={() => coverLetterInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Choose File
                            </Button>
                          </div>
                        </div>
                        {/* Submit Button */}
                        <Button
                          type="submit"
                          className="w-full h-12 bg-[#374151] hover:bg-[#2d343f] text-white font-semibold text-lg border-0"
                          disabled={submitApplicationMutation.isPending || uploading}
                        >
                          {submitApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </form>
                    </>
                  )
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
