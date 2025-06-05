
export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Talent Acquisition", 
      company: "TechCorp",
      quote: "This AI recruitment platform has revolutionized our hiring process. We're finding better cultural fits and reducing our time-to-hire by weeks.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Head of HR",
      company: "InnovateNow", 
      quote: "The AI insights and candidate matching are incredibly accurate. It's like having a recruitment expert working 24/7 to find the perfect candidates.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "Recruiting Manager",
      company: "GrowthLabs",
      quote: "The values-based matching feature is game-changing. We're building teams that truly align with our company culture and mission.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Updates
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of companies transforming their recruitment process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{testimonial.name}</h4>
              <p className="text-gray-600 mb-2">{testimonial.role}</p>
              <p className="text-gray-500 text-sm mb-4">{testimonial.company}</p>
              <p className="text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
