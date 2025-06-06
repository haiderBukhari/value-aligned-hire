
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
          ? (latest / 1000000).toFixed(1) + 'M'
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
      number: "2.9M",
      label: "Jobs Processed Successfully",
      description: "AI-powered matching dramatically speeds up your recruitment process with precise candidate selection and cultural fit analysis"
    },
    {
      number: "85%",
      label: "Culture Fit Improvement", 
      description: "Values-based matching ensures better long-term employee satisfaction, retention rates, and team cohesion"
    },
    {
      number: "89%",
      label: "AI Accuracy Rate",
      description: "Smart filtering and AI analysis presents only the most relevant and qualified applicants for each specific role"
    }
  ];

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
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
            Why Choose Talo AI?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            See how our AI recruitment platform transforms hiring outcomes with data-driven insights, 
            intelligent candidate matching, and values-based selection processes.
          </p>
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
                transition: { duration: 0.3 }
              }}
              className="text-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800"
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
