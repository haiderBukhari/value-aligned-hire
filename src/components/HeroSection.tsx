
import { Button } from "@/components/ui/button";
import { HeroSection3D } from "./HeroSection3D";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-20 bg-white relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-20">
        <HeroSection3D />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl lg:text-7xl font-bold text-black leading-tight mb-8 tracking-tight"
          >
            The Future of Smart<br />
            <motion.span 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-gray-700"
            >
              AI Recruitment
            </motion.span><br />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              is here.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            Transform your hiring process with AI-powered recruitment that understands your company's values, 
            culture, and mission. Our intelligent system analyzes CVs, matches cultural fit, and streamlines 
            every stage from application to final decision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 text-lg font-medium rounded-sm">
                Start Free Trial
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white px-10 py-4 text-lg font-medium rounded-sm">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            {
              title: "AI-Powered Matching",
              description: "Advanced algorithms analyze CVs, cover letters, and cultural fit for perfect candidate identification."
            },
            {
              title: "Smart Company Learning",
              description: "Platform learns your organization's goals, values, and culture through intelligent inputs."
            },
            {
              title: "Intelligent Job Creation",
              description: "Generate contextually relevant job descriptions aligned with your company values."
            },
            {
              title: "Multi-Stage Evaluation",
              description: "Comprehensive scoring system with AI insights throughout the entire recruitment process."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                transition: { duration: 0.2 }
              }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 cursor-pointer"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className="w-12 h-12 bg-black rounded-sm mb-4"
              ></motion.div>
              <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
