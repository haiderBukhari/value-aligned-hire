
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkflowAnimation } from "@/components/WorkflowAnimation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [signUpData, setSignUpData] = useState({
    full_name: "",
    email: "",
    company_name: "",
    website_url: "",
    password: ""
  });

  const [emailError, setEmailError] = useState("");

  const validateCompanyEmail = (email: string) => {
    const personalDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'live.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (personalDomains.includes(domain)) {
      setEmailError("Please use your company email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignUpData(prev => ({ ...prev, email: value }));
    if (value) {
      validateCompanyEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCompanyEmail(signUpData.email)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://talo-recruitment.vercel.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user ID
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
        
        toast.success("Account created successfully!");
        navigate('/dashboard');
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Create Account
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500"
            >
              Join our AI recruitment platform
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-gray-700">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={signUpData.full_name}
                  onChange={(e) => setSignUpData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500 bg-white text-gray-800"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={signUpData.email}
                  onChange={handleEmailChange}
                  className={`border-gray-300 focus:border-blue-500 bg-white text-gray-800 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                  placeholder="your.name@company.com"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company_name" className="text-gray-700">Company Name</Label>
                <Input
                  id="company_name"
                  type="text"
                  value={signUpData.company_name}
                  onChange={(e) => setSignUpData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500 bg-white text-gray-800"
                  placeholder="Your company name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website_url" className="text-gray-700">Company Website</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={signUpData.website_url}
                  onChange={(e) => setSignUpData(prev => ({ ...prev, website_url: e.target.value }))}
                  className="border-gray-300 focus:border-blue-500 bg-white text-gray-800"
                  placeholder="https://www.yourcompany.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 bg-white text-gray-800 pr-10"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center mt-6 text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Workflow Animation */}
      <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI Recruitment Workflow
            </h2>
            <p className="text-gray-600">
              Watch how our intelligent system transforms hiring
            </p>
          </motion.div>
          
          <WorkflowAnimation />
        </div>
      </div>
    </div>
  );
};

export default Signup;
