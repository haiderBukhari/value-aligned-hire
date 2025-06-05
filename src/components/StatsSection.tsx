
export const StatsSection = () => {
  const stats = [
    {
      number: "90%",
      label: "Reduction in Time-to-Hire",
      description: "AI-powered matching dramatically speeds up your recruitment process"
    },
    {
      number: "85%",
      label: "Improvement in Culture Fit",
      description: "Values-based matching ensures better long-term employee satisfaction"
    },
    {
      number: "5x",
      label: "More Qualified Candidates",
      description: "Smart filtering presents only the most relevant applicants"
    },
    {
      number: "95%",
      label: "Recruiter Satisfaction",
      description: "Streamlined workflow enhances the hiring team experience"
    }
  ];

  return (
    <section className="py-20 bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proven Results
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our AI recruitment platform transforms hiring outcomes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {stat.number}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{stat.label}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
