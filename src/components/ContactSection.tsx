
import { Button } from "@/components/ui/button";

export const ContactSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-black mb-8 tracking-tight">
            Contact Us Today
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Join the future of recruitment with AI-powered hiring that understands your values, 
            culture, and mission to find the perfect candidates for your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Button className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg font-medium rounded-sm">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white px-12 py-4 text-lg font-medium rounded-sm">
              Schedule Demo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-10 rounded-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-black rounded-sm mx-auto mb-8"></div>
            <h3 className="text-2xl font-bold text-black mb-4">For Recruiters</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Streamline your hiring process and find better candidates faster with AI-powered 
              insights and intelligent candidate matching.
            </p>
            <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-sm font-medium">
              Get Started
            </Button>
          </div>
          
          <div className="bg-white p-10 rounded-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-black rounded-sm mx-auto mb-8"></div>
            <h3 className="text-2xl font-bold text-black mb-4">For HR Teams</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Build stronger teams with values-based matching, comprehensive candidate analytics, 
              and AI-powered cultural fit assessments.
            </p>
            <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-sm font-medium">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
