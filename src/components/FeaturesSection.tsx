
export const FeaturesSection = () => {
  const features = [
    {
      title: "Configurable Hiring Pipeline",
      description: "Design your unique hiring process with drag-and-drop stages. Customize mandatory and optional stages to match your company's workflow perfectly.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
    },
    {
      title: "AI-Driven Interview Analysis",
      description: "Upload interview transcripts and get 100% accurate AI analysis of candidate performance, communication skills, and cultural fit assessment.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop"
    },
    {
      title: "Comprehensive Talent Pool",
      description: "Track every applicant's performance across all hiring stages with detailed analytics, scoring, and AI-powered insights for better decision making.",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop"
    },
    {
      title: "Smart Stage Scoring",
      description: "AI automatically updates candidate scores at each stage, providing real-time insights and recommendations for optimal hiring decisions.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Intelligent Recruitment Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every feature is designed to enhance your hiring process with AI-powered insights and complete customization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
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
