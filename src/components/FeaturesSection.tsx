
import { BookOpen, Search, User, MessageSquare, Calendar, FileText } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze CVs, cover letters, and cultural fit to identify the perfect candidates for your organization."
    },
    {
      icon: BookOpen,
      title: "Company Profile Learning",
      description: "The platform learns your company's goals, values, and culture through structured inputs and document uploads."
    },
    {
      icon: FileText,
      title: "Smart Job Descriptions",
      description: "Generate contextually relevant and value-aligned job descriptions using AI based on role objectives."
    },
    {
      icon: User,
      title: "Comprehensive Candidate Analysis",
      description: "Parse and analyze resumes for qualifications, experience, soft skills, and cultural alignment."
    },
    {
      icon: MessageSquare,
      title: "AI Thought Space",
      description: "Private space for recruiters to record observations and instincts that refine future AI recommendations."
    },
    {
      icon: Calendar,
      title: "End-to-End Process Management",
      description: "Manage screening, interviews, assessments, and tasks all within one intelligent platform."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Intelligent Recruitment Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every feature is designed to enhance your hiring process while maintaining the human touch
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
