
export const ProcessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Company Profile Setup",
      description: "Upload documents or provide structured inputs to help AI understand your company's identity, goals, and culture."
    },
    {
      number: "02",
      title: "Smart Job Creation",
      description: "Create job descriptions using AI generation or upload drafts for AI enhancement and value alignment."
    },
    {
      number: "03",
      title: "Candidate Application",
      description: "Candidates submit CVs and cover letters through our smart portal with value-fit assessments."
    },
    {
      number: "04",
      title: "AI Analysis & Scoring",
      description: "Advanced algorithms analyze qualifications, experience, cultural fit, and mission alignment."
    },
    {
      number: "05",
      title: "Intelligent Shortlisting",
      description: "High-matching candidates are presented with detailed explanations of why they're ideal fits."
    },
    {
      number: "06",
      title: "Structured Evaluation",
      description: "Manage interviews, assessments, and tasks with AI-powered scoring and insights throughout."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How Our AI Recruitment Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A seamless, intelligent hiring journey that transforms recruitment into a strategic, values-driven process
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:space-x-12 space-y-8 lg:space-y-0 animate-fade-in`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="lg:w-1/2 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                </div>
                
                <div className="lg:w-1/2 flex justify-center">
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 w-80 h-48 flex items-center justify-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {step.number}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
