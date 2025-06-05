
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              The Future of Smart{" "}
              <span className="block">Textile Technology</span>{" "}
              <span className="block">is here.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your hiring process with AI-powered recruitment that understands your company's values, 
              culture, and mission to find the perfect candidates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-100 rounded-lg p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Hero Visual</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
