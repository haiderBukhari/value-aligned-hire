
export const StatsSection = () => {
  const stats = [
    {
      number: "2.9M",
      label: "Jobs Processed",
      description: "AI-powered matching dramatically speeds up your recruitment process with precise candidate selection"
    },
    {
      number: "85%",
      label: "Culture Fit Improvement", 
      description: "Values-based matching ensures better long-term employee satisfaction and retention rates"
    },
    {
      number: "89%",
      label: "Accuracy Rate",
      description: "Smart filtering and AI analysis presents only the most relevant and qualified applicants"
    }
  ];

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">
            Why WILDS?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            See how our AI recruitment platform transforms hiring outcomes with data-driven insights 
            and intelligent candidate matching.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl font-bold mb-4 text-white">{stat.number}</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">{stat.label}</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
