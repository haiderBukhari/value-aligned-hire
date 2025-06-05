
import { Button } from "@/components/ui/button";

export const ContactSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Contact Us Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Join the future of recruitment with AI-powered hiring that understands your values and finds the perfect cultural fits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button className="bg-gray-900 text-white hover:bg-gray-800 px-12 py-4 text-lg">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Recruiters</h3>
            <p className="text-gray-600 mb-6">Streamline your hiring process and find better candidates faster with AI-powered insights.</p>
            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
              Get Started
            </Button>
          </div>
          
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 bg-gray-400 rounded"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">For HR Teams</h3>
            <p className="text-gray-600 mb-6">Build stronger teams with values-based matching and comprehensive candidate analytics.</p>
            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
