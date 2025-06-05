
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Upload, 
  Search, 
  Users, 
  MessageSquare, 
  Award,
  CheckCircle 
} from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    title: "Job Creation",
    description: "AI helps create detailed job descriptions aligned with company culture",
    icon: FileText,
    color: "bg-blue-500",
    animation: "Create job posting with AI assistance"
  },
  {
    id: 2,
    title: "Resume Submission",
    description: "Candidates submit resumes through intelligent portal",
    icon: Upload,
    color: "bg-green-500",
    animation: "Candidates upload their resumes"
  },
  {
    id: 3,
    title: "AI Analysis",
    description: "Advanced algorithms analyze qualifications and cultural fit",
    icon: Search,
    color: "bg-purple-500",
    animation: "AI processes and evaluates all applications"
  },
  {
    id: 4,
    title: "Smart Filtering",
    description: "Filter top candidates based on skills and company culture match",
    icon: Users,
    color: "bg-orange-500",
    animation: "System identifies best-fit candidates"
  },
  {
    id: 5,
    title: "AI-Guided Interviews",
    description: "Conduct interviews with intelligent suggestions and insights",
    icon: MessageSquare,
    color: "bg-teal-500",
    animation: "Interview process with AI guidance"
  },
  {
    id: 6,
    title: "Skills Assessment",
    description: "Assign home tasks and technical evaluations",
    icon: Award,
    color: "bg-red-500",
    animation: "Candidates complete skill assessments"
  },
  {
    id: 7,
    title: "Final Decision",
    description: "AI evaluates all data and recommends final hiring decisions",
    icon: CheckCircle,
    color: "bg-indigo-500",
    animation: "Make data-driven hiring decisions"
  }
];

export const WorkflowAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentWorkflowStep = workflowSteps[currentStep];
  const IconComponent = currentWorkflowStep.icon;

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-96 flex flex-col">
      {/* Progress Indicators */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2">
          {workflowSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? "bg-white" : "bg-gray-600"
              }`}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                opacity: index === currentStep ? 1 : 0.5
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Main Animation Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              className={`${currentWorkflowStep.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </motion.div>

            {/* Step Number */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-400 mb-2"
            >
              Step {currentStep + 1} of {workflowSteps.length}
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-bold text-white mb-2"
            >
              {currentWorkflowStep.title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-sm max-w-xs"
            >
              {currentWorkflowStep.description}
            </motion.p>

            {/* Animation Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xs text-blue-400 italic"
            >
              {currentWorkflowStep.animation}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mini Timeline */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Job Creation</span>
          <span>AI Analysis</span>
          <span>Final Decision</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
          <motion.div
            className="bg-blue-500 h-1 rounded-full"
            animate={{
              width: `${((currentStep + 1) / workflowSteps.length) * 100}%`
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
