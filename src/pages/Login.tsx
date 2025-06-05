
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowAnimation } from "@/components/WorkflowAnimation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    companyEmail: "",
    companyName: "",
    companyDetails: "",
    companyCulture: "",
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

  const handleSignUpEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignUpData(prev => ({ ...prev, companyEmail: value }));
    if (value) {
      validateCompanyEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCompanyEmail(signUpData.companyEmail)) {
      return;
    }
    console.log("Sign up attempt:", signUpData);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login/Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500"
            >
              {isSignUp ? "Join our AI recruitment platform" : "Access your AI recruitment dashboard"}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isSignUp ? (
              // Sign Up Form
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 bg-white text-gray-800"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyEmail" className="text-gray-700">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={signUpData.companyEmail}
                    onChange={handleSignUpEmailChange}
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
                  <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
                  <Input
                    id="companyName"
                    type="text"
                    value={signUpData.companyName}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 bg-white text-gray-800"
                    placeholder="Your company name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyDetails" className="text-gray-700">Company Details</Label>
                  <Textarea
                    id="companyDetails"
                    value={signUpData.companyDetails}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, companyDetails: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 bg-white text-gray-800 min-h-[80px]"
                    placeholder="Brief description of your company, industry, size..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyCulture" className="text-gray-700">Company Culture & Values</Label>
                  <Textarea
                    id="companyCulture"
                    value={signUpData.companyCulture}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, companyCulture: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 bg-white text-gray-800 min-h-[80px]"
                    placeholder="Describe your company culture, values, work environment..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signUpPassword" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="signUpPassword"
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

                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Create Account
                </Button>
              </form>
            ) : (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 bg-white text-gray-800"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 bg-white text-gray-800 pr-10"
                      placeholder="Enter your password"
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

                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Sign In
                </Button>

                <div className="text-center mt-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                    Forgot Password?
                  </a>
                </div>
              </form>
            )}

            <div className="text-center mt-6 text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
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

export default Login;
