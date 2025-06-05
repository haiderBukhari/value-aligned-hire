
export const StatsSection = () => {
  const stats = [
    {
      number: "2.9 Million Jobs",
      label: "Processed Successfully",
      description: "AI-powered matching dramatically speeds up your recruitment process"
    },
    {
      number: "85%",
      label: "Improvement in Culture Fit", 
      description: "Values-based matching ensures better long-term employee satisfaction"
    },
    {
      number: "89%",
      label: "Accuracy Rate",
      description: "Smart filtering presents only the most relevant applicants"
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            How are the feeling, exactly.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how our AI recruitment platform transforms hiring outcomes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-4">{stat.number}</div>
              <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
              <p className="text-gray-300 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
