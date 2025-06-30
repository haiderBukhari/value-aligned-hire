
import { motion } from "framer-motion";
import { WorkflowAnimation } from "./WorkflowAnimation";
import { PipelineShowcase } from "./PipelineShowcase";

export const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Configure Your Pipeline",
      description: "Set up your hiring stages with drag-and-drop simplicity. Define mandatory stages like Application Screening and Final Interview, while customizing optional stages to match your process."
    },
    {
      number: "02", 
      title: "AI-Powered Application Analysis",
      description: "Advanced algorithms automatically screen applications, analyzing CVs, cover letters, and cultural fit to identify top candidates with unprecedented accuracy."
    },
    {
      number: "03",
      title: "Smart Assessment Management",
      description: "Create and assign technical assessments with AI assistance. Track completion rates and automatically evaluate candidate performance against job requirements."
    },
    {
      number: "04",
      title: "Interview Intelligence",
      description: "Upload interview transcripts for AI analysis. Get detailed insights on candidate responses, communication skills, and alignment with company values."
    },
    {
      number: "05",
      title: "Talent Pool Analytics",
      description: "View comprehensive candidate performance across all stages. AI updates scores in real-time, providing actionable insights for better hiring decisions."
    },
    {
      number: "06",
      title: "Data-Driven Decisions",
      description: "Make confident hiring choices with complete candidate profiles, stage-by-stage analytics, and AI recommendations based on your company's success patterns."
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
            data-driven process from pipeline configuration to final hiring decisions.
          </p>
        </motion.div>

        {/* Pipeline Configuration Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <PipelineShowcase />
        </motion.div>

        <div className="max-w-[600px] mx-auto mb-20">
          <WorkflowAnimation />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
