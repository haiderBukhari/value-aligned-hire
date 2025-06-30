
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Linkedin, Twitter, Instagram, Facebook, Save, Plus, X, Loader2, Sparkles, Users, Heart, Target } from "lucide-react";
import { toast } from "sonner";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

interface CompanyData {
  company_name: string;
  company_description: string;
  company_details: string;
  company_culture: string;
  company_values: string[];
  website_url: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
}

const CompanyConfiguration = () => {
  const { companyName } = useCompanyInfo();
  const [companyData, setCompanyData] = useState<CompanyData>({
    company_name: "",
    company_description: "",
    company_details: "",
    company_culture: "",
    company_values: [],
    website_url: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: ""
  });

  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
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
          setCompanyData({
            company_name: data.company_name || "",
            company_description: data.company_description || "",
            company_details: data.company_details || "",
            company_culture: data.company_culture || "",
            company_values: data.company_values || [],
            website_url: data.website_url || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            instagram: data.instagram || "",
            facebook: data.facebook || ""
          });
        } else {
          toast.error("Failed to fetch company information");
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
        toast.error("Error loading company information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addValue = () => {
    if (newValue.trim()) {
      setCompanyData(prev => ({
        ...prev,
        company_values: [...prev.company_values, newValue.trim()]
      }));
      setNewValue("");
    }
  };

  const removeValue = (index: number) => {
    setCompanyData(prev => ({
      ...prev,
      company_values: prev.company_values.filter((_, i) => i !== index)
    }));
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
        body: JSON.stringify({
          company_description: companyData.company_description,
          company_details: companyData.company_details,
          company_culture: companyData.company_culture,
          company_values: companyData.company_values,
          linkedin: companyData.linkedin,
          facebook: companyData.facebook,
          twitter: companyData.twitter,
          instagram: companyData.instagram
        }),
      });

      if (response.ok) {
        toast.success("Company configuration saved successfully!");
      } else {
        toast.error("Failed to save company configuration");
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error("Error saving company configuration");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-purple-500 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading company information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 space-y-8 p-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Get to know {companyData.company_name || companyName}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Shape your company's identity and culture to attract the perfect candidates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Company Information */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/80 border-0 shadow-lg animate-scale-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                Company Information
              </CardTitle>
              <CardDescription>
                Essential details that define your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-sm font-semibold text-gray-700">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyData.company_name}
                  readOnly
                  className="font-medium bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description" className="text-sm font-semibold text-gray-700">Company Description</Label>
                <Textarea
                  id="company-description"
                  value={companyData.company_description}
                  onChange={(e) => handleInputChange('company_description', e.target.value)}
                  placeholder="Brief description of your company"
                  rows={3}
                  className="resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-details" className="text-sm font-semibold text-gray-700">Detailed Information</Label>
                <Textarea
                  id="company-details"
                  value={companyData.company_details}
                  onChange={(e) => handleInputChange('company_details', e.target.value)}
                  placeholder="Detailed information about your company"
                  rows={4}
                  className="resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold text-gray-700">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    value={companyData.website_url}
                    readOnly
                    className="pl-10 bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Culture & Values */}
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/80 border-0 shadow-lg animate-scale-in animation-delay-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                Culture & Values
              </CardTitle>
              <CardDescription>
                Define what makes your company unique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-culture" className="text-sm font-semibold text-gray-700">Company Culture</Label>
                <Textarea
                  id="company-culture"
                  value={companyData.company_culture}
                  onChange={(e) => handleInputChange('company_culture', e.target.value)}
                  placeholder="Describe your company culture"
                  rows={4}
                  className="resize-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-600" />
                  Core Values
                </Label>
                <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] p-3 border border-gray-200 rounded-lg bg-gray-50">
                  {companyData.company_values.map((value, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-3 py-1 flex items-center gap-2 hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                    >
                      {value}
                      <button
                        onClick={() => removeValue(index)}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {companyData.company_values.length === 0 && (
                    <span className="text-gray-400 text-sm">No values added yet</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Add a new value"
                    onKeyPress={(e) => e.key === 'Enter' && addValue()}
                    className="flex-1 focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                  <Button 
                    onClick={addValue} 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transform hover:scale-105 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Links */}
          <Card className="lg:col-span-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/80 border-0 shadow-lg animate-scale-in animation-delay-400">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                Social Media & Professional Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles and professional networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700">LinkedIn Profile</Label>
                  <div className="relative group">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-blue-600 group-focus-within:scale-110 transition-transform" />
                    <Input
                      id="linkedin"
                      value={companyData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/your-company"
                      className="pl-10 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm font-semibold text-gray-700">Twitter/X Profile</Label>
                  <div className="relative group">
                    <Twitter className="absolute left-3 top-3 h-4 w-4 text-sky-500 group-focus-within:scale-110 transition-transform" />
                    <Input
                      id="twitter"
                      value={companyData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/yourcompany"
                      className="pl-10 focus:ring-2 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm font-semibold text-gray-700">Instagram Profile</Label>
                  <div className="relative group">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-pink-500 group-focus-within:scale-110 transition-transform" />
                    <Input
                      id="instagram"
                      value={companyData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/yourcompany"
                      className="pl-10 focus:ring-2 focus:ring-pink-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook" className="text-sm font-semibold text-gray-700">Facebook Page</Label>
                  <div className="relative group">
                    <Facebook className="absolute left-3 top-3 h-4 w-4 text-blue-700 group-focus-within:scale-110 transition-transform" />
                    <Input
                      id="facebook"
                      value={companyData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/yourcompany"
                      className="pl-10 focus:ring-2 focus:ring-blue-700 transition-all"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-3 h-5 w-5" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default CompanyConfiguration;
