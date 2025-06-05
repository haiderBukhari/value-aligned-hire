
import { Button } from "@/components/ui/button";
import { User, MessageSquare } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="py-20 bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Join the future of recruitment with AI-powered hiring that understands your values and finds the perfect cultural fits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300">
              Schedule Demo
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">For Recruiters</h3>
            <p className="text-gray-300 mb-6">Streamline your hiring process and find better candidates faster with AI-powered insights.</p>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full">
              Get Started
            </Button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">For HR Teams</h3>
            <p className="text-gray-300 mb-6">Build stronger teams with values-based matching and comprehensive candidate analytics.</p>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
