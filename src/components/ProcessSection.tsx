
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Our AI Recruitment Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A seamless, intelligent hiring journey that transforms recruitment into a strategic, values-driven process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-gray-900">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
