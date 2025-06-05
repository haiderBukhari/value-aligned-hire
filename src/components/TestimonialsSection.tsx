
export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Talent Acquisition", 
      company: "TechFlow",
      quote: "WILDS has revolutionized our hiring process. We're finding better cultural fits and reducing our time-to-hire by 60%. The AI insights are incredibly accurate.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Head of HR",
      company: "InnovateNow", 
      quote: "The values-based matching feature is game-changing. It's like having a recruitment expert working 24/7 to find candidates who truly align with our mission.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Recruiting Manager",
      company: "GrowthLabs",
      quote: "The AI Thought Space feature allows us to record intuitions privately while keeping the process objective. We're building stronger, more cohesive teams.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-6 tracking-tight">
            Latest Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of companies transforming their recruitment process with AI-powered hiring solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-sm border border-gray-200 overflow-hidden">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <h4 className="text-xl font-bold text-black mb-2">{testimonial.name}</h4>
                <p className="text-gray-600 mb-1 font-medium">{testimonial.role}</p>
                <p className="text-gray-500 text-sm mb-6">{testimonial.company}</p>
                <p className="text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
