
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Linkedin, Twitter, Instagram, Facebook, Save, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

  const handleSocialMediaChange = (platform: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [platform]: value
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
        body: JSON.stringify(companyData),
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading company information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Basic Information */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Essential company details that will be displayed to candidates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Enter company name"
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-description">Company Description</Label>
              <Textarea
                id="company-description"
                value={companyData.company_description}
                onChange={(e) => handleInputChange('company_description', e.target.value)}
                placeholder="Brief description of your company"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-details">Detailed Information</Label>
              <Textarea
                id="company-details"
                value={companyData.company_details}
                onChange={(e) => handleInputChange('company_details', e.target.value)}
                placeholder="Detailed information about your company"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="website"
                  value={companyData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Culture & Values */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Culture & Values</CardTitle>
            <CardDescription>
              Define your company culture and core values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-culture">Company Culture</Label>
              <Textarea
                id="company-culture"
                value={companyData.company_culture}
                onChange={(e) => handleInputChange('company_culture', e.target.value)}
                placeholder="Describe your company culture"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Core Values</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {companyData.company_values.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 flex items-center gap-2"
                  >
                    {value}
                    <button
                      onClick={() => removeValue(index)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Add a new value"
                  onKeyPress={(e) => e.key === 'Enter' && addValue()}
                />
                <Button onClick={addValue} size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media & Links */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Social Media & Professional Links</CardTitle>
            <CardDescription>
              Connect your social media profiles and professional networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                  <Input
                    id="linkedin"
                    value={companyData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/your-company"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Profile</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    id="twitter"
                    value={companyData.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourcompany"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Profile</Label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-3 h-4 w-4 text-pink-500" />
                  <Input
                    id="instagram"
                    value={companyData.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourcompany"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Page</Label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-3 h-4 w-4 text-blue-700" />
                  <Input
                    id="facebook"
                    value={companyData.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="https://facebook.com/yourcompany"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
};

export default CompanyConfiguration;
