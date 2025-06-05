
import { motion } from "framer-motion";
import { RecruitmentFlow3D } from "./RecruitmentFlow3D";

export const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Company Profile Learning",
      description: "Upload documents or provide structured inputs to help AI understand your company's identity, goals, values, and cultural nuances for personalized hiring decisions."
    },
    {
      number: "02", 
      title: "Smart Job Description Creation",
      description: "Create job descriptions using AI generation or upload drafts for AI enhancement and value alignment based on specific role objectives and company culture."
    },
    {
      number: "03",
      title: "Intelligent Application Portal",
      description: "Candidates submit CVs and cover letters through our smart portal with value-fit assessments and self-introductions for comprehensive evaluation."
    },
    {
      number: "04",
      title: "AI-Powered Analysis & Scoring",
      description: "Advanced algorithms analyze qualifications, experience, cultural fit, and mission alignment with detailed multi-dimensional scoring metrics."
    },
    {
      number: "05",
      title: "Smart Candidate Shortlisting",
      description: "High-matching candidates are automatically presented with detailed explanations of why they're ideal fits for your specific organization."
    },
    {
      number: "06",
      title: "Structured Multi-Stage Evaluation",
      description: "Manage interviews, technical assessments, and take-home tasks with AI-powered scoring, insights, and performance tracking throughout the process."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-black mb-6 tracking-tight">
            How Our AI Recruitment Works
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience a seamless, intelligent hiring journey that transforms recruitment into a strategic, 
            values-driven process from company profiling to final hiring decisions.
          </p>
        </motion.div>

        {/* 3D Interactive Flow Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <RecruitmentFlow3D />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.2 }
              }}
              className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-100"
            >
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                viewport={{ once: true }}
                className="text-xl font-bold text-black mb-4"
              >
                {step.title}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
                viewport={{ once: true }}
                className="text-gray-600 leading-relaxed"
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
