
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Building2, Globe, Users, Heart, Linkedin, Facebook, Twitter, Instagram, Plus, Trash2, Save, Loader2 } from "lucide-react";

const CompanyConfiguration = () => {
  const { companyName, companyDetails, loading, isPopulating } = useCompanyInfo();
  const [formData, setFormData] = useState({
    company_description: '',
    company_details: '',
    company_culture: '',
    company_values: [] as string[],
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: ''
  });
  const [newValue, setNewValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isPopulating) {
      fetchCompanyData();
    }
  }, [loading, isPopulating]);

  const fetchCompanyData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company-info`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          company_description: data.company_description || '',
          company_details: data.company_details || '',
          company_culture: data.company_culture || '',
          company_values: data.company_values || [],
          linkedin: data.linkedin || '',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/company-info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success("Company information updated successfully!");
      } else {
        toast.error("Failed to update company information");
      }
    } catch (error) {
      console.error('Error updating company data:', error);
      toast.error("Error updating company information");
    } finally {
      setIsSaving(false);
    }
  };

  const addValue = () => {
    if (newValue.trim() && !formData.company_values.includes(newValue.trim())) {
      setFormData(prev => ({
        ...prev,
        company_values: [...prev.company_values, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const removeValue = (valueToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      company_values: prev.company_values.filter(value => value !== valueToRemove)
    }));
  };

  if (loading || isPopulating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {isPopulating ? "Populating company data..." : "Loading..."}
          </h2>
          <p className="text-gray-600">
            {isPopulating ? "Our AI is gathering your company information" : "Please wait while we load your data"}
          </p>
        </motion.div>
      </div>
    );
  }

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Get to know {companyName}
          </h1>
          <p className="text-gray-600 text-lg">
            Configure your company profile to attract the best talent
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Building2 className="mr-3 h-6 w-6 text-blue-600" />
                  Basic Information
                </CardTitle>
                <p className="text-gray-600">Essential company details that will be displayed to candidates</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <Input
                    value={companyName}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Description</label>
                  <Input
                    value={formData.company_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_description: e.target.value }))}
                    placeholder="AI-powered recruitment platform revolutionizing the hiring process"
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Information</label>
                  <Textarea
                    value={formData.company_details}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_details: e.target.value }))}
                    placeholder="We are a cutting-edge technology company focused on transforming how companies find and hire top talent..."
                    className="min-h-[100px] border-gray-200 focus:border-blue-500 resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Culture & Values */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Heart className="mr-3 h-6 w-6 text-red-500" />
                  Culture & Values
                </CardTitle>
                <p className="text-gray-600">Define your company culture and core values</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Culture</label>
                  <Textarea
                    value={formData.company_culture}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_culture: e.target.value }))}
                    placeholder="Innovation-driven, collaborative, and results-oriented culture that values diversity, creativity, and continuous learning."
                    className="min-h-[80px] border-gray-200 focus:border-blue-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Core Values</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.company_values.map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge className="bg-blue-100 text-blue-800 px-3 py-1 flex items-center gap-2">
                          {value}
                          <button
                            onClick={() => removeValue(value)}
                            className="hover:bg-blue-200 rounded-full p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Add a new value"
                      className="border-gray-200 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && addValue()}
                    />
                    <Button onClick={addValue} size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Users className="mr-3 h-6 w-6 text-green-600" />
                  Social Media & Professional Links
                </CardTitle>
                <p className="text-gray-600">Connect your social media profiles and professional networks</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'linkedin', label: 'LinkedIn Profile', icon: Linkedin, color: 'text-blue-600' },
                  { key: 'twitter', label: 'Twitter/X Profile', icon: Twitter, color: 'text-sky-500' },
                  { key: 'instagram', label: 'Instagram Profile', icon: Instagram, color: 'text-pink-600' },
                  { key: 'facebook', label: 'Facebook Page', icon: Facebook, color: 'text-blue-800' }
                ].map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <Input
                        value={formData[key as keyof typeof formData] as string}
                        onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={`https://${key}.com/your-profile`}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Configuration
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CompanyConfiguration;
