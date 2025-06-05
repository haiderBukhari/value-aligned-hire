
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-6xl lg:text-7xl font-bold text-black leading-tight mb-8 tracking-tight">
            The Future of Smart<br />
            <span className="text-gray-700">Recruitment Technology</span><br />
            is here.
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Transform your hiring process with AI-powered recruitment that understands your company's values, 
            culture, and mission to find the perfect candidates every time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button className="bg-black text-white hover:bg-gray-800 px-10 py-4 text-lg font-medium rounded-sm">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white px-10 py-4 text-lg font-medium rounded-sm">
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-sm mb-4"></div>
            <h3 className="text-lg font-semibold text-black mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600 text-sm">Advanced algorithms analyze CVs and cultural fit to identify perfect candidates.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-sm mb-4"></div>
            <h3 className="text-lg font-semibold text-black mb-2">Company Learning</h3>
            <p className="text-gray-600 text-sm">Platform learns your company's goals, values, and culture through smart inputs.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-sm mb-4"></div>
            <h3 className="text-lg font-semibold text-black mb-2">Smart Job Creation</h3>
            <p className="text-gray-600 text-sm">Generate contextually relevant job descriptions aligned with your values.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-sm mb-4"></div>
            <h3 className="text-lg font-semibold text-black mb-2">Intelligent Scoring</h3>
            <p className="text-gray-600 text-sm">Multi-stage evaluation with AI-powered scoring and detailed insights.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
