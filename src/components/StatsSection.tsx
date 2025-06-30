
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedCounter = ({ value, duration = 2 }: { value: string; duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
      motionValue.set(numericValue);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const suffix = value.includes('%') ? '%' : value.includes('M') ? 'M' : '';
        const formattedValue = value.includes('M') 
          ? (latest / 10).toFixed(1) + 'M'
          : value.includes('%')
          ? Math.round(latest) + '%'
          : Math.round(latest).toString();
        ref.current.textContent = formattedValue;
      }
    });
    return unsubscribe;
  }, [springValue, value]);

  return <span ref={ref}>{value}</span>;
};

export const StatsSection = () => {
  const stats = [
    {
      number: "0.2M",
      label: "Jobs Processed Successfully",
      description: "AI-powered matching dramatically speeds up your recruitment process with precise candidate selection and cultural fit analysis"
    },
    {
      number: "95%",
      label: "Company Culture Match Accuracy", 
      description: "Our AI extracts company culture and values from your website URL to rank candidates based on cultural alignment"
    },
    {
      number: "100%",
      label: "AI Interview Analysis Accuracy",
      description: "Smart filtering and AI analysis presents only the most relevant and qualified applicants for each specific role"
    }
  ];

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            animate={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            transition={{ 
              duration: Math.random() * 20 + 15, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            AI-Powered Recruitment Excellence
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our AI extracts company details and culture from your website URL, then ranks candidates using 
            a comprehensive scoring system: 60% experience, 20% skills, 10% company fit, and 10% culture alignment.
          </p>
        </motion.div>

        {/* Scoring Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { label: "Experience Score", percentage: "60%", color: "bg-blue-500" },
            { label: "Skills Score", percentage: "20%", color: "bg-green-500" },
            { label: "Company Fit", percentage: "10%", color: "bg-purple-500" },
            { label: "Culture Fit", percentage: "10%", color: "bg-orange-500" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center"
            >
              <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl font-bold text-white">{item.percentage}</span>
              </div>
              <h4 className="text-lg font-semibold text-white">{item.label}</h4>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                transition: { duration: 0.3 }
              }}
              className="text-center p-8 bg-gradient-to-br from-gray-900/70 to-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl"
            >
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1, delay: index * 0.2 + 0.3, type: "spring" }}
                viewport={{ once: true }}
                className="text-6xl font-bold mb-4 text-white"
              >
                <AnimatedCounter value={stat.number} />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.6 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold mb-4 text-white"
              >
                {stat.label}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
                viewport={{ once: true }}
                className="text-gray-300 leading-relaxed text-lg"
              >
                {stat.description}
              </motion.p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
