
export const FeaturesSection = () => {
  const features = [
    {
      title: "AI-Powered Matching",
      description: "Advanced algorithms analyze CVs, cover letters, and cultural fit to identify the perfect candidates for your organization.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop"
    },
    {
      title: "Company Profile Learning",
      description: "The platform learns your company's goals, values, and culture through structured inputs and document uploads.",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=300&fit=crop"
    },
    {
      title: "Smart Job Descriptions",
      description: "Generate contextually relevant and value-aligned job descriptions using AI based on role objectives.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop"
    },
    {
      title: "Comprehensive Analysis",
      description: "Parse and analyze resumes for qualifications, experience, soft skills, and cultural alignment.",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Recruitment Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature is designed to enhance your hiring process while maintaining the human touch
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
