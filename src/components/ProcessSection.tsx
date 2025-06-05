
export const ProcessSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-6 tracking-tight">
            How Our AI Recruitment Works
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A seamless, intelligent hiring journey that transforms recruitment into a strategic, 
            values-driven process from company profiling to final hiring decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">01</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Company Profile Setup</h3>
            <p className="text-gray-600 leading-relaxed">
              Upload documents or provide structured inputs to help AI understand your company's identity, 
              goals, and cultural nuances for personalized hiring decisions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">02</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Smart Job Creation</h3>
            <p className="text-gray-600 leading-relaxed">
              Create job descriptions using AI generation or upload drafts for AI enhancement 
              and value alignment based on role objectives.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">03</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Candidate Application</h3>
            <p className="text-gray-600 leading-relaxed">
              Candidates submit CVs and cover letters through our smart portal with 
              value-fit assessments and self-introductions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">04</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">AI Analysis & Scoring</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced algorithms analyze qualifications, experience, cultural fit, 
              and mission alignment with detailed scoring metrics.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">05</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Intelligent Shortlisting</h3>
            <p className="text-gray-600 leading-relaxed">
              High-matching candidates are presented with detailed explanations 
              of why they're ideal fits for your organization.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">06</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Structured Evaluation</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage interviews, assessments, and tasks with AI-powered scoring 
              and insights throughout the entire process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
